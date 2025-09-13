const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS
app.use(cors());

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
});