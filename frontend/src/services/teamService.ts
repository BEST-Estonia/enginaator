const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type TeamRow = {
  id: string;
  name: string;
  field: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone?: string | null;
  createdAt: string;
  _count?: { members: number };
  members?: Array<{ id: string; name: string; email?: string | null; phone?: string | null; age: string; consent: boolean;
  accommodation: boolean;
  shirtSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | null;
  school: string | null;
  diet: string | null;
}>};

export async function fetchTeams(opts?: { take?: number; skip?: number; q?: string }) {
  const params = new URLSearchParams();
  if (opts?.take) params.set("take", String(opts.take));
  if (opts?.skip) params.set("skip", String(opts.skip));
  if (opts?.q) params.set("q", opts.q);
  const url = `${BASE}/api/teams${params.toString() ? `?${params.toString()}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to load teams (${res.status}): ${text.slice(0,120)}…`);
  }
  return res.json() as Promise<{ items: TeamRow[]; total: number }>;
}
