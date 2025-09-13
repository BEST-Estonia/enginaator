const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Set file size limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
}).single('image'); // 'image' should match the field name in your form

// Upload handler
exports.uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ success: false, error: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    
    // Get the server's URL from request or environment variable
    const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
    
    // Create the full URL to the uploaded file
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    // Log for debugging
    console.log('File uploaded successfully:', fileUrl);
    
    return res.status(200).json({
      success: true,
      url: fileUrl
    });
  });
};