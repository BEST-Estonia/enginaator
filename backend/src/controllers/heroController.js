const {PrismaClient} = require('@prisma/client');
const {z} = require('zod');

const prisma = new PrismaClient();

//Validation schema
const HeroSchema = z.object({
    dateText: z.string().min(1, 'Date text is required'),
    mainTitle: z.string().min(1, 'Main title is required'),
    eventDate: z.string().min(1, 'Event date is required'),
    backgroundImage: z.string().min(1, 'Background image is required'),
    eventDateInfo: z.string().min(1, 'Event date info is required'),
    location: z.string().min(1, 'Location is required'),
    audience: z.string().min(1, 'Audience is required'),
    duration: z.string().min(1, 'Duration is required'),
});

// GET /api/hero - Get hero section data
const getHeroSection = async (req, res) => {
    try {
        let heroData = await prisma.heroSection.findFirst({
            orderBy: {updatedAt: 'desc'}
        });

        // If no data exists, create default with Cloudinary image
        if (!heroData) {
            heroData = await prisma.heroSection.create({
                data: {
                    dateText: "17-20 APRILL 2025",
                    mainTitle: "ÜLE-EESTILINE INSENERIVÕISTLUS",
                    eventDate: "April 17, 2026 00:00:00",
                    backgroundImage: "https://res.cloudinary.com/dbrjkyg3a/image/upload/v1759439184/hero-img_anlffe.jpg",
                    eventDateInfo: "17-20. aprill 2026",
                    location: "TalTech",
                    audience: "Insenerihuvilistele noortele",
                    duration: "4 päeva"
                }
            });
        }

        res.json({
            success: true,
            data: heroData
        });
    } catch (error) {
        console.error('Error fetching hero data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch hero data'
        });
    }
};

// PUT /api/hero - Update hero section
const updateHeroSection = async (req, res) => {
    try {
        //Validate input
        const validatedData = HeroSchema.parse(req.body);

        // Find existing or create new
        const existingHero = await prisma.heroSection.findFirst();

        let heroData;
        if (existingHero) {
            heroData = await prisma.heroSection.update({
                where: {id: existingHero.id},
                data: validatedData 
            });
        } else {
            heroData = await prisma.heroSection.create({
                data: validatedData
            });
        }
        res.json({
            success: true,
            message: 'Hero section updated successfully',
            data: heroData
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: error.errors
            });
        }

        console.error('Error updating hero data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update hero data'
        });
    }
};

module.exports = {
    getHeroSection,
    updateHeroSection
};