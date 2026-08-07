import postgres from 'postgres';

const DATABASE_URL = "postgresql://neondb_owner:npg_NcGoRyg6k9Jq@ep-raspy-recipe-ax20vp9q-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";
const sql = postgres(DATABASE_URL, { ssl: 'require' });

async function inspect() {
  console.log("=== NEON DB INSPECTION ===");
  
  const tables = ['store_state', 'products', 'sales', 'purchases', 'suppliers', 'expenses', 'employees', 'salary_tx', 'users'];
  
  for (let tbl of tables) {
    try {
      const rows = await sql`SELECT * FROM ${sql(tbl)}`;
      console.log(`Table '${tbl}': ${rows.length} rows`);
      if (tbl === 'store_state' && rows.length > 0) {
        console.log("store_state data preview:", JSON.stringify(rows[0].data).substring(0, 300));
      }
    } catch (e) {
      console.log(`Table '${tbl}': Error - ${e.message}`);
    }
  }
  
  process.exit(0);
}

inspect().catch(err => {
  console.error(err);
  process.exit(1);
});
