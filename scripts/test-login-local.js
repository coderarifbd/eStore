import dotenv from 'dotenv';
import postgres from 'postgres';
import crypto from 'crypto';
dotenv.config();

const DEFAULT_DB_URL = "postgresql://neondb_owner:npg_NcGoRyg6k9Jq@ep-raspy-recipe-ax20vp9q-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const dbUrl = process.env.DATABASE_URL || DEFAULT_DB_URL;

const sql = postgres(dbUrl, { ssl: 'require' });

async function testLocalLogin() {
  console.log('Testing local DB connection and admin user...');
  try {
    const users = await sql`SELECT * FROM users WHERE username = 'admin'`;
    console.log('Found users:', users.length);
    if (users.length > 0) {
      const user = users[0];
      const inputHash = crypto.createHash('sha256').update('admin:admin123').digest('hex');
      console.log('DB hash:', user.password_hash);
      console.log('Input hash:', inputHash);
      console.log('Password match?:', user.password_hash === inputHash);
      if (user.password_hash === inputHash) {
        console.log('SUCCESS: Admin authentication verified locally!');
      } else {
        console.log('FAILED: Password hash mismatch!');
      }
    } else {
      console.log('FAILED: Admin user not found in DB!');
    }
  } catch (err) {
    console.error('Error during local auth test:', err);
  } finally {
    await sql.end();
  }
}

testLocalLogin();
