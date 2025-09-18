const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Gallery specific storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads/gallery/'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 10 * 1024 * 1024}, //10MB size limit
    fileFilter: (req, file, cb) => {
    // Accept only images
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
}).single('image');


exports.getAllGalleryImages = async (req, res) => {
    try {
        //Use prisma to fetch all the current images
        const images = await prisma.galleryImage.findMany({
            orderBy: {
                createdAt: 'asc',
            },
        });

        //send the image as JSON response
        res.json(images)
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        res.status(500).json({error: 'Failed to fetch gallery images'});
    }
}

exports.createImage = async (req, res) => {
  // Use the upload middleware first
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { alt, caption } = req.body;
      
      const galleryImage = await prisma.galleryImage.create({
        data: {
          url: `/uploads/gallery/${req.file.filename}`,
          alt: alt || null,
          caption: caption || null
        }
      });

      res.status(201).json({
        message: 'Gallery image uploaded successfully',
        galleryImage
      });
    } catch (error) {
      console.error('Error saving gallery image:', error);
      res.status(500).json({ error: 'Failed to save gallery image' });
    }
  });
};

exports.deleteGalleryImage = async (req, res) => {
    const {id} = req.params;

    try {
        // First, get the image record to find the file path
        const galleryImage = await prisma.galleryImage.findUnique({
            where: {id}
        });

        if (!galleryImage) {
             return res.status(404).json({ error: 'Gallery image not found' });
        }

        //Delete the file from filesystem
        const filePath = path.join(__dirname, '../../public', galleryImage.url);

        // Check if the file exists before attempting to delete
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        //Delete from database
        await prisma.galleryImage.delete({
            where: {id}
        });

        res.json({ message: 'Gallery image deleted successfully' });

    } catch (error) {
        console.error('Error deleting gallery image:', error);
        res.status(500).json({ error: 'Failed to delete gallery image' });
    }
}