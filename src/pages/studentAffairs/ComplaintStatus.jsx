import { useEffect, useMemo, useState } from "react";
import { Building2, CheckCircle2, Clock3, Wrench, XCircle } from "lucide-react";
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
  roomNo: complaint.roomNumber || complaint.roomNo || "",
  hostelName: complaint.hostelName || "Unassigned hostel",
  createdAt: complaint.createdAt || complaint.date || "",
  completedAt: complaint.completedAt || complaint.resolvedAt || complaint.resolvedDate || "",
  photoUrl: complaint.photoUrl || "",
});

const label = (status) => STATUS_LABELS[normalizeStatus(status)] || "Pending";
const color = (status) => STATUS_COLORS[normalizeStatus(status)] || STATUS_COLORS.PENDING;

export default function ComplaintStatus() {
  const [items, setItems] = useState([]);
  const [hostel, setHostel] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

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
                  <th className="px-5 py-3">Room</th>
                  <th className="px-5 py-3">Date Submitted</th>
                  <th className="px-5 py-3">Date Resolved</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((x) => (
                  <tr
                    key={x.id}
                    onClick={() => setSelectedComplaint(x)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedComplaint(x);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    className="cursor-pointer border-t border-gray-100 transition-colors hover:bg-blue-50/40 focus:bg-blue-50/40 focus:outline-none"
                    aria-label={`View complaint details for room ${x.roomNo || "unknown"}`}
                  >
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {x.hostelName || "Unassigned hostel"}
                    </td>
                    <td className="px-5 py-4">
                      {x.roomNo || "—"}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {x.createdAt ? new Date(x.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {x.completedAt ? new Date(x.completedAt).toLocaleDateString() : "—"}
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

      {selectedComplaint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="presentation"
          onClick={() => setSelectedComplaint(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="complaint-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Complaint details
                </p>
                <h2 id="complaint-details-title" className="mt-1 text-xl font-bold text-gray-900">
                  {selectedComplaint.title || "Untitled complaint"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="rounded-lg px-2 py-1 text-2xl leading-none text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close complaint details"
              >
                ×
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">Hostel</p>
                <p className="mt-1 font-medium text-gray-800">{selectedComplaint.hostelName || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">Room</p>
                <p className="mt-1 font-medium text-gray-800">{selectedComplaint.roomNo || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">Date submitted</p>
                <p className="mt-1 font-medium text-gray-800">
                  {selectedComplaint.createdAt
                    ? new Date(selectedComplaint.createdAt).toLocaleString()
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">Date resolved</p>
                <p className="mt-1 font-medium text-gray-800">
                  {selectedComplaint.completedAt
                    ? new Date(selectedComplaint.completedAt).toLocaleString()
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">Category</p>
                <p className="mt-1 font-medium text-gray-800">{selectedComplaint.category || "General"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">Status</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-bold ${color(selectedComplaint.status)}`}>
                  {label(selectedComplaint.status)}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase text-gray-400">Description</p>
              <p className="mt-1 whitespace-pre-wrap rounded-xl bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">
                {selectedComplaint.description || "No description provided."}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase text-gray-400">Attached photo</p>
              {selectedComplaint.photoUrl ? (
                <img
                  src={
                    selectedComplaint.photoUrl.startsWith("http")
                      ? selectedComplaint.photoUrl
                      : `http://localhost:8080${selectedComplaint.photoUrl}`
                  }
                  alt="Complaint attachment"
                  className="mt-2 max-h-96 w-full rounded-xl border border-gray-200 object-contain"
                />
              ) : (
                <p className="mt-1 rounded-xl bg-gray-50 p-3 text-sm text-gray-500">
                  No photo attached.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}