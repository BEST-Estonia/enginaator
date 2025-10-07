// backend/src/controllers/teamController.js
const { z } = require("zod");
const { prisma, ensureEditionForRegistration } = require("../utils/edition");

// lubatud valdkonnad (soovi korral tõsta configsse)
const allowedFields = new Set(["Elektroonika", "Mehaanika", "Ehitus", "IT"]);

const ShirtSizeEnum = z.enum(["XS", "S", "M", "L", "XL", "XXL"]);

// Member Zod skeem
const MemberSchema = z.object({
  name: z.string().trim().max(100).optional().default(""),
  age: z.string().trim().max(20).optional().default(""),

  email: z.string().email().max(255)
    .optional().nullable().or(z.literal(""))
    .transform(v => (v ?? "") === "" ? null : v),

  phone: z.string().trim().max(20)
    .optional().nullable().or(z.literal(""))
    .transform(v => (v ?? "") === "" ? null : v),

  school: z.string().trim().max(120)
    .optional().nullable().or(z.literal(""))
    .transform(v => (v ?? "") === "" ? null : v),

  diet: z.string().trim().max(255)
    .optional().nullable().or(z.literal(""))
    .transform(v => (v ?? "") === "" ? null : v),

  accommodation: z.coerce.boolean().optional().default(false),
  shirtSize: ShirtSizeEnum.optional().nullable(),
  consent: z.coerce.boolean().optional().default(false),
});

// NB! lisasin valikuliselt ka "year" (kui tahad konkreetsesse aastasse panna)
const RegistrationSchema = z.object({
  year: z.coerce.number().int().min(2000).max(3000).optional(),  // NEW (optional)
  teamName: z.string().trim().min(1).max(120),
  field: z.string().trim().refine(v => allowedFields.has(v), "Invalid field"),
  leaderName: z.string().trim().min(1).max(120),
  leaderEmail: z.string().email().max(255),
  leaderPhone: z.string().trim().max(20).optional().or(z.literal("")).transform(v => v || null),
  members: z.array(MemberSchema).max(10).default([]),
});

// POST /api/teams/register
exports.registerTeam = async (req, res) => {
  try {
    const parsed = RegistrationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }
    const data = parsed.data;

    // puhasta liikmed (nagu sul oli)
    const membersClean = (data.members || [])
      .filter(m =>
        (m.name && m.name.trim()) ||
        (m.email && String(m.email).trim()) ||
        (m.phone && String(m.phone).trim()) ||
        (m.age && m.age.trim()) ||
        (m.school && m.school.trim()) ||
        (m.diet && m.diet.trim()) ||
        m.shirtSize != null ||
        m.accommodation === true
      )
      .map(m => ({
        name: (m.name || "").trim(),
        age: (m.age || "").trim(),
        email: m.email ? String(m.email).trim() : null,
        phone: m.phone ? String(m.phone).trim() : null,
        consent: !!m.consent,
        accommodation: !!m.accommodation,
        shirtSize: m.shirtSize ?? null,
        school: m.school,
        diet: m.diet,
      }));

    // ⬇️ CRITICAL: queueNo lukustamine transaktsiooniga + Edition sidumine
    const result = await prisma.$transaction(async (tx) => {
      // leia/loo oluline Edition (kas body.year või aktiivne)
      const ed0 = await ensureEditionForRegistration(data.year);

      // atomaarne increment → saame järgmise järjekorranumbri
      const ed = await tx.edition.update({
        where: { id: ed0.id },
        data:  { nextQueue: { increment: 1 } },
        select:{ id: true, capacity: true, nextQueue: true, year: true },
      });

      // loo tiim fikseeritud queueNo-ga
      const created = await tx.team.create({
        data: {
          name: data.teamName,         // FRONT teamName → DB name
          field: data.field,
          leaderName: data.leaderName,
          leaderEmail: data.leaderEmail,
          leaderPhone: data.leaderPhone,
          editionId: ed.id,
          queueNo: ed.nextQueue,
          members: membersClean.length ? { create: membersClean } : undefined,
        },
        include: {
          edition: { select: { year: true, capacity: true } },
          _count:  { select: { members: true } },
          members: true,
        },
      });

      const isWaitlisted = created.queueNo > ed.capacity;
      return { team: created, isWaitlisted, capacity: ed.capacity };
    });

    return res.status(201).json(result);
  } catch (e) {
    console.error("registerTeam error:", e, e?.code, e?.meta);
    if (e?.code === "P2002") return res.status(409).json({ error: "Team name already exists (this year)" });
    if (e?.code === "P2025") return res.status(404).json({ error: "Team not found" });
    return res.status(500).json({ error: "Internal error" });
  }
};

// GET /api/teams?take=10&skip=0&q=...&year=2026
exports.getAllTeams = async (req, res) => {
  try {
    const take = Math.min(parseInt(req.query.take || "20", 10), 100);
    const skip = parseInt(req.query.skip || "0", 10);
    const q    = (req.query.q || "").trim();
    const year = req.query.year ? parseInt(req.query.year, 10) : undefined;

    const where = {};
    if (q) {
      where.OR = [
        { name:       { contains: q, mode: "insensitive" } },
        { leaderName: { contains: q, mode: "insensitive" } },
        { leaderEmail:{ contains: q, mode: "insensitive" } },
        { field:      { contains: q, mode: "insensitive" } },
      ];
    }
    if (year) {
      const ed = await prisma.edition.findUnique({ where: { year } });
      where.editionId = ed?.id ?? "__none__"; // kui sellist aastat pole, ei tule ridu
    }

    const [items, total] = await Promise.all([
      prisma.team.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip,
        include: {
          edition: { select: { capacity: true, year: true } },
          _count:  { select: { members: true } },
          members: {
            select: {
              id: true, name: true, email: true, phone: true, age: true,
              consent: true, accommodation: true, shirtSize: true, school: true, diet: true,
            },
          },
        },
      }),
      prisma.team.count({ where }),
    ]);

    const mapped = items.map(t => ({
      ...t,
      isWaitlisted: t.queueNo > (t.edition?.capacity ?? Number.MAX_SAFE_INTEGER),
    }));

    res.json({ items: mapped, total });
  } catch (e) {
    console.error("getAllTeams error:", e);
    res.status(500).json({ error: "Internal error" });
  }
};

// GET /api/teams/stats (jätan sinu loogika)
exports.getTeamStats = async (_req, res) => {
  try {
    const total = await prisma.team.count();
    const byField = await prisma.team.groupBy({ by: ["field"], _count: { field: true } });
    res.json({ total, byField });
  } catch (e) {
    console.error("getTeamStats error:", e);
    res.status(500).json({ error: "Internal error" });
  }
};

// DELETE /api/teams/:id
exports.deleteTeam = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.team.delete({ where: { id } });
    return res.status(204).send();
  } catch (e) {
    if (e?.code === "P2025") return res.status(404).json({ error: "Team not found" });
    console.error("deleteTeam error:", e);
    return res.status(500).json({ error: "Internal error" });
  }
};
