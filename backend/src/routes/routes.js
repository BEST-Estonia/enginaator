const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// Connect routes to your controller functions
router.post('/register', teamController.registerTeam);
router.get('/', teamController.getAllTeams);
router.get('/stats', teamController.getTeamStats);

module.exports = router;