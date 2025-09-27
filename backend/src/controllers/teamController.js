// backend/src/controllers/teamController.js
const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient({ log: ["warn", "error"] });

const allowedFields = new Set(["Elektroonika", "Mehaanika", "Ehitus", "IT"]);

// zod skeem
const MemberSchema = z.object({
  name: z.string().trim().max(100).optional().default(""),
  age: z.string().trim().max(20).optional().default(""),
  email: z.string().email().max(255).optional().or(z.literal("")).transform(v => v || null),
  phone: z.string().trim().max(20).optional().or(z.literal("")).transform(v => v || null),
});

const RegistrationSchema = z.object({
  teamName: z.string().trim().min(1).max(100),
  field: z.string().refine(v => allowedFields.has(v), "Invalid field"),
  leaderName: z.string().trim().min(1).max(100),
  leaderEmail: z.string().email().max(255),
  leaderPhone: z.string().trim().max(20).optional().or(z.literal("")).transform(v => v || null),
  members: z.array(MemberSchema).max(10).default([]),
});

// POST /api/teams/register
exports.registerTeam = async (req, res) => {
  try {
    const parsed = RegistrationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: parsed.error.flatten() });
    }
    const data = parsed.data;

    const membersClean = (data.members || [])
      .filter((m) =>
        (m.name && m.name.trim()) ||
        (m.email && m.email.trim()) ||
        (m.phone && m.phone.trim()) ||
        (m.age && m.age.trim())
      )
      .map((m) => ({
        name: (m.name || "").trim(),
        age: (m.age || "").trim(),
        email: m.email ? m.email.trim() : null,
        phone: m.phone ? m.phone.trim() : null,
      }));

    const created = await prisma.team.create({
      data: {
        name: data.teamName,
        field: data.field,
        leaderName: data.leaderName,
        leaderEmail: data.leaderEmail,
        leaderPhone: data.leaderPhone,
        members: membersClean.length ? { create: membersClean } : undefined,
      },
      select: { id: true, name: true, createdAt: true },
    });

    return res.status(201).json({ ok: true, id: created.id });
  } catch (e) {

    if (e && e.code === "P2002") {
      return res.status(409).json({ error: "Team name already exists" });
    }
    console.error("registerTeam error:", e);
    return res.status(500).json({ error: "Internal error" });
  }
};

// GET /api/teams  (lihtne list vaateks)
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      orderBy: { createdAt: "desc" },
      include: { members: true },
      take: 100,
    });
    res.json({ items: teams });
  } catch (e) {
    console.error("getAllTeams error:", e);
    res.status(500).json({ error: "Internal error" });
  }
};

// GET /api/teams/stats  (naidis statistikast)
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
