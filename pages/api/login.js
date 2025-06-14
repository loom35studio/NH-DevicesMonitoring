import { db, dbAvailable } from '../../../routes/settings.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { username, password } = req.body || {};
  if (!dbAvailable) {
    return res.status(503).json({ error: 'DB unavailable' });
  }
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM users WHERE username=? AND password=?',
      [username, password]
    );
    if (rows.length > 0) {
      return res.status(200).json({ success: true });
    }
    return res.status(401).json({ success: false });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Database error' });
  }
}
