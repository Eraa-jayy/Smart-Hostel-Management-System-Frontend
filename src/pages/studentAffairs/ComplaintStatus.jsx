import { useEffect, useMemo, useState } from "react";
import { Building2, CheckCircle2, Clock3, RefreshCw, Wrench, XCircle } from "lucide-react";
import api from "../../service/axios";

const STATUS_LABELS = {
  PENDING: "Pending",
  FORWARDED: "Forwarded",
  IN_PROGRESS: "Forwarded",
  RESOLVED: "Resolved",
  DECLINED: "Declined",
};

const STATUS_COLORS = {
  PENDING: "bg-amber-50 text-amber-700",
  FORWARDED: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  RESOLVED: "bg-emerald-50 text-emerald-700",
  DECLINED: "bg-red-50 text-red-700",
};

const normalizeStatus = (status) => {
  const value = String(status || "").toUpperCase();
  if (value === "PENDING") return "PENDING";
  if (value === "FORWARDED" || value === "IN_PROGRESS") return "FORWARDED";
  if (value === "RESOLVED" || value === "COMPLETED") return "RESOLVED";
  if (value === "DECLINED" || value === "REJECTED") return "DECLINED";
  return "PENDING";
};

const normalizeComplaint = (complaint) => ({
  id: String(complaint.id),
  title: complaint.title || "Untitled complaint",
  description: complaint.description || "",
  category: complaint.category || "General",
  status: normalizeStatus(complaint.status),
  studentName: complaint.studentName || "Unknown",
  studentRegNo: complaint.studentIndexNumber || complaint.studentRegNo || "",
  roomNo: complaint.roomNumber || complaint.roomNo || "",
  hostelName: complaint.hostelName || "Unassigned hostel",
  createdAt: complaint.createdAt || complaint.date || "",
});

const label = (status) => STATUS_LABELS[normalizeStatus(status)] || "Pending";
const color = (status) => STATUS_COLORS[normalizeStatus(status)] || STATUS_COLORS.PENDING;

export default function ComplaintStatus() {
  const [items, setItems] = useState([]);
  const [hostel, setHostel] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/complaints");
      const data = Array.isArray(response.data) ? response.data : [];
      setItems(data.map(normalizeComplaint));
    } catch (err) {
      setError("Unable to load complaint status data.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const hostels = useMemo(
    () => [...new Set(items.map((x) => x.hostelName || "Unassigned hostel"))],
    [items]
  );

  const shown = hostel === "all"
    ? items
    : items.filter((x) => (x.hostelName || "Unassigned hostel") === hostel);

  const count = (status) => shown.filter((x) => normalizeStatus(x.status) === status).length;

  const stats = [
    ["Total", shown.length, Building2, "text-gray-700"],
    ["Pending", count("PENDING"), Clock3, "text-amber-600"],
    ["Forwarded", count("FORWARDED"), Wrench, "text-blue-600"],
    ["Resolved", count("RESOLVED"), CheckCircle2, "text-emerald-600"],
    ["Declined", count("DECLINED"), XCircle, "text-red-600"],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaint Status</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor student complaints and maintenance progress by hostel.
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Building2 size={18} className="text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">Filter by hostel</span>
        </div>
        <select
          value={hostel}
          onChange={(e) => setHostel(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 sm:max-w-xs"
        >
          <option value="all">All hostels</option>
          {hostels.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(([name, value, Icon, iconColor]) => (
          <div key={name} className="rounded-2xl border border-gray-200 bg-white p-4">
            <Icon className={iconColor} size={19} />
            <p className="mt-2 text-xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{name}</p>
          </div>
        ))}
      </div>

      {loading && <p className="py-12 text-center text-sm text-gray-400">Loading complaints...</p>}

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Hostel</th>
                  <th className="px-5 py-3">Complaint</th>
                  <th className="px-5 py-3">Room / Student</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((x) => (
                  <tr key={x.id} className="border-t border-gray-100">
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {x.hostelName || "Unassigned hostel"}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">{x.title}</p>
                      <p className="text-xs text-gray-500">{x.category}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {x.roomNo || "—"} · {x.studentName || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-bold ${color(x.status)}`}>
                        {label(x.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {shown.length === 0 && (
            <p className="p-8 text-center text-sm text-gray-400">
              No complaints found for this hostel.
            </p>
          )}
        </div>
      )}
    </div>
  );
}