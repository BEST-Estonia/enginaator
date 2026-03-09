const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const prisma = new PrismaClient();

const aboutSchema = z.object({
  kusContent: z.string().trim().min(1),
  osalejadContent: z.string().trim().min(1),
  auhinnadContent: z.string().trim().min(1)
});

const defaultAboutData = {
  kusContent:
    'Enginaator toimub TalTechis. Suurem osa võistlusest viiakse läbi tudengimaja aulas, kuid osalejate teekond viib neid ka muudesse ülikooli osadesse. Samuti on Tallinnast väljastpoolt tulevatel finalistidel võimalus ööbida 18. aprillil Hessnery Residentsis, mis asub Pärnu mnt. 453H. TalTechi campuselt (peatus Tehnikaülikool) liigub täpselt hotelli ette (peatus Pärnu maantee) buss nr.10.',
  osalejadContent:
    'Võistlus toimub neljaliikmelistes tiimides, mis koosnevad 18-24 aastastest gümnasistidest, kutsekooli õpilastest ja tudengitest. Võivad olla segatiimid, aga ka kõik ühest haridusasutusest. Kui tiimiliiget veel ei ole, ei tasu meelt heita, sest korraldustiim aitab Sul leida võistluskaaslased!',
  auhinnadContent:
    'Top 5 tiimile on tagatud koht TalTechis, ning finaali kolmele parimale tiimile on ligi 3000€ auhinnafond. Lisaks saavad osalejad eri auhindu ja meeneid meie ettevõtetelt ning sponsoritelt.'
};

const ensureAboutSection = async () => {
  let section = await prisma.aboutSection.findFirst();
  if (!section) {
    section = await prisma.aboutSection.create({ data: defaultAboutData });
  }
  return section;
};

exports.getAboutSection = async (req, res) => {
  try {
    const section = await ensureAboutSection();
    res.json(section);
  } catch (error) {
    console.error('Failed to fetch about section:', error);
    res.status(500).json({ error: 'Failed to fetch about section' });
  }
};

exports.updateAboutSection = async (req, res) => {
  try {
    const section = await ensureAboutSection();
    const payload = aboutSchema.parse(req.body);

    const updated = await prisma.aboutSection.update({
      where: { id: section.id },
      data: payload
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }

    console.error('Failed to update about section:', error);
    res.status(500).json({ error: 'Failed to update about section' });
  }
};
