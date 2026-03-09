const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 8000;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query','info','warn','error'],
});

process.on('unhandledRejection', (r) => console.error('[unhandledRejection]', r));
process.on('uncaughtException', (e) => console.error('[uncaughtException]', e));

const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_ORIGIN,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

// Enable CORSss
app.use(cors({
  origin(origin, callback) {
    if (!origin || configuredOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Parse JSON requests
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Make uploads directory publicly accessible
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// API routes
app.use('/api', routes);

// Health check route
app.get('/', (req, res) => {
  res.send('Enginaator API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
  'DB:', process.env.DATABASE_URL?.replace(/(:\/\/[^:]+:)[^@]+@/, '$1****@')
  );

});