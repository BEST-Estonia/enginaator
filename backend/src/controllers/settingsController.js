const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const prisma = new PrismaClient();

const RegistrationSettingsSchema = z.object({
  registrationOpen: z.boolean()
});

const getRegistrationSettings = async (req, res) => {
  try {
    let settings = await prisma.siteSetting.findFirst();

    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: { registrationOpen: true }
      });
    }

    res.json({
      success: true,
      data: {
        registrationOpen: settings.registrationOpen
      }
    });
  } catch (error) {
    console.error('Error fetching registration settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch registration settings'
    });
  }
};

const updateRegistrationSettings = async (req, res) => {
  try {
    const validated = RegistrationSettingsSchema.parse(req.body);

    let settings = await prisma.siteSetting.findFirst();
    if (settings) {
      settings = await prisma.siteSetting.update({
        where: { id: settings.id },
        data: validated
      });
    } else {
      settings = await prisma.siteSetting.create({
        data: validated
      });
    }

    res.json({
      success: true,
      data: {
        registrationOpen: settings.registrationOpen
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error updating registration settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update registration settings'
    });
  }
};

module.exports = {
  getRegistrationSettings,
  updateRegistrationSettings
};
