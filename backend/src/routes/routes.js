const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const teamController = require('../controllers/teamController');
const { getHeroSection, updateHeroSection } = require('../controllers/heroController');
const { uploadImage } = require('../controllers/uploadController');
const sponsorController = require('../controllers/sponsorController');
const introductionController = require('../controllers/introductionController');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Team routes (with /teams prefix)
router.post('/teams/register', teamController.registerTeam);
router.get('/teams', teamController.getAllTeams);
router.get('/teams/stats', teamController.getTeamStats);

// Hero Section Routes
router.get('/hero', getHeroSection);
router.put('/hero', updateHeroSection);

// Upload routes
router.post('/upload', uploadImage);

// Sponsor routes
router.get('/sponsors', sponsorController.getAllSponsors);
router.post('/sponsors', upload.single('image'), sponsorController.createSponsor);
router.delete('/sponsors/:id', sponsorController.deleteSponsor);


// Introduction routes
router.get('/introduction', introductionController.getIntroduction);
router.put('/introduction', introductionController.updateIntroduction);
router.post('/introduction/default', introductionController.createDefaultIntroduction);

module.exports = router;