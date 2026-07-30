import postgres from 'postgres';
import { verifyToken, getTokenFromRequest, getDbUrl } from './auth-utils.js';

const sql = postgres(getDbUrl(), { ssl: 'require', max: 1 });

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

  try {
    const stateData = req.body;

    // 1. Save to store_state
    await sql`
      INSERT INTO store_state (id, data, updated_at)
      VALUES (1, ${sql.json(stateData)}, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        data = EXCLUDED.data,
        updated_at = CURRENT_TIMESTAMP
    `;

    // 2. Also sync products table for direct Neon DB table visibility
    if (stateData.products && Array.isArray(stateData.products)) {
      if (stateData.products.length > 0) {
        const ids = stateData.products.map(p => p.id);
        await sql`DELETE FROM products WHERE id != ALL(${ids})`;
        for (let p of stateData.products) {
          const firstVariant = (p.variants && p.variants[0]) || {};
          await sql`
            INSERT INTO products (id, name_bn, name_en, category, brand, spec, stock, batches)
            VALUES (
              ${p.id}, 
              ${p.nameBn || null}, 
              ${p.nameEn || p.nameBn || null}, 
              ${p.categoryId || null}, 
              ${p.brand || null}, 
              ${firstVariant.spec || null}, 
              ${firstVariant.stock || 0}, 
              ${JSON.stringify(firstVariant.batches || [])}
            )
            ON CONFLICT (id) DO UPDATE SET
              name_bn = EXCLUDED.name_bn,
              name_en = EXCLUDED.name_en,
              category = EXCLUDED.category,
              brand = EXCLUDED.brand,
              spec = EXCLUDED.spec,
              stock = EXCLUDED.stock,
              batches = EXCLUDED.batches
          `;
        }
      } else {
        await sql`DELETE FROM products`;
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('POST /api/sync error:', error);
    return res.status(500).json({ error: error.message });
  }
}
