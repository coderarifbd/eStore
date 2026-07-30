import dotenv from 'dotenv';
import postgres from 'postgres';
dotenv.config();

const DEFAULT_DB_URL = "postgresql://neondb_owner:npg_NcGoRyg6k9Jq@ep-raspy-recipe-ax20vp9q-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = postgres(process.env.DATABASE_URL || DEFAULT_DB_URL, { ssl: 'require' });

async function inspectProductsTable() {
  const rows = await sql`SELECT * FROM products`;
  console.log('ALL PRODUCTS IN "products" TABLE:', JSON.stringify(rows, null, 2));

  const storeState = await sql`SELECT * FROM store_state WHERE id = 1`;
  console.log('STORE_STATE:', JSON.stringify(storeState, null, 2));

  await sql.end();
}

inspectProductsTable();
