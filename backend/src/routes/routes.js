const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { getHeroSection, updateHeroSection } = require('../controllers/heroController');

// Team routes (with /teams prefix)
router.post('/teams/register', teamController.registerTeam);
router.get('/teams', teamController.getAllTeams);
router.get('/teams/stats', teamController.getTeamStats);

// Hero Section Routes
router.get('/hero', getHeroSection);
router.put('/hero', updateHeroSection);

module.exports = router;