const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require('../utils/cloudinary');

function getCloudinaryPublicId(url) {
  const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
  return match ? match[1] : null;
}

//Get all main sponsors
exports.getMainSponsors = async (req, res) => {
    try {
        const sponsors = await prisma.mainSponsor.findMany();
        res.json(sponsors);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch main sponsors'});
    }
};

//Create a new main sponsor
exports.createMainSponsor = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Sponsor image is required' });
        }
        const imageUrl = req.file.path; // Cloudinary URL
        const { sponsorName, sponsorText, website } = req.body;
        if (!sponsorName) {
            return res.status(400).json({ error: 'Sponsor name is required' });
        }
        const sponsor = await prisma.mainSponsor.create({
            data: {
                sponsorName,
                sponsorText,
                imageUrl,
                website: website || null
            },
        });
        res.status(201).json(sponsor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create main sponsor' });
    }
};

//Update a main sponsor
exports.updateMainSponsor = async (req, res) => {
    try {
        const { id } = req.params;
        const { sponsorName, sponsorText, imageUrl, website } = req.body;
        const sponsor = await prisma.mainSponsor.update({
            where: { id },
            data: { sponsorName, sponsorText, imageUrl, website }
        });
        res.json(sponsor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update main sponsor' });
    }
};

// Delete a main sponsor
exports.deleteMainSponsor = async (req, res) => {
  const { id } = req.params;
  try {
    const sponsor = await prisma.mainSponsor.findUnique({ where: { id } });
    if (!sponsor) {
      return res.status(404).json({ error: 'Main sponsor not found' });
    }

    if (sponsor.imageUrl && sponsor.imageUrl.includes('cloudinary.com')) {
      const publicId = getCloudinaryPublicId(sponsor.imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await prisma.mainSponsor.delete({ where: { id } });
    res.json({ message: 'Main sponsor deleted successfully' });
  } catch (error) {
    console.error('Error deleting main sponsor:', error);
    res.status(500).json({ error: 'Failed to delete main sponsor' });
  }
};