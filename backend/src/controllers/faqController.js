const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const prisma = new PrismaClient();

const faqSchema = z.object({
  category: z.string().trim().min(1).max(120).default('Küsimused'),
  question: z.string().trim().min(1).max(500),
  answer: z.string().trim().min(1),
  order: z.number().int().nonnegative().default(0)
});

const faqUpdateSchema = faqSchema.partial();

const defaultFaqItems = [
  {
    category: 'Küsimused',
    question: 'Kellega probleemide korral ühendust võtta?',
    answer: 'Probleemide või küsimuste korral võtta ühendust meie osalejate ja logistikajuhiga meili teel Logistikajuht@enginaator.ee või helistage +372 56827565.',
    order: 0
  },
  {
    category: 'Küsimused',
    question: 'Kas ürituse ajal on võimalik magada?',
    answer: 'Osalejatele on ürituse ajaks valmis seatud vaiksemas kohas eraldi magamisala. Kaugemalt saabuvatele finalistidele on eelvooru ja finaali vahelisel puhkepäeval olemas majutus.',
    order: 1
  },
  {
    category: 'Küsimused',
    question: 'Mida kaasa võtta?',
    answer: 'Võta kaasa iseennast, hea tuju, arvuti ja laadijad. Riietus mugav ja sobilik võistluseks. Kõik vajalik ülesannete lahendamiseks tuleb korraldajate poolt. Osalejatele on ette nähtud üks soe söögikord, snäkid ning ergutavad joogid.',
    order: 2
  },
  {
    category: 'Küsimused',
    question: 'Kas eelteadmised on vajalikud?',
    answer: 'Võidule aitab kaasa eelteadmiste omamine, kuid haridustase ei mängi rolli – Enginaator 2023 panid kinni just gümnasistid! Kui mõni valdkond või teema on võõram, ei tasu ka muretseda, sest lahendamise ajal on võimalik kasutada avatud materjale.',
    order: 3
  }
];

const ensureDefaultFaqItems = async () => {
  const existing = await prisma.faqItem.count();
  if (existing > 0) return;

  await prisma.faqItem.createMany({
    data: defaultFaqItems
  });
};

const getFaqItems = async (req, res) => {
  try {
    await ensureDefaultFaqItems();

    const items = await prisma.faqItem.findMany({
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    res.json(items);
  } catch (error) {
    console.error('Failed to fetch FAQ items:', error);
    res.status(500).json({ error: 'Failed to fetch FAQ items' });
  }
};

const createFaqItem = async (req, res) => {
  try {
    const payload = faqSchema.parse(req.body);
    const created = await prisma.faqItem.create({ data: payload });
    res.status(201).json(created);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Failed to create FAQ item:', error);
    res.status(500).json({ error: 'Failed to create FAQ item' });
  }
};

const updateFaqItem = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = faqUpdateSchema.parse(req.body);
    const updated = await prisma.faqItem.update({
      where: { id },
      data: payload
    });
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Failed to update FAQ item:', error);
    res.status(500).json({ error: 'Failed to update FAQ item' });
  }
};

const deleteFaqItem = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.faqItem.delete({ where: { id } });
    res.json({ message: 'FAQ item deleted' });
  } catch (error) {
    console.error('Failed to delete FAQ item:', error);
    res.status(500).json({ error: 'Failed to delete FAQ item' });
  }
};

module.exports = {
  getFaqItems,
  createFaqItem,
  updateFaqItem,
  deleteFaqItem
};
