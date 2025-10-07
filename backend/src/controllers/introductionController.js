const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create default introduction if none exists
exports.createDefaultIntroduction = async (req, res) => {
  try {
    console.log('Creating default introduction');
    
    // Check if any introduction exists
    const existingIntro = await prisma.introduction.findFirst();
    console.log('Existing intro:', existingIntro);
    
    if (existingIntro) {
      return res.status(400).json({ error: 'Introduction already exists' });
    }
    
    console.log('Creating new introduction...');
    
    // Create default introduction with features
    const newIntro = await prisma.introduction.create({
      data: {
        title: 'MIS ON ENGINAATOR?',
        description: 'Enginaator on üle-eestiline insenerivõistlus, mis kestab 4 päeva ning toimub TalTechis. Võistlus koosneb eel- ja finaalvoorust ning hõlmab nelja eri valdkonda: elektroonika, mehaanika, ehitus ja IT, kus võistlevad 4-liikmelised meeskonnad...',
        features: {
          create: [
            {
              title: 'Innovatsioon',
              description: 'Uudsed lahendused reaalsete probleemide jaoks',
              iconPath: '/light-bulb.png'
            },
            {
              title: 'Võistlus',
              description: 'Auhinnafond üle 3000€ parimatele tiimidele',
              iconPath: '/rocket1.png'
            },
            {
              title: 'Tiimitöö',
              description: 'Neljaliikmelised tiimid erinevate oskustega',
              iconPath: '/sitemap.png'
            },
            {
              title: 'Energia',
              description: '17 tundi intensiivset inseneritööd',
              iconPath: '/plug.png'
            }
          ]
        }
      },
      include: {
        features: true
      }
    });
    
    res.status(201).json(newIntro);
  } catch (error) {
    console.error('Error creating default introduction:', error);
    res.status(500).json({ error: 'Failed to create introduction content' });
  }
};

// Get the current introduction content
exports.getIntroduction = async (req, res) => {
  try {
    // Get the introduction with its features
    const introduction = await prisma.introduction.findFirst({
      include: {
        features: true
      }
    });
    
    // If no introduction exists, return a structured response indicating this
    if (!introduction) {
      return res.status(404).json({ 
        error: 'Introduction content not found',
        message: 'No introduction content has been created yet. Please create default content first.'
      });
    }
    
    res.json(introduction);
  } catch (error) {
    console.error('Error fetching introduction:', error);
    res.status(500).json({ error: 'Failed to fetch introduction content' });
  }
};

// Update the introduction content
exports.updateIntroduction = async (req, res) => {
  try {
    const { id, title, description, features } = req.body;
    
    // Validate that the introduction exists
    const existingIntro = await prisma.introduction.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingIntro) {
      return res.status(404).json({ error: 'Introduction not found' });
    }
    
    // Update the main introduction content
    const updatedIntro = await prisma.introduction.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description
      },
      include: {
        features: true
      }
    });
    
    // Update each feature
    if (features && features.length > 0) {
      for (const feature of features) {
        await prisma.feature.update({
          where: { id: feature.id },
          data: {
            title: feature.title,
            description: feature.description,
            iconPath: feature.iconPath
          }
        });
      }
    }
    
    // Get the updated introduction with features
    const refreshedIntro = await prisma.introduction.findUnique({
      where: { id: parseInt(id) },
      include: {
        features: true
      }
    });
    
    res.json(refreshedIntro);
  } catch (error) {
    console.error('Error updating introduction:', error);
    res.status(500).json({ error: 'Failed to update introduction content' });
  }
};