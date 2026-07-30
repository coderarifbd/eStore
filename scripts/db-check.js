import postgres from 'postgres';

const DATABASE_URL = "postgresql://neondb_owner:npg_NcGoRyg6k9Jq@ep-raspy-recipe-ax20vp9q-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function checkDatabase() {
  const sql = postgres(DATABASE_URL, { ssl: 'require' });

  try {
    const products = await sql`SELECT COUNT(*) FROM products`;
    const sales = await sql`SELECT COUNT(*) FROM sales`;
    console.log("Database Connection Status: SUCCESS");
    console.log("Products in DB:", products[0].count);
    console.log("Sales in DB:", sales[0].count);
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await sql.end();
  }
}

checkDatabase();
