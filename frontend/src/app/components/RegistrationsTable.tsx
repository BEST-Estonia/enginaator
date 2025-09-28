"use client";
import { useEffect, useMemo, useState } from "react";
import { fetchTeams, type TeamRow } from "@/services/teamService";

function fmtDate(iso: string) {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

function rank(t: { name:string; leaderName:string; leaderEmail:string; field:string; createdAt:string }, q: string) {
  const s = q.toLowerCase();
  const name  = (t.name || "").toLowerCase();
  const lead  = (t.leaderName || "").toLowerCase();
  const email = (t.leaderEmail || "").toLowerCase();
  const field = (t.field || "").toLowerCase();

  let score = 0;
  if (name.startsWith(s)) score += 100;
  if (lead.startsWith(s)) score += 80;
  if (name.includes(s))  score += 40;
  if (lead.includes(s))  score += 30;
  if (email.includes(s)) score += 20;
  if (field.includes(s)) score += 10;

  return score * 1_000_000 + new Date(t.createdAt).getTime();
}

export default function RegistrationsTable() {
  const [data, setData] = useState<TeamRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const SEARCH_FETCH_SIZE = 200;

  const take = 10;
  const skip = (page - 1) * take;
  const pages = useMemo(() => Math.max(1, Math.ceil(total / take)), [total]);

async function load(p = page, query = q) {
  setLoading(true);
  try {
    const isSearching = !!query.trim();
    const skip = isSearching ? 0 : (p - 1) * take;
    const pageSize = isSearching ? SEARCH_FETCH_SIZE : take;

    const res = await fetchTeams({ take: pageSize, skip, q: isSearching ? query : undefined });
    let items = res.items;

    if (isSearching) {

      items = [...items].sort((a, b) => rank(b, query) - rank(a, query));
      const start = (p - 1) * take;
      items = items.slice(start, start + take);
      setTotal(res.total ?? res.items.length);
    } else {
      setTotal(res.total ?? res.items.length);
    }

    setData(items);
  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false);
  }
}

    // lae alati kui page muutub
    useEffect(() => { load(page, q); /* eslint-disable-next-line */ }, [page]);

    useEffect(() => {
    const t = setTimeout(() => {
        setPage(1);
        load(1, q);
    }, 300);
    return () => clearTimeout(t);
    }, [q]);

  const toggle = (id: string) => setOpen(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold">Team Registrations</h2>
        <div className="flex items-center gap-2">
        <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { setPage(1); load(1, q); } }}
        placeholder="Search team/leader/email/field…"
        className="border rounded-md px-3 py-2 w-64"
        />

        <button onClick={() => { setPage(1); load(1, q); }} className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200" disabled={loading}>
        {loading ? "Searching…" : "Search"}
        </button>

        <button onClick={() => { setQ(""); setPage(1); load(1, ""); }} className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200" disabled={loading}>
        Refresh
        </button>

        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left text-sm text-gray-600">
              <th className="p-3 border-b w-10"></th>
              <th className="p-3 border-b">Team</th>
              <th className="p-3 border-b">Field</th>
              <th className="p-3 border-b">Leader</th>
              <th className="p-3 border-b">Members</th>
              <th className="p-3 border-b">Created</th>
              <th className="p-3 border-b w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && !loading && (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">No registrations found.</td></tr>
            )}
            {loading && (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">Loading…</td></tr>
            )}

            {!loading && data.map((t) => (
              <>
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 align-top">
                    <button
                      onClick={() => toggle(t.id)}
                      className="text-sm px-2 py-1 border rounded-md hover:bg-gray-50"
                      aria-expanded={!!open[t.id]}
                      aria-controls={`members-${t.id}`}
                      title={open[t.id] ? "Hide members" : "Show members"}
                    >
                      {open[t.id] ? "−" : "LIIKMED ↓"}
                    </button>
                  </td>
                  <td className="p-3 align-top">
                    <div className="font-medium text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">ID: {t.id.slice(0, 8)}…</div>
                  </td>
                  <td className="p-3 align-top">
                    <span className="inline-block text-xs px-2 py-1 rounded bg-red-50 text-red-700 border border-red-100">
                      {t.field}
                    </span>
                  </td>
                  <td className="p-3 align-top">
                    <div className="text-gray-900">{t.leaderName}</div>
                    <div className="text-xs text-gray-500">{t.leaderEmail}</div>
                  </td>
                  <td className="p-3 align-top">
                    {(t._count?.members ?? t.members?.length ?? 0)} member(s)
                  </td>
                  <td className="p-3 align-top text-sm text-gray-700">{fmtDate(t.createdAt)}</td>
                  <td className="p-3 align-top">
                    <button
                        onClick={async () => {
                        if (!confirm(`Delete team "${t.name}"? This cannot be undone.`)) return;
                        try {
                            const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
                            const res = await fetch(`${base}/api/teams/${t.id}`, { method: "DELETE" });
                            if (!res.ok && res.status !== 204) {
                            const msg = await res.text();
                            throw new Error(`Failed (${res.status}): ${msg}`);
                            }
                            // Optimistlik eemaldus UI-st
                            setData(prev => prev.filter(x => x.id !== t.id));
                            setTotal(prev => Math.max(0, prev - 1));
                        } catch (err) {
                            console.error(err);
                            alert("Failed to delete team. See console for details.");
                        }
                        }}
                        className="text-red-600 hover:text-red-700 text-sm px-3 py-1 border border-red-200 rounded-md hover:bg-red-50"
                        title="Delete team"
                    >
                        Delete
                    </button>
                    </td>

                </tr>

                {/* Expanded members row */}
                {open[t.id] && (
                  <tr>
                    <td colSpan={6} className="p-0">
                      <div
                        id={`members-${t.id}`}
                        className="bg-gray-50 border-b px-4 py-3"
                      >
                        {(!t.members || t.members.length === 0) ? (
                          <div className="text-sm text-gray-500">No members listed.</div>
                        ) : (
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {t.members.map(m => (
                              <div key={m.id} className="rounded-md border bg-white p-3">
                                <div className="font-medium text-gray-900">{m.name || "—"}</div>
                                <div className="text-xs text-gray-500">
                                  {m.email || "—"} {m.phone ? ` • ${m.phone}` : ""}
                                </div>
                                <div className="text-xs text-gray-500">Age: {m.age || "—"}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Showing {data.length ? skip + 1 : 0}–{skip + data.length} of {total}
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-md border disabled:opacity-50"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage(p => Math.max(1, p - 1))}>
            Prev
          </button>
          <span className="px-2 py-2 text-sm text-gray-700">
            Page {page} / {pages}
          </span>
          <button className="px-3 py-2 rounded-md border disabled:opacity-50"
                  disabled={page >= pages || loading}
                  onClick={() => setPage(p => Math.min(pages, p + 1))}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
