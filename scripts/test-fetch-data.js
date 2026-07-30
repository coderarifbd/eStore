import dotenv from 'dotenv';
import postgres from 'postgres';
import { createToken } from '../api/auth-utils.js';
dotenv.config();

const DEFAULT_DB_URL = "postgresql://neondb_owner:npg_NcGoRyg6k9Jq@ep-raspy-recipe-ax20vp9q-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = postgres(process.env.DATABASE_URL || DEFAULT_DB_URL, { ssl: 'require' });

async function testFetchData() {
  const result = await sql`SELECT data FROM store_state WHERE id = 1`;
  console.log('store_state result count:', result.length);
  if (result.length > 0) {
    const data = result[0].data;
    console.log('Products count in DB:', data?.products?.length);
    console.log('Product 0:', data?.products?.[0]);
  }
  await sql.end();
}

testFetchData();
