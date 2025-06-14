const express = require('express');
const redis = require('redis');
const bcrypt = require('bcryptjs');
const router = express.Router();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const client = redis.createClient({ url: redisUrl });
client.connect().catch(err => console.error('Redis connection error', err));

async function initAdmin() {
  try {
    const exists = await client.exists('user:Administrator');
    if (!exists) {
      const hashed = await bcrypt.hash('1q2w3e4r', 10);
      await client.hSet('user:Administrator', 'password', hashed, 'role', 'admin');
    }
  } catch (err) {
    console.error('Error initializing admin user', err);
  }
}
initAdmin();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'missing' });
  const exists = await client.exists(`user:${username}`);
  if (exists) return res.status(400).json({ error: 'exists' });
  const hashed = await bcrypt.hash(password, 10);
  await client.hSet(`user:${username}`, 'password', hashed);
  res.json({ status: 'ok' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'missing' });
  const user = await client.hGetAll(`user:${username}`);
  if (!user || !user.password) return res.status(400).json({ error: 'invalid' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'invalid' });
  req.session.user = username;
  res.json({ status: 'ok' });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {});
  res.json({ status: 'ok' });
});

module.exports = { router, client };
