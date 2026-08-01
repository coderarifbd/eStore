import postgres from 'postgres';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_BRANDS, 
  INITIAL_SUPPLIERS, 
  INITIAL_EMPLOYEES, 
  INITIAL_SALARY_TRANSACTIONS, 
  INITIAL_EXPENSES, 
  INITIAL_SALES, 
  INITIAL_PURCHASE_VOUCHERS 
} from '../src/data/demoData.js';

const DATABASE_URL = "postgresql://neondb_owner:npg_NcGoRyg6k9Jq@ep-raspy-recipe-ax20vp9q-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";
const sql = postgres(DATABASE_URL, { ssl: 'require' });

async function main() {
  console.log("Starting Full Neon DB Sync...");

  const fullData = {
    products: INITIAL_PRODUCTS,
    categories: INITIAL_CATEGORIES,
    brands: INITIAL_BRANDS,
    suppliers: INITIAL_SUPPLIERS,
    employees: INITIAL_EMPLOYEES,
    salaryTx: INITIAL_SALARY_TRANSACTIONS,
    expenses: INITIAL_EXPENSES,
    sales: INITIAL_SALES,
    purchases: INITIAL_PURCHASE_VOUCHERS
  };

  // 1. Sync store_state JSON
  await sql`
    CREATE TABLE IF NOT EXISTS store_state (
      id INT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    INSERT INTO store_state (id, data, updated_at)
    VALUES (1, ${sql.json(fullData)}, CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO UPDATE SET
      data = EXCLUDED.data,
      updated_at = CURRENT_TIMESTAMP;
  `;
  console.log("✓ store_state table synced.");

  // 2. Sync suppliers table
  await sql`
    CREATE TABLE IF NOT EXISTS suppliers (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      address TEXT,
      balance_due NUMERIC(12, 2) DEFAULT 0
    );
  `;

  for (let sup of INITIAL_SUPPLIERS) {
    await sql`
      INSERT INTO suppliers (id, name, phone, address, balance_due)
      VALUES (${sup.id}, ${sup.name}, ${sup.phone}, ${sup.address}, ${sup.balanceDue})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        address = EXCLUDED.address,
        balance_due = EXCLUDED.balance_due;
    `;
  }
  console.log("✓ suppliers table synced.");

  // Check counts
  const supCount = await sql`SELECT COUNT(*) FROM suppliers`;
  const stateCheck = await sql`SELECT id FROM store_state WHERE id = 1`;

  console.log("-----------------------------------------");
  console.log("Neon DB Full Sync Complete!");
  console.log("Suppliers Count:", supCount[0].count);
  console.log("Store State Record Exists:", stateCheck.length > 0);
  console.log("-----------------------------------------");

  process.exit(0);
}

main().catch(err => {
  console.error("SYNC FAILED:", err);
  process.exit(1);
});
