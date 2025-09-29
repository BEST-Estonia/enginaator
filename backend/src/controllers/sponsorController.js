const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

// Extract public ID from Cloudinary URL
function getCloudinaryPublicId(url) {
  // Example: https://res.cloudinary.com/your_cloud/image/upload/v1234567890/enginaator/filename.jpg
  // We want: enginaator/filename (without extension)
  const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
  return match ? match[1] : null;
}

// Get all sponsors
exports.getAllSponsors = async (req, res) => {
    try {
        // Use Prisma to fetch all sponsors, ordered by creation date
        const sponsors = await prisma.sponsor.findMany({
            orderBy: {
                createdAt: 'asc',
            },
        });

        // Send the sponsors as JSON response
        res.json(sponsors);
    } catch (error) {
        //Handle any errors
        console.error('Error fetching sponsors:', error);
        res.status(500).json({error: 'Failed to fetch sponsors'});
    }
};

// Create a new sponsor
exports.createSponsor = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({error: 'Sponsor image is required'});
        }
        const imageUrl = req.file.path; // Cloudinary URL
        const {name, website, tier} = req.body;
        if (!name) {
            return res.status(400).json({error: 'Sponsor name is required'});
        }
        const sponsor = await prisma.sponsor.create({
            data: {
                name,
                imageUrl,
                website: website || null,
                tier: tier || null
            },
        });
        res.status(201).json(sponsor);
    } catch (error) {
        console.error('Error creating sponsor:', error);
        res.status(500).json({error: 'Failed to create sponsor'});
    }
};

//Delete a sponsor
exports.deleteSponsor = async (req, res) => {
    const {id} = req.params;

    try {
        // Find the sponsor to get the image URL
        const sponsor = await prisma.sponsor.findUnique({
            where: {id},
        });
        
        if (!sponsor) {
            return res.status(404).json({error: 'Sponsor not found'});
        }

        // Delete the image from Cloudinary if it exists
        if (sponsor.imageUrl && sponsor.imageUrl.includes('cloudinary.com')) {
            const publicId = getCloudinaryPublicId(sponsor.imageUrl);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        // Delete the sponsor from the database
        await prisma.sponsor.delete({
            where: {id},
        });

        res.json({message: 'Sponsor deleted successfully'});
    } catch (error) {
        console.error('Error deleting sponsor:', error);
        res.status(500).json({error: 'Failed to delete sponsor'});
    }
};