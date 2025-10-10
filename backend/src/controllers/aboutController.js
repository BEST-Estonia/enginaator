const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createDefaultAbout = async (req, res) => {
    try {
        // Check if any about section exists
        const existingAbout = await prisma.aboutSection.findFirst();

        if (existingAbout) {
            return res.status(400).json({ error: 'About section already exists' });
        }

        //Create the default about section
        const newAbout = await prisma.aboutSection.create({
            data: {
                kusContent: "Enginaator toimub TalTechis. Suurem osa võistlusest viiakse läbi tudengimaja aulas, kuid osalejate teekond viib neid ka muudesse ülikooli osadesse. Samuti on Tallinnast väljastpoolt tulevatel finalistidel võimalus ööbida 18. aprillil Hessnery Residentsis, mis asub Pärnu mnt. 453H. TalTechi campuselt (peatus Tehnikaülikool) liigub täpselt hotelli ette (peatus Pärnu maantee) buss nr.10.",
                
                osalejadContent: "Võistlus toimub neljaliikmelistes tiimides, mis koosnevad 17-24 aastastest gümnasistidest, kutsekooli õpilastest ja tudengitest. Võivad olla segatiimid, aga ka kõik ühest haridusasutusest. Kui tiimiliiget veel ei ole, ei tasu meelt heita, sest korraldustiim aitab Sul leida võistluskaaslased!",

                auhinnadContent: "Top 5 tiimile on tagatud koht TalTechis, ning finaali kolmele parimale tiimile on ligi 3000€ auhinnafond. Lisaks saavad osalejad eri auhindu ja meeneid meie ettevõtetelt ning sponsoritelt."
            }
        });
        res.status(201).json(newAbout);
    } catch (error) {
        console.error('Error creating default about section:', error);
        res.status(500).json({ error: 'Failed to create about section content' });
    }
}

exports.getAbout = async (req, res) => {
    try {
        //get the about section
        const about = await prisma.aboutSection.findFirst({
        })

        //If no about section text has been created, return a structured response
        if (!about) {
            return res.status(404).json({
                error: "About content not found",
                message: "No about content has been created yet. Please create default content first."
            });
        }

        res.json(about);
        } catch (error) {
        console.error('GET /api/aboutSection error:', error?.message, error?.stack);
        return res.status(500).json({ error: 'Failed to fetch about content' });
        }

}

exports.updateAbout = async (req, res) => {
    try {
        const {kusContent, osalejadContent, auhinnadContent} = req.body;

        const existingAbout = await prisma.aboutSection.findFirst();

        if (!existingAbout) {
            return res.status(404).json({error: 'About content not found'})

        }   

        //Update the about section
        const updateAbout = await prisma.aboutSection.update({
            where: { id: existingAbout.id },
            data: {
              kusContent,
              osalejadContent,
              auhinnadContent      
            }
        });

        res.json(updateAbout);

    } catch (error) {
        console.error('Error updating about content:', error);
        res.status(500).json({ error: 'Failed to update about content' });
    }
}