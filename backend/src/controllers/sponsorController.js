const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

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
        //Check if an image file was uploaded
        if (!req.file) {
            return res.status(400).json({error: 'Sponsor image is required'});
        }

        // Get the image URL and sponsor name from the request
        const imageUrl = `/uploads/${req.file.filename}`;
        const {name, website, tier} = req.body;

        // Validate required fields
        if (!name) {
            return res.status(400).json({error: 'Sponsor name is required'});
        }

        // Create the sponsor in the database
        const sponsor = await prisma.sponsor.create({
            data: {
                name,
                imageUrl,
                website: website || null,
                tier: tier || null
            },
        });

        // Return the created sponsor
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
        //First, find the sponsor to get the image path
        const sponsor = await prisma.sponsor.findUnique({
            where: {id},
        });
        
        if (!sponsor) {
            return res.status(404).json({error: 'Sponsor not found'});
        }

        //Delete the image file if it exists
        if (sponsor.imageUrl) {
            // Extract the filename from the URL (e.g., /uploads/image-123456.jpg)
            const imagePath = path.join(__dirname, '../../public', sponsor.imageUrl);

            // Check if the file exists before attempting to delete
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Delete the sponsor from the database
        await prisma.sponsor.delete({
            where: {id},
        });

        //Return success message
        res.json({message: 'Sponsor deleted successfully'});
    } catch (error) {
        console.error('Error deleting sponsor:', error);
        res.status(500).json({error: 'Failed to delete sponsor'});
    }
};