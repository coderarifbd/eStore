import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

async function setupStoreStateTable() {
  if (!DATABASE_URL) {
    console.error("DATABASE_URL is missing.");
    process.exit(1);
  }

  const sql = postgres(DATABASE_URL, { ssl: 'require' });

  try {
    // Drop old individual tables and create a simple store_state table
    console.log("Creating store_state table...");
    await sql`
      CREATE TABLE IF NOT EXISTS store_state (
        id INT PRIMARY KEY DEFAULT 1,
        data JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("store_state table created successfully.");
    
    // Check if there's an existing row
    const existing = await sql`SELECT id FROM store_state WHERE id = 1`;
    if (existing.length === 0) {
      await sql`INSERT INTO store_state (id, data) VALUES (1, '{}'::jsonb)`;
      console.log("Inserted empty initial row.");
    } else {
      console.log("store_state already has a row.");
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await sql.end();
  }
}

setupStoreStateTable();
