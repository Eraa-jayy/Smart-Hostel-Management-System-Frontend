import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  MapPin,
  RefreshCw,
  Wrench,
  ImageIcon,
  ZoomIn,
  X,
  Camera,
  CalendarDays,
  Tag,
  ChevronLeft,
  MessageSquare,
  PlayCircle,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import {
  completeMaintenanceComplaint,
  getMaintenanceQueue,
  startMaintenanceComplaint,
} from "../../service/maintenanceService";

export default function Complaints() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const [lightboxUrl, setLightboxUrl] = useState(null);

  // Detail modal state
  const [detailItem, setDetailItem] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await getMaintenanceQueue());
    } catch {
      setError(
        "Unable to load work orders. Check that the backend is running and you are signed in as maintenance staff."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startWork = async (item, e) => {
    if (e) e.stopPropagation();
    try {
      await startMaintenanceComplaint(item.id);
      if (detailItem && detailItem.id === item.id) {
        setDetailItem({ ...detailItem, status: "IN_PROGRESS" });
      }
      await load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not start this work order.");
    }
  };

  const complete = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      await completeMaintenanceComplaint(selected.id, note.trim());
      setSelected(null);
      setNote("");
      setDetailItem(null);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not complete this work order.");
    } finally {
      setSaving(false);
    }
  };

  const inProgressCount = items.filter((x) => x.status === "IN_PROGRESS").length;
  const forwardedCount = items.filter((x) => x.status !== "IN_PROGRESS").length;

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Hero Welcome Banner ── */}
      <div className="w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 text-white shadow-2xl shadow-indigo-950/20 sm:p-8 lg:p-10">
          <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              {/* <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1 text-xs font-semibold tracking-wide text-blue-200 backdrop-blur-md">
                <Sparkles size={13} className="text-blue-300" />
                Maintenance Management Portal
              </span> */}

              <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                Forwarded Work Orders
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
                Manage hostel repair complaints, update active work order statuses, inspect incident photos, and submit completion notes.
              </p>
            </div>

          </div>

          {/* Ambient Lighting & Glassmorphism Elements */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-20 h-56 w-56 rounded-full bg-indigo-500/25 blur-3xl" />
        </div>
      </div>

      {/* ── Sub-header Meta Bar ── */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-slate-800">Queue Overview</h2>
          <p className="text-xs text-slate-400">Real-time status of open maintenance complaints</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
          <CalendarDays size={14} className="text-indigo-600" />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-xs font-bold text-rose-700 shadow-sm">
          {error}
        </div>
      )}

      {/* ── Metric Summary Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Open Queue", value: items.length, sub: "Forwarded & In Progress", icon: Wrench, lightBg: "bg-blue-50 text-blue-600", accent: "from-blue-500 to-indigo-600" },
          { label: "Awaiting Action", value: forwardedCount, sub: "Forwarded by Sub Warden", icon: Clock3, lightBg: "bg-amber-50 text-amber-600", accent: "from-amber-500 to-orange-600" },
          { label: "Currently Repairing", value: inProgressCount, sub: "Work In Progress", icon: PlayCircle, lightBg: "bg-indigo-50 text-indigo-600", accent: "from-indigo-500 to-purple-600" },
        ].map(({ label, value, sub, icon: Icon, lightBg, accent }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60"
          >
            <div className="flex items-center gap-3.5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${lightBg} transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={22} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{value}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
              </div>
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${accent}`} />
              {sub}
            </p>

            <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
          </div>
        ))}
      </div>

      {/* ── Work Order Stream Cards ── */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/70 bg-white py-12">
            <RefreshCw size={24} className="animate-spin text-indigo-600" />
            <p className="mt-3 text-xs font-semibold text-slate-400">Loading work orders queue...</p>
          </div>
        ) : items.length > 0 ? (
          items.map((x) => {
            const displayPhotoUrl = x.photoUrl
              ? x.photoUrl.startsWith("http")
                ? x.photoUrl
                : `http://localhost:8080${x.photoUrl}`
              : null;

            return (
              <article
                key={x.id}
                className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md cursor-pointer"
                onClick={() => setDetailItem(x)}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {x.status === "IN_PROGRESS" ? (
                        <span className="rounded-full border border-indigo-200/60 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
                          In Progress
                        </span>
                      ) : (
                        <span className="rounded-full border border-blue-200/60 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                          Forwarded
                        </span>
                      )}
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-500">
                        #{x.id}
                      </span>
                      <span className="rounded-full border border-slate-200/60 bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                        {x.category}
                      </span>
                      {displayPhotoUrl && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                          <Camera size={10} />
                          Photo attached
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                      {x.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">
                      {x.description}
                    </p>

                    {/* Thumbnail Preview */}
                    {displayPhotoUrl && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="overflow-hidden rounded-xl border border-slate-100 shadow-xs">
                          <img src={displayPhotoUrl} alt="Incident" className="h-16 w-20 object-cover" />
                        </div>
                      </div>
                    )}

                    {/* Sub Warden Remarks */}
                    {x.subWardenRemarks && (
                      <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/50 px-3.5 py-2.5">
                        <p className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-700">
                          <MessageSquare size={11} />
                          Sub Warden Remarks:
                        </p>
                        <p className="mt-0.5 text-xs text-indigo-800/80">
                          {x.subWardenRemarks}
                        </p>
                      </div>
                    )}

                    {/* Meta Footer */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={13} className="text-slate-400" />
                        {x.hostelName || "Hostel not assigned"} · Room {x.roomNumber || "—"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 size={13} className="text-slate-400" />
                        {x.createdAt ? new Date(x.createdAt).toLocaleDateString() : "Not available"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 self-start flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {x.status === "FORWARDED" && (
                      <button
                        onClick={(e) => startWork(x, e)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 shadow-xs transition-colors hover:bg-indigo-100"
                      >
                        <PlayCircle size={14} /> Start Work
                      </button>
                    )}
                    <button
                      onClick={() => setSelected(x)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700"
                    >
                      <CheckCircle2 size={14} /> Mark Completed
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-2xl border border-slate-200/70 bg-white p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-sm font-bold text-slate-700">All caught up!</p>
            <p className="mt-1 text-xs text-slate-400">There are no pending forwarded maintenance work orders.</p>
          </div>
        )}
      </div>

      {/* ── Complaint Detail Modal ── */}
      {detailItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setDetailItem(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Sticky Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur-md rounded-t-3xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDetailItem(null)}
                  className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <ChevronLeft size={20} />
                </button>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{detailItem.title}</h2>
                  <p className="font-mono text-[11px] font-semibold text-slate-400">#{detailItem.id}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status and category badges */}
              <div className="flex flex-wrap items-center gap-2">
                {detailItem.status === "IN_PROGRESS" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                    <Wrench size={12} />
                    In Progress
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    <Wrench size={12} />
                    Forwarded — Awaiting Repair
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                  <Tag size={12} />
                  {detailItem.category}
                </span>
              </div>

              {/* Description */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Description</p>
                <p className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-xs leading-relaxed text-slate-700">
                  {detailItem.description}
                </p>
              </div>

              {/* Location & Time Info */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="mb-1 flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</p>
                  </div>
                  <p className="text-xs font-bold text-slate-800">{detailItem.hostelName || "Hostel not assigned"}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {detailItem.buildingName ? `${detailItem.buildingName} · ` : ""}Room {detailItem.roomNumber || "—"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="mb-1 flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-slate-400" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reported Date</p>
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    {detailItem.createdAt ? new Date(detailItem.createdAt).toLocaleString() : "Not available"}
                  </p>
                </div>
              </div>

              {/* Sub Warden Remarks */}
              {detailItem.subWardenRemarks && (
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                    <MessageSquare size={14} />
                    Sub Warden Note
                  </p>
                  <p className="text-xs text-indigo-800/80 leading-relaxed">{detailItem.subWardenRemarks}</p>
                </div>
              )}

              {/* Incident Photo */}
              {detailItem.photoUrl && (
                <div>
                  <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Camera size={13} />
                    Incident Photo Attachment
                  </p>
                  <div
                    className="group relative w-fit cursor-pointer overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
                    onClick={() => {
                      const displayUrl = detailItem.photoUrl.startsWith("http")
                        ? detailItem.photoUrl
                        : `http://localhost:8080${detailItem.photoUrl}`;
                      setLightboxUrl(displayUrl);
                    }}
                  >
                    <img
                      src={
                        detailItem.photoUrl.startsWith("http")
                          ? detailItem.photoUrl
                          : `http://localhost:8080${detailItem.photoUrl}`
                      }
                      alt="Incident photo"
                      className="max-h-64 w-auto max-w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 opacity-0 transition-all duration-200 group-hover:bg-slate-900/30 group-hover:opacity-100">
                      <div className="rounded-xl bg-white/90 p-2 shadow-sm">
                        <ZoomIn size={18} className="text-slate-700" />
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 flex items-center gap-1 rounded-lg bg-slate-900/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                      <ImageIcon size={11} />
                      Click to enlarge
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                <button
                  onClick={() => setDetailItem(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100"
                >
                  Close Details
                </button>

                {detailItem.status === "FORWARDED" && (
                  <button
                    onClick={() => startWork(detailItem, null)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 py-2.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100"
                  >
                    <PlayCircle size={15} />
                    Start Work
                  </button>
                )}

                <button
                  onClick={() => setSelected(detailItem)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700"
                >
                  <CheckCircle2 size={15} />
                  Mark Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Complete Work Order Modal ── */}
      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h2 className="text-base font-bold text-slate-900">Complete Work Order</h2>
            <p className="mt-1 text-xs text-slate-400">Record repair notes for "{selected.title}".</p>

            <textarea
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="4"
              placeholder="Describe what was repaired..."
              className="mt-4 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  setSelected(null);
                  setNote("");
                }}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                disabled={!note.trim() || saving}
                onClick={complete}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FileCheck size={15} />
                    Complete Work
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox Image Modal ── */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-h-[85vh] max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute -top-3 -right-3 z-10 rounded-full bg-white p-2 text-slate-700 shadow-xl transition-colors hover:bg-slate-100"
            >
              <X size={18} />
            </button>
            <img
              src={lightboxUrl}
              alt="Incident photo (full size)"
              className="max-h-[85vh] w-full rounded-3xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );

}