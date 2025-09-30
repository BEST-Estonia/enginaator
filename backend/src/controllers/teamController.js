// backend/src/controllers/teamController.js
const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient({ log: ["warn", "error"] });

const allowedFields = new Set(["Elektroonika", "Mehaanika", "Ehitus", "IT"]);

const ShirtSizeEnum = z.enum(["XS", "S", "M", "L", "XL", "XXL"]);

// zod skeem
const MemberSchema = z.object({
  name: z.string().trim().max(100).optional().default(""),
  age: z.string().trim().max(20).optional().default(""),

  email: z.string().email().max(255)
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(v => (v ?? "") === "" ? null : v),

  phone: z.string().trim().max(20)
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(v => (v ?? "") === "" ? null : v),

  school: z.string().trim().max(120)
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(v => (v ?? "") === "" ? null : v),

  diet: z.string().trim().max(255)
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(v => (v ?? "") === "" ? null : v),

  accommodation: z.coerce.boolean().optional().default(false),
  shirtSize: z.enum(["XS","S","M","L","XL","XXL"]).optional().nullable(),
  consent: z.coerce.boolean().optional().default(false),
});

const RegistrationSchema = z.object({
  teamName: z.string().trim().min(1).max(120), // frontendist tuleb 'teamName'
  field: z.string().trim().refine(v => allowedFields.has(v), "Invalid field"),
  leaderName: z.string().trim().min(1).max(120),
  leaderEmail: z.string().email().max(255),
  leaderPhone: z.string().trim().max(20).optional().or(z.literal("")).transform(v => v || null),
  members: z.array(MemberSchema).max(10).default([]),
});

// POST /api/teams/register
exports.registerTeam = async (req, res) => {
  try {
    console.log("typeof req.body.members:", typeof req.body.members, "isArray:", Array.isArray(req.body.members));
    console.log("first member sample:", req.body.members?.[0]);

    const parsed = RegistrationSchema.safeParse(req.body);
    if (!parsed.success) {
      console.error("Zod issues:", parsed.error.issues);   // path-id (nt ["members", 0, "email"])
      console.error("Zod error (flatten):", parsed.error.flatten());
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const data = parsed.data;

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

    const created = await prisma.team.create({
      data: {
        // Prisma mudelis on väli 'name' → mappime front'i 'teamName' sinna
        name: data.teamName,
        field: data.field,
        leaderName: data.leaderName,
        leaderEmail: data.leaderEmail,
        leaderPhone: data.leaderPhone,
        members: membersClean.length ? { create: membersClean } : undefined,
      },
      // vali tagasi 'name', mitte 'teamName'
      select: { id: true, name: true, createdAt: true },
    });

    return res.status(201).json({ ok: true, id: created.id });
  } catch (e) {
    // detailsem logi
    console.error("registerTeam error:", e);
    if (e?.code) console.error("Prisma code:", e.code, "meta:", e.meta);

    if (e?.code === "P2002") {
      return res.status(409).json({ error: "Team name already exists" });
    }
    if (e?.code === "P2025") {
      return res.status(404).json({ error: "Team not found" });
    }
    return res.status(500).json({ error: "Internal error" });
  }
};

// GET /api/teams
exports.getAllTeams = async (req, res) => {
  try {
    const take = Math.min(parseInt(req.query.take || "20", 10), 100);
    const skip = parseInt(req.query.skip || "0", 10);
    const q = (req.query.q || "").trim();

    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },       // ← 'name'
            { leaderName: { contains: q, mode: "insensitive" } },
            { leaderEmail: { contains: q, mode: "insensitive" } },
            { field: { contains: q, mode: "insensitive" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.team.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip,
        include: {
          _count: { select: { members: true } },
          members: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              age: true,
              consent: true,
              accommodation: true,
              shirtSize: true,
              school: true,
              diet: true,
            },
          },
        },
      }),
      prisma.team.count({ where }),
    ]);

    res.json({ items, total });
  } catch (e) {
    console.error("getAllTeams error:", e);
    res.status(500).json({ error: "Internal error" });
  }
};

// GET /api/teams/stats
exports.getTeamStats = async (req, res) => {
  try {
    const total = await prisma.team.count();
    const byField = await prisma.team.groupBy({
      by: ["field"],
      _count: { field: true },
    });
    res.json({ total, byField });
  } catch (e) {
    console.error("getTeamStats error:", e);
    res.status(500).json({ error: "Internal error" });
  }
};

exports.deleteTeam = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.team.delete({ where: { id } });
    return res.status(204).send();
  } catch (e) {
    if (e?.code === "P2025") {
      return res.status(404).json({ error: "Team not found" });
    }
    console.error("deleteTeam error:", e);
    return res.status(500).json({ error: "Internal error" });
  }
};
