import postgres from 'postgres';
import { verifyToken, getTokenFromRequest } from './auth-utils.js';

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

  // Verify authentication
  const token = getTokenFromRequest(req);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!sql) {
    return res.status(500).json({ error: 'DATABASE_URL is not configured.' });
  }

  try {
    const stateData = req.body;

    await sql`
      INSERT INTO store_state (id, data, updated_at)
      VALUES (1, ${sql.json(stateData)}, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        data = EXCLUDED.data,
        updated_at = CURRENT_TIMESTAMP
    `;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('POST /api/sync error:', error);
    return res.status(500).json({ error: error.message });
  }
}
