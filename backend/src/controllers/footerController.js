const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const prisma = new PrismaClient();

const footerSchema = z.object({
  logoUrl: z.string().trim().min(1).max(500),
  tagline: z.string().trim().min(1),
  contactEmail: z.string().trim().min(1).max(255),
  contactPhone: z.string().trim().min(1).max(50),
  contactAddress: z.string().trim().min(1).max(500),
  facebookUrl: z.string().trim().url().max(1000),
  instagramUrl: z.string().trim().url().max(1000),
  linkedinUrl: z.string().trim().url().max(1000),
  partner1Name: z.string().trim().min(1).max(120),
  partner1LogoUrl: z.string().trim().min(1).max(500),
  partner2Name: z.string().trim().min(1).max(120),
  partner2LogoUrl: z.string().trim().min(1).max(500),
  copyrightText: z.string().trim().min(1).max(300)
});

const defaultFooterData = {
  logoUrl: '/enginaator.png',
  tagline: 'Eesti suurim insenerivõistlus tudengitele',
  contactEmail: 'Projektijuht@enginaator.ee',
  contactPhone: '+372 56827565',
  contactAddress: 'Ehitajate tee 5, Tallinn',
  facebookUrl: 'https://www.facebook.com/Enginaator',
  instagramUrl: 'https://www.instagram.com/enginaator.official/',
  linkedinUrl: 'https://www.linkedin.com/company/enginaator/',
  partner1Name: 'Best Estonia',
  partner1LogoUrl: '/best.png',
  partner2Name: 'TalTech',
  partner2LogoUrl: '/taltech.png',
  copyrightText: '© 2026 Enginaator. Kõik õigused kaitstud.'
};

const ensureFooterSection = async () => {
  let footer = await prisma.footerSection.findFirst();
  if (!footer) {
    footer = await prisma.footerSection.create({ data: defaultFooterData });
  }
  return footer;
};

exports.getFooterSection = async (req, res) => {
  try {
    const footer = await ensureFooterSection();
    res.json(footer);
  } catch (error) {
    console.error('Failed to fetch footer section:', error);
    res.status(500).json({ error: 'Failed to fetch footer section' });
  }
};

exports.updateFooterSection = async (req, res) => {
  try {
    const footer = await ensureFooterSection();
    const payload = footerSchema.parse(req.body);

    const updated = await prisma.footerSection.update({
      where: { id: footer.id },
      data: payload
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }

    console.error('Failed to update footer section:', error);
    res.status(500).json({ error: 'Failed to update footer section' });
  }
};
