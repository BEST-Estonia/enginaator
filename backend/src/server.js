const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import routes
const teamRoutes = require('./routes/routes');

// Use routes - THIS WAS MISSING!
app.use('/api/teams', teamRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Enginaator Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Root route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Enginaator API Server',
    status: 'Running',
    availableEndpoints: {
      health: '/api/health',
      registerTeam: 'POST /api/teams/register',
      getAllTeams: 'GET /api/teams',
      getTeamStats: 'GET /api/teams/stats'
    }
  });
});

// 404 handler (move this AFTER all routes)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    requestedUrl: req.originalUrl,
    availableRoutes: ['/api/health', '/api/teams', '/api/teams/register', '/api/teams/stats']
  });
});

// Error handling middleware (keep this last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Teams API: http://localhost:${PORT}/api/teams`);
  console.log(`Register: POST http://localhost:${PORT}/api/teams/register`);
});