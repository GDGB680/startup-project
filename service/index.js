import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import {
  getUserByEmail,
  getUserByToken,
  createUser as dbCreateUser,
  updateUserToken,
  clearUserToken,
  getBounties,
  getBountyById,
  createBounty as dbCreateBounty,
  getSubmissionsByUser,
  createSubmission as dbCreateSubmission,
  getUserStats
} from './database.js';

const app = express();
const httpServer = http.createServer(app);
const authCookieName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 4000;

const ws = createWebSocketServer(httpServer);

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use('/api', apiRouter);

app.wsServer = ws;


// ==================== AUTH ENDPOINTS ====================

apiRouter.get('/auth/status', verifyAuth, async (req, res) => {
  const user = await getUserByToken(req.cookies[authCookieName]);
  if (user) {
    res.send({ email: user.email });
  } else {
    res.status(401).send({ msg: 'Not authenticated' });
  }
});

apiRouter.post('/auth/create', async (req, res) => {
  const existingUser = await getUserByEmail(req.body.email);
  
  if (existingUser) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const token = uuid();
    const user = await dbCreateUser(req.body.email, passwordHash, token);
    
    setAuthCookie(res, token);
    res.send({ email: user.email });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await getUserByEmail(req.body.email);
  
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = uuid();
      await updateUserToken(user.email, token);
      setAuthCookie(res, token);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

apiRouter.delete('/auth/logout', async (req, res) => {
  const token = req.cookies[authCookieName];
  if (token) {
    await clearUserToken(token);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// ==================== BOUNTY ENDPOINTS ====================

apiRouter.get('/bounties', async (req, res) => {
  const bounties = await getBounties();
  res.send(bounties);
});

apiRouter.get('/bounties/:id', async (req, res) => {
  const bounty = await getBountyById(req.params.id);
  if (bounty) {
    res.send(bounty);
  } else {
    res.status(404).send({ msg: 'Bounty not found' });
  }
});

apiRouter.post('/bounties', verifyAuth, async (req, res) => {
  const user = await getUserByToken(req.cookies[authCookieName]);
  
  const bounty = {
    id: Date.now(),
    ...req.body,
    postedBy: user.email,
    postedDate: new Date().toISOString(),
    submissions: []
  };
  
  await dbCreateBounty(bounty);
  res.send(bounty);
});

// ==================== SUBMISSION ENDPOINTS ====================

apiRouter.get('/submissions/user', verifyAuth, async (req, res) => {
  const user = await getUserByToken(req.cookies[authCookieName]);
  const submissions = await getSubmissionsByUser(user.email);
  res.send(submissions);
});

apiRouter.post('/submissions', verifyAuth, async (req, res) => {
  const user = await getUserByToken(req.cookies[authCookieName]);
  
  const submission = {
    id: Date.now(),
    ...req.body,
    submittedBy: user.email,
    submittedDate: new Date().toISOString(),
    status: 'Pending'
  };
  
  await dbCreateSubmission(submission);
  
  ws.broadcast({
    type: 'submission_created',
    submission: submission,
    submittedBy: user.email,
    timestamp: new Date().toISOString()
  });
  
  res.send(submission);
});
// ==================== USER PROFILE ENDPOINTS ====================

apiRouter.get('/users/:email/profile', async (req, res) => {
  const stats = await getUserStats(req.params.email);
  res.send({
    email: req.params.email,
    ...stats
  });
});

// ==================== WEBSOCKET STATS ====================

apiRouter.get('/api/ws/active-users', (req, res) => {
  res.send({ activeUsers: ws.getActiveUsers() });
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
  const user = await getUserByToken(req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return default page
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Bounty Hunter service running on port ${port}`);
});
