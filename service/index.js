const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const app = express();
const authCookieName = 'token';

// The service port
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use('/api', apiRouter);

// In-memory data storage (will be replaced with database later)
let users = [];
let bounties = [];
let submissions = [];

// Initialize with mock data
initializeMockData();

// ==================== AUTH ENDPOINTS ====================

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
      user.token = uuid.v4();
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

// Get all bounties
apiRouter.get('/bounties', (req, res) => {
  res.send(bounties);
});

// Get bounties by user email
apiRouter.get('/bounties/user/:email', (req, res) => {
  const userBounties = bounties.filter(b => b.postedBy === req.params.email);
  res.send(userBounties);
});

// Get single bounty by ID
apiRouter.get('/bounties/:id', (req, res) => {
  const bounty = bounties.find(b => b.id === parseInt(req.params.id));
  if (bounty) {
    res.send(bounty);
  } else {
    res.status(404).send({ msg: 'Bounty not found' });
  }
});

// Create new bounty (protected)
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

// Update bounty (protected)
apiRouter.put('/bounties/:id', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  const bounty = bounties.find(b => b.id === parseInt(req.params.id));
  
  if (!bounty) {
    res.status(404).send({ msg: 'Bounty not found' });
    return;
  }
  
  if (bounty.postedBy !== user.email) {
    res.status(403).send({ msg: 'Forbidden' });
    return;
  }
  
  Object.assign(bounty, req.body);
  res.send(bounty);
});

// Delete bounty (protected)
apiRouter.delete('/bounties/:id', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  const index = bounties.findIndex(b => b.id === parseInt(req.params.id));
  
  if (index === -1) {
    res.status(404).send({ msg: 'Bounty not found' });
    return;
  }
  
  if (bounties[index].postedBy !== user.email) {
    res.status(403).send({ msg: 'Forbidden' });
    return;
  }
  
  bounties.splice(index, 1);
  res.status(204).end();
});

// ==================== SUBMISSION ENDPOINTS ====================

// Get submissions by user
apiRouter.get('/submissions/user', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  const userSubmissions = submissions.filter(s => s.submittedBy === user.email);
  res.send(userSubmissions);
});

// Get submissions for a bounty
apiRouter.get('/submissions/bounty/:bountyId', (req, res) => {
  const bountySubmissions = submissions.filter(
    s => s.bountyId === parseInt(req.params.bountyId)
  );
  res.send(bountySubmissions);
});

// Create submission (protected)
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

// Update submission status (protected, only bounty owner)
apiRouter.put('/submissions/:id/status', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  const submission = submissions.find(s => s.id === parseInt(req.params.id));
  
  if (!submission) {
    res.status(404).send({ msg: 'Submission not found' });
    return;
  }
  
  // Verify user owns the bounty
  const bounty = bounties.find(b => b.id === submission.bountyId);
  if (!bounty || bounty.postedBy !== user.email) {
    res.status(403).send({ msg: 'Forbidden' });
    return;
  }
  
  submission.status = req.body.status;
  res.send(submission);
});

// Delete submission (protected)
apiRouter.delete('/submissions/:id', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  const index = submissions.findIndex(s => s.id === parseInt(req.params.id));
  
  if (index === -1) {
    res.status(404).send({ msg: 'Submission not found' });
    return;
  }
  
  if (submissions[index].submittedBy !== user.email) {
    res.status(403).send({ msg: 'Forbidden' });
    return;
  }
  
  submissions.splice(index, 1);
  res.status(204).end();
});

// ==================== USER PROFILE ENDPOINTS ====================

// Get user profile and stats
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

// Get inspirational advice
apiRouter.get('/api/advice', async (req, res) => {
  try {
    const response = await fetch('https://api.adviceslip.com/advice');
    const data = await response.json();
    res.send(data.slip);
  } catch (error) {
    res.status(500).send({ msg: 'Failed to fetch advice' });
  }
});

// ==================== MIDDLEWARE ====================

// Verify user is authenticated
async function verifyAuth(req, res, next) {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
}

// ==================== HELPER FUNCTIONS ====================

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
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

function initializeMockData() {
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
}

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
