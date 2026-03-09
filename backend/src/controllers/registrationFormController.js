const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const prisma = new PrismaClient();

const QUESTION_TYPES = ['text', 'textarea', 'email', 'number', 'select', 'checkbox'];

const registrationQuestionSchema = z.object({
  label: z.string().trim().min(1).max(200),
  fieldKey: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, 'fieldKey must be alphanumeric/underscore and start with a letter'),
  type: z.enum(QUESTION_TYPES),
  required: z.boolean().default(false),
  placeholder: z.string().trim().max(200).optional().nullable(),
  options: z.array(z.string().trim().min(1).max(100)).optional().nullable(),
  order: z.number().int().min(0).default(0),
  active: z.boolean().default(true)
});

const registrationQuestionUpdateSchema = registrationQuestionSchema.partial();

const getRegistrationFormConfig = async (req, res) => {
  try {
    const [fields, questions] = await Promise.all([
      prisma.field.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.registrationQuestion.findMany({
        where: { active: true },
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }]
      })
    ]);

    res.json({
      success: true,
      data: {
        fields: fields.map((f) => f.name),
        questions
      }
    });
  } catch (error) {
    console.error('Failed to fetch registration form config:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch registration form config' });
  }
};

const getRegistrationQuestions = async (req, res) => {
  try {
    const questions = await prisma.registrationQuestion.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }]
    });

    res.json({ success: true, data: questions });
  } catch (error) {
    console.error('Failed to fetch registration questions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch registration questions' });
  }
};

const createRegistrationQuestion = async (req, res) => {
  try {
    const payload = registrationQuestionSchema.parse(req.body);

    const created = await prisma.registrationQuestion.create({
      data: {
        ...payload,
        options: payload.type === 'select' ? payload.options ?? [] : null,
        placeholder: payload.placeholder ?? null
      }
    });

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
    }

    console.error('Failed to create registration question:', error);
    res.status(500).json({ success: false, error: 'Failed to create registration question' });
  }
};

const updateRegistrationQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = registrationQuestionUpdateSchema.parse(req.body);

    const updated = await prisma.registrationQuestion.update({
      where: { id },
      data: {
        ...payload,
        options: payload.type === 'select'
          ? payload.options ?? []
          : payload.type
            ? null
            : payload.options,
        placeholder: payload.placeholder === undefined ? undefined : payload.placeholder ?? null
      }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
    }

    console.error('Failed to update registration question:', error);
    res.status(500).json({ success: false, error: 'Failed to update registration question' });
  }
};

const deleteRegistrationQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.registrationQuestion.delete({ where: { id } });
    res.json({ success: true, message: 'Registration question deleted' });
  } catch (error) {
    console.error('Failed to delete registration question:', error);
    res.status(500).json({ success: false, error: 'Failed to delete registration question' });
  }
};

module.exports = {
  getRegistrationFormConfig,
  getRegistrationQuestions,
  createRegistrationQuestion,
  updateRegistrationQuestion,
  deleteRegistrationQuestion
};
