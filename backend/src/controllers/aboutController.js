const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DEFAULT_ABOUT = {
  kusContent:
    'Enginaator toimub TalTechis. Suurem osa võistlusest viiakse läbi tudengimaja aulas, kuid osalejate teekond viib neid ka muudesse ülikooli osadesse. Samuti on Tallinnast väljaspoolt tulevatel finalistidel võimalus ööbida 18. aprillil Hessnery Residentsis, mis asub Pärnu mnt. 453H. TalTechi campuselt (peatus Tehnikaülikool) liigub täpselt hotelli ette (peatus Pärnu maantee) buss nr.10.',
  osalejadContent:
    'Võistlus toimub neljaliikmelistes tiimides, mis koosnevad 18-24 aastastest gümnasistidest, kutsekooli õpilastest ja tudengitest. Võivad olla segatiimid, aga ka kõik ühest haridusasutusest. Kui tiimiliiget veel ei ole, ei tasu meelt heita, sest korraldustiim aitab Sul leida võistluskaaslased!',
  auhinnadContent:
    'Top 5 tiimile on tagatud koht TalTechis, ning finaali kolmele parimale tiimile on ligi 3000€ auhinnafond. Lisaks saavad osalejad eri auhindu ja meeneid meie ettevõtetelt ning sponsoritelt.'
};

exports.getAboutSection = async (req, res) => {
  try {
    let about = await prisma.aboutSection.findFirst();

    if (!about) {
      about = await prisma.aboutSection.create({ data: DEFAULT_ABOUT });
    }

    res.json(about);
  } catch (error) {
    console.error('Error fetching about section:', error);
    res.status(500).json({ error: 'Failed to fetch about section' });
  }
};

exports.updateAboutSection = async (req, res) => {
  try {
    const { id, kusContent, osalejadContent, auhinnadContent } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing about section id' });
    }

    const updated = await prisma.aboutSection.update({
      where: { id },
      data: { kusContent, osalejadContent, auhinnadContent }
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating about section:', error);
    res.status(500).json({ error: 'Failed to update about section' });
  }
};
