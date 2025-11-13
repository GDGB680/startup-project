import { MongoClient } from 'mongodb';
import config from './dbConfig.json' assert { type: 'json' };

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('bounty_hunter');

// Initialize connection
(async function initializeConnection() {
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log(`Connected to MongoDB: ${config.hostname}`);
  } catch (ex) {
    console.error(`MongoDB Connection Failed: ${ex.message}`);
    process.exit(1);
  }
})();

// ==================== USER DATABASE FUNCTIONS ====================

export async function getUserByEmail(email) {
  return db.collection('users').findOne({ email });
}

export async function getUserByToken(token) {
  return db.collection('users').findOne({ token });
}

export async function createUser(email, passwordHash, token) {
  const user = {
    email,
    password: passwordHash,
    token,
    createdDate: new Date()
  };
  await db.collection('users').insertOne(user);
  return user;
}

export async function updateUserToken(email, token) {
  await db.collection('users').updateOne(
    { email },
    { $set: { token } }
  );
}

export async function clearUserToken(token) {
  await db.collection('users').updateOne(
    { token },
    { $unset: { token: '' } }
  );
}

// ==================== BOUNTY DATABASE FUNCTIONS ====================

export async function getBounties() {
  return db.collection('bounties')
    .find()
    .sort({ postedDate: -1 })
    .toArray();
}

export async function getBountyById(id) {
  return db.collection('bounties').findOne({ id: parseInt(id) });
}

export async function createBounty(bounty) {
  await db.collection('bounties').insertOne(bounty);
  return bounty;
}

export async function updateBounty(id, updates) {
  await db.collection('bounties').updateOne(
    { id: parseInt(id) },
    { $set: updates }
  );
}

export async function deleteBounty(id) {
  await db.collection('bounties').deleteOne({ id: parseInt(id) });
}

// ==================== SUBMISSION DATABASE FUNCTIONS ====================

export async function getSubmissions() {
  return db.collection('submissions')
    .find()
    .sort({ submittedDate: -1 })
    .toArray();
}

export async function getSubmissionsByUser(email) {
  return db.collection('submissions')
    .find({ submittedBy: email })
    .sort({ submittedDate: -1 })
    .toArray();
}

export async function getSubmissionsByBounty(bountyId) {
  return db.collection('submissions')
    .find({ bountyId: parseInt(bountyId) })
    .sort({ submittedDate: -1 })
    .toArray();
}

export async function createSubmission(submission) {
  await db.collection('submissions').insertOne(submission);
  return submission;
}

export async function updateSubmission(id, updates) {
  await db.collection('submissions').updateOne(
    { id: parseInt(id) },
    { $set: updates }
  );
}

export async function deleteSubmission(id) {
  await db.collection('submissions').deleteOne({ id: parseInt(id) });
}

// ==================== USER STATS FUNCTIONS ====================

export async function getUserStats(email) {
  const bountiesPosted = await db.collection('bounties').countDocuments({ postedBy: email });
  const bountiesEntered = await db.collection('submissions').countDocuments({ submittedBy: email });
  const bountiesWon = await db.collection('submissions').countDocuments({ 
    submittedBy: email, 
    status: 'Winner' 
  });

  return {
    bountiesPosted,
    bountiesEntered,
    bountiesWon
  };
}