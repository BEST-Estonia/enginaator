
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({ log: ["warn", "error"] });

const DEFAULT_CAPACITY = parseInt(process.env.DEFAULT_EDITION_CAPACITY ?? "30", 10);
const ROLLOVER_MONTH   = parseInt(process.env.EDITION_ROLLOVER_MONTH ?? "9", 10);

function pickActiveYear(d = new Date()) {
  const m = d.getMonth() + 1, y = d.getFullYear();
  return m >= ROLLOVER_MONTH ? y + 1 : y;
}

async function ensureEditionForRegistration(inputYear) {
  const year = inputYear ?? pickActiveYear();
  return prisma.edition.upsert({
    where:  { year },
    create: { year, name: `Enginaator ${year}`, capacity: DEFAULT_CAPACITY },
    update: {},
  });
}

module.exports = { prisma, pickActiveYear, ensureEditionForRegistration };
