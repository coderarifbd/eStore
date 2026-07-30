import dotenv from 'dotenv';
import postgres from 'postgres';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

const result = await sql`SELECT id, data, updated_at FROM store_state WHERE id = 1`;
if (result.length > 0) {
  const data = result[0].data;
  console.log('store_state updated_at:', result[0].updated_at);
  console.log('Has products:', Array.isArray(data?.products), 'count:', data?.products?.length || 0);
  console.log('Has sales:', Array.isArray(data?.sales), 'count:', data?.sales?.length || 0);
  console.log('Keys:', Object.keys(data || {}));
  console.log('First 300 chars:', JSON.stringify(data).substring(0, 300));
} else {
  console.log('No row found in store_state');
}

await sql.end();
