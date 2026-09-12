import { useEffect, useState } from "react";
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
  PlayCircle
} from "lucide-react";
import { completeMaintenanceComplaint, getMaintenanceQueue, startMaintenanceComplaint } from "../../service/maintenanceService";

export default function Complaints() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
<<<<<<< Updated upstream
  const load = async () => { setLoading(true); setError(""); try { setItems(await getMaintenanceQueue()); } catch { setError("Unable to load work orders. Check that the backend is running and you are signed in as maintenance staff."); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const complete = async () => { if (!note.trim()) return; setSaving(true); try { await completeMaintenanceComplaint(selected.id, note.trim()); setSelected(null); setNote(""); await load(); } catch (e) { setError(e.response?.data?.message || "Could not complete this work order."); } finally { setSaving(false); } };
  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-bold text-gray-900">Complaints</h1><p className="text-sm text-gray-500 mt-1">Forwarded complaints waiting for maintenance work.</p></div><button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600"><RefreshCw size={14} /> Refresh</button></div><div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center"><Wrench size={19} /></span><div><p className="text-lg font-extrabold text-gray-900">{items.length} open work order{items.length === 1 ? "" : "s"}</p><p className="text-xs text-blue-700">Every job includes the hostel and room location.</p></div></div>{loading && <p className="py-12 text-center text-sm text-gray-400">Loading work orders…</p>}{error && <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700">{error}</div>}{!loading && !error && !items.length && <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center"><CheckCircle2 className="mx-auto text-emerald-500 mb-2" /><p className="font-semibold text-gray-800">All caught up</p></div>}<div className="grid gap-4">{items.map((x) => <article key={x.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="flex flex-col md:flex-row md:justify-between gap-4"><div><div className="flex flex-wrap gap-2 items-center"><span className="rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">Forwarded</span><span className="text-xs text-gray-400">#{x.id}</span><span className="text-xs text-gray-400">{x.category}</span></div><h2 className="mt-3 text-base font-bold text-gray-900">{x.title}</h2><p className="mt-1 text-sm text-gray-600">{x.description}</p>{x.subWardenRemarks && <p className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-700"><b>Sub warden note:</b> {x.subWardenRemarks}</p>}<div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500"><span className="inline-flex items-center gap-1"><MapPin size={13} /> {x.hostelName || "Hostel not assigned"} · Room {x.roomNumber || "—"}</span><span>{x.studentName || "Student"} {x.studentIndexNumber ? `(${x.studentIndexNumber})` : ""}</span><span className="inline-flex items-center gap-1"><Clock3 size={13} /> {x.createdAt ? new Date(x.createdAt).toLocaleString() : "Not available"}</span></div></div><button onClick={() => setSelected(x)} className="self-start inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white"><CheckCircle2 size={15} /> Mark completed</button></div></article>)}</div>{selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><h2 className="text-lg font-bold text-gray-900">Complete work order</h2><p className="mt-1 text-sm text-gray-500">Record what was repaired for “{selected.title}”.</p><textarea autoFocus value={note} onChange={(e) => setNote(e.target.value)} rows="4" placeholder="Describe the completed repair..." className="mt-4 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm" /><div className="mt-4 flex gap-3"><button onClick={() => { setSelected(null); setNote(""); }} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600">Cancel</button><button disabled={!note.trim() || saving} onClick={complete} className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? "Saving…" : "Complete work"}</button></div></div></div>}</div>;
=======
  const [lightboxUrl, setLightboxUrl] = useState(null);

  // Detail modal state
  const [detailItem, setDetailItem] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await getMaintenanceQueue());
    } catch {
      setError("Unable to load work orders. Check that the backend is running and you are signed in as maintenance staff.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startWork = async (item, e) => {
    if(e) e.stopPropagation();
    try {
      await startMaintenanceComplaint(item.id);
      if (detailItem && detailItem.id === item.id) {
          setDetailItem({...detailItem, status: "IN_PROGRESS"});
      }
      await load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not start this work order.");
    }
  }

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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
          <p className="text-sm text-gray-500 mt-1">Forwarded complaints waiting for maintenance work.</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-sm">
          <Wrench size={19} />
        </span>
        <div>
          <p className="text-lg font-extrabold text-gray-900">{items.length} open work order{items.length === 1 ? "" : "s"}</p>
          <p className="text-xs text-blue-700">Every job includes the hostel and room location.</p>
        </div>
      </div>

      {loading && <p className="py-12 text-center text-sm text-gray-400">Loading work orders…</p>}
      {error && <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700">{error}</div>}
      {!loading && !error && !items.length && (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={32} />
          <p className="font-semibold text-gray-800">All caught up</p>
        </div>
      )}

      <div className="grid gap-4">
        {items.map((x) => {
          
          const displayPhotoUrl = x.photoUrl 
              ? (x.photoUrl.startsWith('http') ? x.photoUrl : `http://localhost:8080${x.photoUrl}`) 
              : null;

          return (
            <article
              key={x.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer"
              onClick={() => setDetailItem(x)}
            >
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 items-center">
                    {x.status === "IN_PROGRESS" ? (
                      <span className="rounded-full bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase text-indigo-700">In Progress</span>
                    ) : (
                      <span className="rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">Forwarded</span>
                    )}
                    <span className="text-xs font-mono text-gray-400">#{x.id}</span>
                    <span className="text-xs font-medium text-gray-500">{x.category}</span>
                    {displayPhotoUrl && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">
                        <Camera size={9} />
                        Photo attached
                      </span>
                    )}
                  </div>
                  <h2 className="mt-3 text-base font-bold text-gray-900">{x.title}</h2>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2 leading-relaxed">{x.description}</p>

                  {/* Thumbnail preview of student photo */}
                  {displayPhotoUrl && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                        <img src={displayPhotoUrl} alt="Incident" className="h-16 w-20 object-cover" />
                      </div>
                    </div>
                  )}

                  {x.subWardenRemarks && (
                    <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-2">
                      <p className="text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                          <MessageSquare size={10} />
                          Sub Warden Note:
                      </p>
                      <p className="text-[11px] text-indigo-700 mt-0.5">
                        {x.subWardenRemarks}
                      </p>
                    </div>
                  )}
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={13} /> {x.hostelName || "Hostel not assigned"} · Room {x.roomNumber || "—"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={13} /> {x.createdAt ? new Date(x.createdAt).toLocaleDateString() : "Not available"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 self-start">
                  {x.status === "FORWARDED" && (
                    <button
                      onClick={(e) => startWork(x, e)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
                    >
                      <PlayCircle size={15} /> Start Work
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelected(x); }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <CheckCircle2 size={15} /> Mark completed
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* ── Complaint Detail Modal ── */}
      {detailItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setDetailItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDetailItem(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={18} className="text-gray-500" />
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{detailItem.title}</h2>
                    <p className="text-[11px] font-mono text-gray-400">#{detailItem.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDetailItem(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status badge and category */}
              <div className="flex flex-wrap items-center gap-2">
                {detailItem.status === "IN_PROGRESS" ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200">
                    <Wrench size={12} />
                    In Progress
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                    <Wrench size={12} />
                    Forwarded — Awaiting Repair
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                  <Tag size={11} />
                  {detailItem.category}
                </span>
              </div>

              {/* Description */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                  {detailItem.description}
                </p>
              </div>

              {/* Location & Time Info (No Student PII) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={12} className="text-gray-400" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Location</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{detailItem.hostelName || "Hostel not assigned"}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{detailItem.buildingName ? `${detailItem.buildingName} · ` : ""}Room {detailItem.roomNumber || "—"}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays size={12} className="text-gray-400" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Reported</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {detailItem.createdAt ? new Date(detailItem.createdAt).toLocaleString() : "Not available"}
                  </p>
                </div>
              </div>

              {/* Sub Warden Remarks */}
              {detailItem.subWardenRemarks && (
                <div className="px-4 py-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                  <p className="text-[11px] font-bold text-indigo-600 flex items-center gap-1.5 mb-1">
                    <MessageSquare size={12} />
                    Sub Warden Note
                  </p>
                  <p className="text-sm text-indigo-600/80">{detailItem.subWardenRemarks}</p>
                </div>
              )}

              {/* Student's Incident Photo */}
              {detailItem.photoUrl && (
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Camera size={12} />
                    Incident Photo
                  </p>
                  <div
                    className="relative group cursor-pointer rounded-xl overflow-hidden border border-gray-100 shadow-sm w-fit"
                    onClick={() => {
                        const displayUrl = detailItem.photoUrl.startsWith('http') ? detailItem.photoUrl : `http://localhost:8080${detailItem.photoUrl}`;
                        setLightboxUrl(displayUrl);
                    }}
                  >
                    <img
                      src={detailItem.photoUrl.startsWith('http') ? detailItem.photoUrl : `http://localhost:8080${detailItem.photoUrl}`}
                      alt="Incident photo"
                      className="max-h-64 w-auto max-w-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="p-2 bg-white/90 rounded-lg shadow-sm">
                        <ZoomIn size={16} className="text-gray-700" />
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-black/50 text-white text-[9px] font-semibold rounded-md">
                      <ImageIcon size={10} />
                      Click to enlarge
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setDetailItem(null)}
                  className="flex-1 py-2.5 bg-gray-50 text-gray-500 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 transition"
                >
                  Close
                </button>
                {detailItem.status === "FORWARDED" && (
                    <button
                    onClick={() => startWork(detailItem, null)}
                    className="flex-1 py-2.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition"
                  >
                    <PlayCircle size={14} />
                    Start Work
                  </button>
                )}
                <button
                  onClick={() => setSelected(detailItem)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2 transition"
                >
                  <CheckCircle2 size={14} />
                  Mark Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Complete Work Order Modal ── */}
      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900">Complete work order</h2>
            <p className="mt-1 text-sm text-gray-500">Record what was repaired for "{selected.title}".</p>
            <textarea autoFocus value={note} onChange={(e) => setNote(e.target.value)} rows="4" placeholder="Describe the completed repair..." className="mt-4 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
            <div className="mt-4 flex gap-3">
              <button onClick={() => { setSelected(null); setNote(""); }} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button disabled={!note.trim() || saving} onClick={complete} className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-sm font-bold text-white disabled:opacity-50 transition shadow-sm shadow-emerald-600/20">
                {saving ? "Saving…" : "Complete work"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute -top-3 -right-3 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X size={18} className="text-gray-700" />
            </button>
            <img
              src={lightboxUrl}
              alt="Incident photo (full size)"
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
>>>>>>> Stashed changes
}
