import postgres from 'postgres';

const DATABASE_URL = "postgresql://neondb_owner:npg_NcGoRyg6k9Jq@ep-raspy-recipe-ax20vp9q-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function initializeDatabase() {
  console.log("Connecting to Neon PostgreSQL...");
  const sql = postgres(DATABASE_URL, { ssl: 'require' });

  try {
    console.log("Creating tables if they do not exist...");

    // 1. Create Products Table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name_bn VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        category VARCHAR(100),
        brand VARCHAR(100),
        spec VARCHAR(100),
        stock INT DEFAULT 0,
        batches JSONB DEFAULT '[]'::jsonb
      );
    `;
    console.log("- products table checked.");

    // 2. Create Sales Table
    await sql`
      CREATE TABLE IF NOT EXISTS sales (
        id VARCHAR(50) PRIMARY KEY,
        date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        customer_name VARCHAR(255),
        customer_phone VARCHAR(50),
        customer_address TEXT,
        items JSONB NOT NULL DEFAULT '[]'::jsonb,
        sub_total NUMERIC(12, 2) DEFAULT 0,
        discount NUMERIC(12, 2) DEFAULT 0,
        grand_total NUMERIC(12, 2) DEFAULT 0,
        paid_amount NUMERIC(12, 2) DEFAULT 0,
        due_amount NUMERIC(12, 2) DEFAULT 0,
        total_cost_price NUMERIC(12, 2) DEFAULT 0
      );
    `;
    console.log("- sales table checked.");

    // 3. Create Expenses Table
    await sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id VARCHAR(50) PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        amount NUMERIC(12, 2) NOT NULL,
        date DATE NOT NULL,
        notes TEXT,
        paid_by VARCHAR(50) DEFAULT 'ক্যাশ'
      );
    `;
    console.log("- expenses table checked.");

    // 4. Create Suppliers Table
    await sql`
      CREATE TABLE IF NOT EXISTS suppliers (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        balance_due NUMERIC(12, 2) DEFAULT 0
      );
    `;
    console.log("- suppliers table checked.");

    // 5. Create Salary Transactions Table
    await sql`
      CREATE TABLE IF NOT EXISTS salary_tx (
        id VARCHAR(50) PRIMARY KEY,
        employee_id VARCHAR(50) NOT NULL,
        employee_name VARCHAR(255) NOT NULL,
        month_year VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        amount NUMERIC(12, 2) NOT NULL,
        date DATE NOT NULL,
        notes TEXT
      );
    `;
    console.log("- salary_tx table checked.");

    // 5b. Create Employees Table
    await sql`
      CREATE TABLE IF NOT EXISTS employees (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        designation VARCHAR(100),
        monthly_salary NUMERIC(12, 2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Active',
        join_date DATE
      );
    `;
    console.log("- employees table checked.");

    // 6. Create Purchase Vouchers Table
    await sql`
      CREATE TABLE IF NOT EXISTS purchases (
        id VARCHAR(50) PRIMARY KEY,
        date DATE NOT NULL,
        supplier_id VARCHAR(50),
        supplier_name VARCHAR(255),
        items JSONB NOT NULL DEFAULT '[]'::jsonb,
        grand_total NUMERIC(12, 2) DEFAULT 0,
        paid_amount NUMERIC(12, 2) DEFAULT 0,
        due_amount NUMERIC(12, 2) DEFAULT 0
      );
    `;
    console.log("- purchases table checked.");

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Database initialization failed:", error);
  } finally {
    await sql.end();
  }
}

initializeDatabase();
