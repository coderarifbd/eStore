import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;

let sql = null;
if (DATABASE_URL) {
  sql = postgres(DATABASE_URL, { ssl: 'require', max: 1 });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!sql) {
    return res.status(500).json({ error: 'DATABASE_URL is not configured.' });
  }

  try {
    const result = await sql`SELECT data FROM store_state WHERE id = 1`;
    if (result.length === 0 || !result[0].data) {
      return res.status(200).json({});
    }
    return res.status(200).json(result[0].data);
  } catch (error) {
    console.error('GET /api/data error:', error);
    return res.status(500).json({ error: error.message });
  }
}
