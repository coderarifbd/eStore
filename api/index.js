import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authHandler from './auth.js';
import usersHandler from './users.js';
import dataHandler from './data.js';
import syncHandler from './sync.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.all('/api/auth', (req, res) => authHandler(req, res));
app.all('/api/users', (req, res) => usersHandler(req, res));
app.all('/api/data', (req, res) => dataHandler(req, res));
app.all('/api/sync', (req, res) => syncHandler(req, res));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serverless API backend running on http://localhost:${PORT}`);
});

export default app;
