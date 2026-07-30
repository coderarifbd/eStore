import dotenv from 'dotenv';
import crypto from 'crypto';
import postgres from 'postgres';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function setup() {
  // Create users table
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(100),
      role VARCHAR(20) DEFAULT 'staff',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('✅ users table created');

  // Check if admin exists
  const existing = await sql`SELECT id FROM users WHERE username = 'admin'`;
  if (existing.length === 0) {
    const hash = crypto.createHash('sha256').update('admin:admin123').digest('hex');
    await sql`INSERT INTO users (username, password_hash, name, role) VALUES ('admin', ${hash}, 'মালিক', 'admin')`;
    console.log('✅ Default admin account created (admin / admin123)');
  } else {
    console.log('ℹ️  Admin account already exists');
  }

  const users = await sql`SELECT id, username, name, role FROM users`;
  console.log('Users:', users);

  await sql.end();
}

setup();
