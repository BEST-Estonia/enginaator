const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type TeamRow = {
  id: string;
  name: string;
  field: string;
  leaderName: string;
  leaderEmail: string;
  createdAt: string;

  queueNo: number;
  isWaitlisted: boolean;
  edition?: { year: number; capacity: number };

  _count?: { members: number };
  members?: Array<{
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    age: string | null;
    consent: boolean;
    accommodation: boolean;
    shirtSize?: string | null;
    school?: string | null;
    diet?: string | null;
  }>;
};

export async function fetchTeams(opts: {
  take?: number;
  skip?: number;
  q?: string;
  year?: number;
} = {}) {
  const { take = 10, skip = 0, q, year } = opts;

  const params = new URLSearchParams();
  params.set("take", String(take));
  params.set("skip", String(skip));
  if (q && q.trim()) params.set("q", q.trim());
  if (typeof year === "number") params.set("year", String(year));

  const url = `${BASE}/teams${params.toString() ? `?${params.toString()}` : ""}`;
  if (process.env.NODE_ENV !== "production") console.log("[fetchTeams]", url);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fetchTeams ${res.status} @ ${url} : ${text.slice(0,160)}…`);
  }
  return res.json() as Promise<{ items: TeamRow[]; total: number }>;
}