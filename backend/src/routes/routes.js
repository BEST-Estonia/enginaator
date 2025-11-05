const express = require('express');
const router = express.Router();

;(['get','post','put','delete','use']).forEach((m) => {
  const orig = router[m].bind(router);
  router[m] = function (path, ...handlers) {
    try { console.log('[ROUTE]', m.toUpperCase(), path); } catch {}
    return orig(path, ...handlers);
  };
});

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const teamController = require('../controllers/teamController');
const { getHeroSection, updateHeroSection } = require('../controllers/heroController');
const { uploadImage } = require('../controllers/uploadController');
const sponsorController = require('../controllers/sponsorController');
const introductionController = require('../controllers/introductionController');
const galleryController = require('../controllers/galleryController');
const aboutController = require('../controllers/aboutController');
const mainSponsorController = require('../controllers/mainSponsorController');
const fieldController = require('../controllers/fieldController');
const projectTeamController = require('../controllers/projectTeamController');

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'enginaator', allowed_formats: ['jpg','png','jpeg','webp'] },
});
const upload = multer({ storage });

// --- Teams ---
router.post('/teams/register', teamController.registerTeam);
router.get('/teams', teamController.getAllTeams);
router.get('/teams/stats', teamController.getTeamStats);
router.delete('/teams/:id', teamController.deleteTeam);

// --- Hero ---
router.get('/hero', getHeroSection);
router.put('/hero', updateHeroSection);

// --- Upload ---
router.post('/upload', uploadImage);

// --- Sponsors ---
router.get('/sponsors', sponsorController.getAllSponsors);
router.post('/sponsors', upload.single('image'), sponsorController.createSponsor);
router.delete('/sponsors/:id', sponsorController.deleteSponsor);

// --- Introduction ---
router.get('/introduction', introductionController.getIntroduction);
router.put('/introduction', introductionController.updateIntroduction);
router.post('/introduction/default', introductionController.createDefaultIntroduction);

// --- Gallery ---
router.get('/gallery', galleryController.getAllGalleryImages);
router.post('/gallery', galleryController.createImage);
router.delete('/gallery/:id', galleryController.deleteGalleryImage);

// --- About Section ---
router.get('/aboutSection', aboutController.getAbout);
router.put('/aboutSection', aboutController.updateAbout);
router.post('/aboutSection', aboutController.createDefaultAbout);

// --- Main Sponsors ---
router.get('/mainSponsors', mainSponsorController.getMainSponsors);
router.post('/mainSponsors', upload.single('image'), mainSponsorController.createMainSponsor);
router.put('/mainSponsors/:id', mainSponsorController.updateMainSponsor);
router.delete('/mainSponsors/:id', mainSponsorController.deleteMainSponsor);

// --- Fields ---
router.get('/fields', fieldController.getFields);
router.post('/fields', fieldController.createField);
router.put('/fields/:id', fieldController.updateField);
router.delete('/fields/:id', fieldController.deleteField);

// --- Project Members ---
router.get('/projectMembers', projectTeamController.getProjectMembers);
router.post('/projectMembers', upload.single('image'), projectTeamController.createProjectMember);
router.put('/projectMembers/:id', upload.single('image'), projectTeamController.updateProjectMember);
router.delete('/projectMembers/:id', projectTeamController.deleteProjectMember);

// --- Hero image upload ---
const heroImageStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'enginaator/hero', allowed_formats: ['jpg','png','jpeg','webp'] },
});
router.post('/hero/upload', multer({ storage: heroImageStorage }).single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
    res.json({ success: true, url: req.file.path, message: 'Hero image uploaded successfully' });
  } catch (error) {
    console.error('Hero image upload error:', error);
    res.status(500).json({ success: false, error: 'Failed to upload hero image' });
  }
});

module.exports = router;
