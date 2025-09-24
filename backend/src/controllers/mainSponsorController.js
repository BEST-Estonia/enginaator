const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
        const { sponsorName, sponsorText, imageUrl, website } = req.body;
        const sponsor = await prisma.mainSponsor.create({
            data: {sponsorName, sponsorText, imageUrl, website}
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
  try {
    const { id } = req.params;
    await prisma.mainSponsor.delete({ where: { id } });
    res.json({ message: 'Main sponsor deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete main sponsor' });
  }
};