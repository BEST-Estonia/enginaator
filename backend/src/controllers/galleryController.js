const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'enginaator/gallery',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});
const upload = multer({ storage: storage }).single('image');


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
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      const { alt, caption } = req.body;
      const galleryImage = await prisma.galleryImage.create({
        data: {
          url: req.file.path, // Cloudinary URL
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
  const { id } = req.params;
  try {
    const image = await prisma.galleryImage.findUnique({ where: { id } });
    if (!image) {
      return res.status(404).json({ error: 'Gallery image not found' });
    }

    if (image.url && image.url.includes('cloudinary.com')) {
      const publicId = getCloudinaryPublicId(image.url);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await prisma.galleryImage.delete({ where: { id } });
    res.json({ message: 'Gallery image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ error: 'Failed to delete gallery image' });
  }
};

function getCloudinaryPublicId(url) {
  const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
  return match ? match[1] : null;
}