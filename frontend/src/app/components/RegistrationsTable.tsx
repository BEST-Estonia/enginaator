"use client";
import * as XLSX from "xlsx";
import { Fragment, useEffect, useMemo, useState } from "react";
import { fetchTeams, type TeamRow } from "@/services/teamService";

const FIELDS = ["IT", "Elektroonika", "Mehaanika", "Ehitus"] as const;

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
  const [statusFilter, setStatusFilter] = useState<"all"|"confirmed"|"waitlist">("all");
  const [fieldFilter, setFieldFilter]   = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");

  const take = 2000;
  const skip = (page - 1) * take;
  const pages = useMemo(() => Math.max(1, Math.ceil(total / take)), [total]);

  const availableYears = useMemo(() => {
  const years = new Set<string>();
  data.forEach(t => {
      if (t.createdAt) {
        years.add(t.createdAt.slice(0, 4));
      }
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [data]);

  function normalize(v?: string | null) {
    return (v ?? "").trim().toLowerCase();
  }

  function ensureWaitlisted(t: TeamRow) {
    if (typeof t.isWaitlisted === "boolean") return t.isWaitlisted;
    const cap = t.edition?.capacity ?? Number.MAX_SAFE_INTEGER;
    return (t.queueNo ?? Number.MAX_SAFE_INTEGER) > cap;
  }


  function applyFilters(items: TeamRow[]) {
    let out = items;

    if (statusFilter !== "all") {
      out = out.filter(t => {
        const w = ensureWaitlisted(t);
        return statusFilter === "waitlist" ? w : !w;
      });
    }

    if (fieldFilter !== "all") {
      const want = normalize(fieldFilter);
      out = out.filter(t => normalize(t.field) === want);
    }

    if (yearFilter !== "all") {
      out = out.filter(t => t.createdAt?.startsWith(yearFilter));
    }

    return out;
  }

function isFilterActive() {
  return statusFilter !== "all" || fieldFilter !== "all";
}

async function fetchAllTeamsFull(query: string) {
  const TAKE = 500;
  let skip = 0;
  let all: TeamRow[] = [];

  const first = await fetchTeams({ take: TAKE, skip, q: query?.trim() || undefined });
  all = first.items ?? [];
  const total = first.total ?? all.length;

  while (all.length < total) {
    skip += TAKE;
    const page = await fetchTeams({ take: TAKE, skip, q: query?.trim() || undefined });
    all = all.concat(page.items ?? []);
    if (!page.items?.length) break;
  }
  return all;
}

async function handleExportExcel() {
  try {
    setLoading(true);

    const all = await fetchAllTeamsFull(q);

    const filtered = applyFilters ? applyFilters(all) : all;

    const teamRows = filtered.map((t) => {
      const isW = ensureWaitlisted(t);
      const members = t.members ?? [];
      const accCount = members.filter(m => m.accommodation).length;
      const consentCount = members.filter(m => m.consent).length;

      return {
        Team: t.name,
        Field: t.field,
        "Leader Name": t.leaderName,
        "Leader Email": t.leaderEmail,
        "Queue #": t.queueNo ?? "",
        Status: isW ? "WAITLIST" : "CONFIRMED",
        "Edition Year": t.edition?.year ?? "",
        "Edition Capacity": t.edition?.capacity ?? "",
        "Members Count": t._count?.members ?? t.members?.length ?? 0,
        "Accommodation (count)": accCount,
        "Consent Given (count)": consentCount,
        Created: t.createdAt,
        ID: t.id,
      };
    });

    const memberRows = filtered.flatMap((t) => {
      const isW = ensureWaitlisted(t);
      return (t.members ?? []).map((m) => ({
        "Team": t.name,
        "Team Queue #": t.queueNo ?? "",
        "Team Status": isW ? "WAITLIST" : "CONFIRMED",
        "Team Field": t.field,
        "Member Name": m.name ?? "",
        "Member Email": m.email ?? "",
        "Member Phone": m.phone ?? "",
        Age: m.age ?? "",
        School: m.school ?? "",
        "Shirt Size": m.shirtSize ?? "",
        Diet: m.diet ?? "",
        Accommodation: m.accommodation ? "Yes" : "No",
        Consent: m.consent ? "Yes" : "No",
        "Team Created": t.createdAt,
        "Team ID": t.id,
        "Member ID": m.id,
      }));
    });


    const wb = XLSX.utils.book_new();
    const wsTeams = XLSX.utils.json_to_sheet(teamRows);
    const wsMembers = XLSX.utils.json_to_sheet(memberRows);
    XLSX.utils.book_append_sheet(wb, wsTeams, "Teams");
    XLSX.utils.book_append_sheet(wb, wsMembers, "Members");

    const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");
    XLSX.writeFile(wb, `enginaator-registrations-${stamp}.xlsx`);

  } catch (err) {
    console.error("Export failed:", err);
    alert("Export failed — see console for details.");
  } finally {
    setLoading(false);
  }
}



async function load(p = page, query = q) {
  setLoading(true);
  try {
    const isSearching = !!query.trim();
    const skip = isSearching ? 0 : (p - 1) * take;
    const pageSize = isSearching ? SEARCH_FETCH_SIZE : take;

    const res = await fetchTeams({ take: pageSize, skip, q: isSearching ? query : undefined });
    let items = res.items;

    items = applyFilters(items);

    if (isSearching) {
      items = [...items].sort((a, b) => rank(b, query) - rank(a, query));
    }

    const start = (p - 1) * take;
    const paged = items.slice(start, start + take);
    setTotal(items.length);
    setData(paged);
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
      }, 0);
      return () => clearTimeout(t);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, fieldFilter, yearFilter]);

  const toggle = (id: string) => setOpen(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold">Team Registrations</h2>

        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          {/* Status filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <div className="flex rounded-md border overflow-hidden">
              <button
                onClick={() => { setStatusFilter("all"); setPage(1); load(1, q); }}
                className={`px-3 py-1.5 text-sm ${statusFilter==="all" ? "bg-gray-800 text-white" : "bg-white hover:bg-gray-50"}`}
              >
                All
              </button>
              <button
                onClick={() => { setStatusFilter("confirmed"); setPage(1); load(1, q); }}
                className={`px-3 py-1.5 text-sm border-l ${statusFilter==="confirmed" ? "bg-emerald-600 text-white" : "bg-white hover:bg-gray-50"}`}
              >
                Confirmed
              </button>
              <button
                onClick={() => { setStatusFilter("waitlist"); setPage(1); load(1, q); }}
                className={`px-3 py-1.5 text-sm border-l ${statusFilter==="waitlist" ? "bg-amber-600 text-white" : "bg-white hover:bg-gray-50"}`}
              >
                Waitlist
              </button>
            </div>
          </div>

          {/* Field filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Field:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setFieldFilter("all"); setPage(1); load(1, q); }}
                className={`px-3 py-1.5 text-sm rounded-md border ${fieldFilter==="all" ? "bg-gray-800 text-white" : "bg-white hover:bg-gray-50"}`}
              >
                All
              </button>
              {FIELDS.map(f => (
                <button
                  key={f}
                  onClick={() => { setFieldFilter(f); setPage(1); load(1, q); }}
                  className={`px-3 py-1.5 text-sm rounded-md border ${fieldFilter===f ? "bg-gray-900 text-white" : "bg-white hover:bg-gray-50"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Year:</span>
            <select
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="all">All</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Search controls (sinu olemasolev) */}
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
            <button onClick={() => { setQ(""); setStatusFilter("all"); setFieldFilter("all"); setPage(1); load(1, ""); }} className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200" disabled={loading}>
              Reset
            </button>
          </div>
            <button
            onClick={handleExportExcel}
            disabled={loading}
            className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            title="Export current (filtered) view to Excel"
          >
            Export .xlsx
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
              <Fragment key={t.id}>
                <tr className="border-b hover:bg-gray-50">
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

                  {/* Team column with badge */}
                  <td className="p-3 align-top">
                    <div className="font-medium text-gray-900">{t.name}</div>
                    <div className="mt-1">
                      {t.isWaitlisted ? (
                        <span className="inline-block text-[11px] px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          WAITLIST · #{t.queueNo}
                        </span>
                      ) : (
                        <span className="inline-block text-[11px] px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          CONFIRMED · #{t.queueNo}
                        </span>
                      )}
                    </div>
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

                  <td className="p-3 align-top text-xs text-gray-700 space-y-1">
                    <div>
                      {(t._count?.members ?? t.members?.length ?? 0)} member(s)
                    </div>
                    {t.members && t.members.length > 0 && (
                      <div className="text-[11px] text-gray-500">
                        {(() => {
                          const acc = t.members.filter(m => m.accommodation).length;
                          const consent = t.members.filter(m => m.consent).length;
                          return `Accommodation: ${acc} • Consent: ${consent}`;
                        })()}
                      </div>
                    )}
                  </td>

                  <td className="p-3 align-top text-sm text-gray-700">
                    {fmtDate(t.createdAt)}
                  </td>

                  <td className="p-3 align-top">
                    <button
                      onClick={async () => {
                        if (!confirm(`Delete team "${t.name}"? This cannot be undone.`)) return;
                        try {
                          const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
                          const res = await fetch(`${base}/teams/${t.id}`, { method: "DELETE" });
                          if (!res.ok && res.status !== 204) {
                            const msg = await res.text();
                            throw new Error(`Failed (${res.status}): ${msg}`);
                          }
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
                    <td colSpan={7} className="p-0">
                      <div
                        id={`members-${t.id}`}
                        className="bg-gray-50 border-b px-4 py-3"
                      >
                        {(!t.members || t.members.length === 0) ? (
                          <div className="text-sm text-gray-500">No members listed.</div>
                        ) : (
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {t.members.map(m => (
                              <div key={m.id} className="rounded-md border bg-white p-3 space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="font-medium text-gray-900 truncate">{m.name || "—"}</div>
                                  <span className="shrink-0 inline-flex items-center rounded px-2 py-0.5 text-[10px] border bg-gray-50 text-gray-700 border-gray-200">
                                    T-shirt: {m.shirtSize || "—"}
                                  </span>
                                </div>

                                <div className="text-xs text-gray-500">
                                  {(m.email || "—")}{m.phone ? ` • ${m.phone}` : ""}
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="text-gray-600">Age: <span className="text-gray-800">{m.age || "—"}</span></div>
                                  <div className="text-gray-600">School: <span className="text-gray-800">{m.school || "—"}</span></div>
                                </div>

                                {m.diet ? (
                                  <div className="text-xs text-gray-600">
                                    Diet: <span className="text-gray-800">{m.diet}</span>
                                  </div>
                                ) : null}

                                <div className="flex flex-wrap gap-2 pt-1">
                                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border
                                    ${m.accommodation
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                    {m.accommodation ? "Accommodation: yes" : "Accommodation: no"}
                                  </span>

                                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border
                                    ${m.consent
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-red-50 text-red-700 border-red-200"}`}>
                                    {m.consent ? "Consent: given" : "Consent: missing"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
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
