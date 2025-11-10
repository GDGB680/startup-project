import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const app = express();
const authCookieName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use('/api', apiRouter);

let users = [];
let bounties = [];
let submissions = [];

// ==================== AUTH ENDPOINTS ====================

// Check auth status
apiRouter.get('/auth/status', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    res.send({ email: user.email });
  } else {
    res.status(401).send({ msg: 'Not authenticated' });
  }
});

// Create a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

// Login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid();
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// Logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// ==================== BOUNTY ENDPOINTS ====================

apiRouter.get('/bounties', (req, res) => {
  res.send(bounties);
});

apiRouter.get('/bounties/:id', (req, res) => {
  const bounty = bounties.find(b => b.id === parseInt(req.params.id));
  if (bounty) {
    res.send(bounty);
  } else {
    res.status(404).send({ msg: 'Bounty not found' });
  }
});

apiRouter.post('/bounties', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  const bounty = {
    id: Date.now(),
    ...req.body,
    postedBy: user.email,
    postedDate: new Date().toISOString(),
    submissions: []
  };
  bounties.push(bounty);
  res.send(bounty);
});

// ==================== SUBMISSION ENDPOINTS ====================

apiRouter.get('/submissions/user', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  const userSubmissions = submissions.filter(s => s.submittedBy === user.email);
  res.send(userSubmissions);
});

apiRouter.post('/submissions', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  const submission = {
    id: Date.now(),
    ...req.body,
    submittedBy: user.email,
    submittedDate: new Date().toISOString(),
    status: 'Pending'
  };
  submissions.push(submission);
  res.send(submission);
});

// ==================== USER PROFILE ENDPOINTS ====================

apiRouter.get('/users/:email/profile', (req, res) => {
  const userBounties = bounties.filter(b => b.postedBy === req.params.email);
  const userSubmissions = submissions.filter(s => s.submittedBy === req.params.email);
  const wonSubmissions = userSubmissions.filter(s => s.status === 'Winner');
  
  res.send({
    email: req.params.email,
    bountiesPosted: userBounties.length,
    bountiesEntered: userSubmissions.length,
    bountiesWon: wonSubmissions.length
  });
});

// ==================== THIRD PARTY API ====================

apiRouter.get('/advice', async (req, res) => {
  try {
    const response = await fetch('https://api.adviceslip.com/advice');
    const data = await response.json();
    res.send({ advice: data.slip.advice });
  } catch (error) {
    res.status(500).send({ msg: 'Failed to fetch advice' });
  }
});

// ==================== MIDDLEWARE & HELPERS ====================

async function verifyAuth(req, res, next) {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
}

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    email: email,
    password: passwordHash,
    token: uuid(),
  };
  users.push(user);
  return user;
}

async function findUser(field, value) {
  if (!value) return null;
  return users.find((u) => u[field] === value);
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Initialize mock data
bounties = [
  {
    id: 1,
    title: 'Epic Orchestra for Film Trailer',
    genres: ['Orchestra', 'Cinematic'],
    bountyPrize: 50,
    duration: '45s',
    deadline: '2025-11-15',
    details: 'Need dramatic orchestral music',
    postedBy: 'filmmaker@example.com',
    postedDate: new Date().toISOString()
  }
];

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return default page
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
