import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  RefreshCw,
  Sparkles,
  CalendarDays,
  MapPin,
  Clock3,
  FileCheck2,
  Tag,
  MessageSquare,
  Search,
} from "lucide-react";
import { getMaintenanceHistory } from "../../service/maintenanceService";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMaintenanceHistory();
      setItems(data || []);
    } catch {
      setError("Unable to load maintenance history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredItems = items.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hostelName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.roomNumber?.toString().includes(searchQuery) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Hero Welcome Banner ── */}
      <div className="w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 text-white shadow-2xl shadow-indigo-950/20 sm:p-8 lg:p-10">
          <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              {/* <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1 text-xs font-semibold tracking-wide text-blue-200 backdrop-blur-md">
                <Sparkles size={13} className="text-blue-300" />
                Maintenance Audit Log
              </span> */}

              <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                Completion History
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
                Review verified hostel repair records, completed work orders, and recorded maintenance resolution notes.
              </p>
            </div>

          </div>

          {/* Ambient Glow Overlay */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-20 h-56 w-56 rounded-full bg-indigo-500/25 blur-3xl" />
        </div>
      </div>

      {/* ── Sub-header Meta Bar ── */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-slate-800">Historical Records</h2>
          <p className="text-xs text-slate-400">Archived hostel repair logs</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
          <CalendarDays size={14} className="text-indigo-600" />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>

      {/* ── Error Notification ── */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-xs font-bold text-rose-700 shadow-sm">
          {error}
        </div>
      )}

      {/* ── Metric Summary Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
              <CheckCircle2 size={22} strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{items.length}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Completed Repairs</p>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Fully resolved work orders
          </p>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-110">
              <FileCheck2 size={22} strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{filteredItems.length}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Filtered Records</p>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Matching search criteria
          </p>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </div>

      {/* ── Search Bar Filter ── */}
      <div className="relative flex items-center rounded-2xl border border-slate-200/70 bg-white p-2 shadow-sm">
        <Search size={16} className="ml-3 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, hostel, room number, or category..."
          className="w-full bg-transparent px-3 py-1.5 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="mr-2 rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 hover:bg-slate-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── History Items Stream ── */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/70 bg-white py-12">
            <RefreshCw size={24} className="animate-spin text-indigo-600" />
            <p className="mt-3 text-xs font-semibold text-slate-400">Loading repair history...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 size={12} />
                      Completed
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-500">
                      #{item.id}
                    </span>
                    {item.category && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/60 bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                        <Tag size={10} />
                        {item.category}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                    {item.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-medium text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-400" />
                      {item.hostelName || "Hostel not assigned"} · Room {item.roomNumber || "—"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 sm:self-start">
                  <Clock3 size={13} className="text-slate-400" />
                  <span>
                    {item.completedAt
                      ? new Date(item.completedAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </span>
                </div>
              </div>

              {/* Maintenance Resolution Notes */}
              <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  <MessageSquare size={12} className="text-emerald-600" />
                  Maintenance Resolution Note:
                </p>
                <p className="mt-1 text-xs leading-relaxed text-emerald-900/90 font-medium">
                  {item.maintenanceRemarks || "No repair note recorded."}
                </p>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200/70 bg-white p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FileCheck2 size={24} />
            </div>
            <p className="text-sm font-bold text-slate-700">No completed repair records</p>
            <p className="mt-1 text-xs text-slate-400">
              {searchQuery ? "No history entries match your search criteria." : "Completed work orders will appear here once finalized."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}