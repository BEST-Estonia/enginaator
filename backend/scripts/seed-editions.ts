import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const DEFAULT_CAPACITY = parseInt(process.env.DEFAULT_EDITION_CAPACITY ?? "30", 10);
const ROLLOVER_MONTH   = parseInt(process.env.EDITION_ROLLOVER_MONTH ?? "9", 10); // 1..12

function pickActiveYear(d = new Date()) {
  const m = d.getMonth() + 1;
  const y = d.getFullYear();
  return m >= ROLLOVER_MONTH ? y + 1 : y;
}

async function ensureEdition(year: number, capacity = DEFAULT_CAPACITY) {
  await prisma.edition.upsert({
    where: { year },
    create: { year, name: `Enginaator ${year}`, capacity },
    update: {},
  });
}

async function main() {
  const activeYear = pickActiveYear();
  const nextYear   = activeYear + 1;

  await ensureEdition(activeYear);
  await ensureEdition(nextYear);

  console.log(`Ensured editions for ${activeYear} and ${nextYear}`);
}

main().finally(() => prisma.$disconnect());
