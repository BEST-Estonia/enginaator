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
const aboutController = require('../controllers/aboutController');
const footerController = require('../controllers/footerController');
const galleryController = require('../controllers/galleryController');
const mainSponsorController = require('../controllers/mainSponsorController');
const fieldController = require('../controllers/fieldController');
const projectTeamController = require('../controllers/projectTeamController');
const faqController = require('../controllers/faqController');
const settingsController = require('../controllers/settingsController');
const registrationFormController = require('../controllers/registrationFormController');
const { requireAdminAuth } = require('../middleware/adminAuth');

// Admin auth
const adminAuthController = require('../controllers/adminAuthController');

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

// --- About / Üritusest ---
router.get('/about', aboutController.getAboutSection);
router.put('/about', requireAdminAuth, aboutController.updateAboutSection);

// --- Footer ---
router.get('/footer', footerController.getFooterSection);
router.put('/footer', requireAdminAuth, footerController.updateFooterSection);

// --- Gallery ---
router.get('/gallery', galleryController.getAllGalleryImages);
router.post('/gallery', galleryController.createImage);
router.delete('/gallery/:id', galleryController.deleteGalleryImage);

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

// --- FAQ ---
router.get('/faqs', faqController.getFaqItems);
router.post('/faqs', requireAdminAuth, faqController.createFaqItem);
router.put('/faqs/:id', requireAdminAuth, faqController.updateFaqItem);
router.delete('/faqs/:id', requireAdminAuth, faqController.deleteFaqItem);

// --- Settings ---
router.get('/settings/registration', settingsController.getRegistrationSettings);
router.put('/settings/registration', settingsController.updateRegistrationSettings);

// --- Registration form config/questions ---
router.get('/registration-form/config', registrationFormController.getRegistrationFormConfig);
router.get('/registration-form/questions', requireAdminAuth, registrationFormController.getRegistrationQuestions);
router.post('/registration-form/questions', requireAdminAuth, registrationFormController.createRegistrationQuestion);
router.put('/registration-form/questions/:id', requireAdminAuth, registrationFormController.updateRegistrationQuestion);
router.delete('/registration-form/questions/:id', requireAdminAuth, registrationFormController.deleteRegistrationQuestion);

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

// --- Admin login ---
router.post('/admin/login', adminAuthController.login);

module.exports = router;
