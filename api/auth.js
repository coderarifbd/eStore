import postgres from 'postgres';
import { createToken, hashPassword } from './auth-utils.js';

const DATABASE_URL = process.env.DATABASE_URL;
let sql = null;
if (DATABASE_URL) {
  sql = postgres(DATABASE_URL, { ssl: 'require', max: 1 });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!sql) {
    return res.status(500).json({ error: 'DATABASE_URL is not configured.' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const users = await sql`SELECT * FROM users WHERE username = ${username}`;
    if (users.length === 0) {
      return res.status(401).json({ error: 'ভুল ইউজারনেম বা পাসওয়ার্ড' });
    }

    const user = users[0];
    const inputHash = hashPassword(username, password);

    if (inputHash !== user.password_hash) {
      return res.status(401).json({ error: 'ভুল ইউজারনেম বা পাসওয়ার্ড' });
    }

    const token = createToken({ username: user.username, role: user.role, name: user.name });

    return res.status(200).json({
      success: true,
      token,
      user: {
        username: user.username,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: error.message });
  }
}
