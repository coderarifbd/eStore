import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authHandler from '../api/auth.js';

const app = express();
app.use(cors());
app.use(express.json());
app.post('/api/auth', authHandler);

const server = app.listen(3099, async () => {
  console.log('Test Express API server running on 3099...');
  try {
    const res = await fetch('http://localhost:3099/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    const data = await res.json();
    console.log('HTTP Status:', res.status);
    console.log('Response body:', data);
    if (res.status === 200 && data.success) {
      console.log('PASSED: /api/auth endpoint works perfectly locally!');
    } else {
      console.log('FAILED:', data);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  } finally {
    server.close();
  }
});
