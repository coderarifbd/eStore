import dotenv from 'dotenv';
import postgres from 'postgres';
dotenv.config();

const DEFAULT_DB_URL = "postgresql://neondb_owner:npg_NcGoRyg6k9Jq@ep-raspy-recipe-ax20vp9q-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const dbUrl = process.env.DATABASE_URL || DEFAULT_DB_URL;

const sql = postgres(dbUrl, { ssl: 'require' });

async function inspectAllTables() {
  console.log('Inspecting all tables in Neon DB...');
  const tables = ['products', 'sales', 'expenses', 'suppliers', 'salary_tx', 'employees', 'purchases', 'store_state'];

  for (const table of tables) {
    try {
      const rows = await sql.unsafe(`SELECT * FROM ${table} LIMIT 5`);
      const count = await sql.unsafe(`SELECT COUNT(*) FROM ${table}`);
      console.log(`Table '${table}': Total count = ${count[0].count}`);
      if (rows.length > 0) {
        console.log(`  Sample row from '${table}':`, JSON.stringify(rows[0]).substring(0, 150));
      }
    } catch (err) {
      console.log(`Table '${table}': Error or missing - ${err.message}`);
    }
  }

  await sql.end();
}

inspectAllTables();
