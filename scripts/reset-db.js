import dotenv from 'dotenv';
import postgres from 'postgres';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

// Reset store_state to empty so the app starts clean
await sql`UPDATE store_state SET data = '{}'::jsonb, updated_at = CURRENT_TIMESTAMP WHERE id = 1`;
console.log('store_state reset to empty {}');

// Verify
const result = await sql`SELECT data FROM store_state WHERE id = 1`;
console.log('Verification - keys:', Object.keys(result[0].data || {}));
console.log('Done!');

await sql.end();
