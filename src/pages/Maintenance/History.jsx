import { useEffect, useState } from "react";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { getMaintenanceHistory } from "../../service/maintenanceService";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => { setLoading(true); setError(""); try { setItems(await getMaintenanceHistory()); } catch { setError("Unable to load maintenance history."); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  return <div className="space-y-6"><div className="flex justify-between items-end gap-3"><div><h1 className="text-2xl font-bold text-gray-900">History</h1><p className="mt-1 text-sm text-gray-500">Completed maintenance work and repair notes.</p></div><button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600"><RefreshCw size={14} /> Refresh</button></div>{loading && <p className="py-12 text-center text-sm text-gray-400">Loading history…</p>}{error && <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700">{error}</div>} {!loading && !error && (items.length ? <div className="space-y-4">{items.map((item) => <article key={item.id} className="rounded-2xl border border-gray-200 bg-white p-5"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-emerald-700"><CheckCircle2 size={17} /><span className="text-xs font-bold uppercase">Completed</span></div><h2 className="mt-2 font-bold text-gray-900">{item.title}</h2><p className="mt-1 text-sm text-gray-600">{item.hostelName || "Hostel not assigned"} · Room {item.roomNumber || "—"}</p></div><span className="text-xs text-gray-400">{item.completedAt ? new Date(item.completedAt).toLocaleString() : "—"}</span></div><div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-sm text-emerald-800"><b>Maintenance note:</b> {item.maintenanceRemarks || "No note recorded."}</div></article>)}</div> : <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-400">No completed maintenance work yet.</div>)}</div>;
}
