import postgres from 'postgres';

const DATABASE_URL = "postgresql://neondb_owner:npg_NcGoRyg6k9Jq@ep-raspy-recipe-ax20vp9q-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function queryAll() {
  const sql = postgres(DATABASE_URL, { ssl: 'require' });

  try {
    const products = await sql`SELECT * FROM products`;
    console.log("Products in DB:", products);
  } catch (error) {
    console.error("Query failed:", error);
  } finally {
    await sql.end();
  }
}

queryAll();
