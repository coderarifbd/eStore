import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;

let sql = null;
if (DATABASE_URL) {
  sql = postgres(DATABASE_URL, { ssl: 'require', max: 1 });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!sql) {
    return res.status(500).json({ error: 'DATABASE_URL is not configured.' });
  }

  try {
    const stateData = req.body;
    const jsonData = JSON.stringify(stateData);

    await sql`
      INSERT INTO store_state (id, data, updated_at)
      VALUES (1, ${jsonData}::jsonb, CURRENT_TIMESTAMP)
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
