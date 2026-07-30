import postgres from 'postgres';
import { verifyToken, getTokenFromRequest, hashPassword } from './auth-utils.js';

const DATABASE_URL = process.env.DATABASE_URL;
let sql = null;
if (DATABASE_URL) {
  sql = postgres(DATABASE_URL, { ssl: 'require', max: 1 });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!sql) {
    return res.status(500).json({ error: 'DATABASE_URL is not configured.' });
  }

  // Verify token
  const token = getTokenFromRequest(req);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // GET — list all users (admin only)
    if (req.method === 'GET') {
      if (payload.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      const users = await sql`SELECT id, username, name, role, created_at FROM users ORDER BY id`;
      return res.status(200).json({ users });
    }

    // POST — add new user (admin only)
    if (req.method === 'POST') {
      if (payload.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      const { username, password, name, role } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
      }
      const hash = hashPassword(username, password);
      await sql`INSERT INTO users (username, password_hash, name, role) VALUES (${username}, ${hash}, ${name || username}, ${role || 'staff'})`;
      return res.status(201).json({ success: true });
    }

    // DELETE — remove user (admin only)
    if (req.method === 'DELETE') {
      if (payload.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      const { username } = req.body;
      if (username === 'admin') {
        return res.status(400).json({ error: 'Cannot delete the main admin account' });
      }
      await sql`DELETE FROM users WHERE username = ${username}`;
      return res.status(200).json({ success: true });
    }

    // PATCH — change password (anyone for themselves, admin for anyone)
    if (req.method === 'PATCH') {
      const { username, newPassword } = req.body;
      if (!username || !newPassword) {
        return res.status(400).json({ error: 'Username and new password required' });
      }
      // Staff can only change their own password
      if (payload.role !== 'admin' && payload.username !== username) {
        return res.status(403).json({ error: 'You can only change your own password' });
      }
      const hash = hashPassword(username, newPassword);
      await sql`UPDATE users SET password_hash = ${hash} WHERE username = ${username}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Users API error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'এই ইউজারনেম আগে থেকেই আছে' });
    }
    return res.status(500).json({ error: error.message });
  }
}
