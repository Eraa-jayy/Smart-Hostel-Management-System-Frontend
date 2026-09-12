import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Clock,
  Wrench,
  CheckCircle,
  XCircle,
  Search,
  ClipboardCheck,
  RefreshCw,
  MessageSquare,
  ImageIcon,
  ZoomIn,
  X,
  Camera,
  MapPin,
  CalendarDays,
  Tag,
  ChevronLeft,
} from "lucide-react";
import {
  getSubWardenComplaints,
  forwardComplaintToApi,
  declineComplaintToApi,
} from "../../service/complaintService";

const STATUS_CONFIG = {
  PENDING: { label: "Pending Review", icon: Clock, color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  FORWARDED: { label: "Forwarded to Maintenance", icon: Wrench, color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  IN_PROGRESS: { label: "In Progress", icon: Wrench, color: "bg-indigo-50 text-indigo-700 border-indigo-200", dot: "bg-indigo-500" },
  RESOLVED: { label: "Resolved", icon: CheckCircle, color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  DECLINED: { label: "Declined", icon: XCircle, color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
};

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);

  // Filters
  const [activeTab, setActiveTab] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Remarks modal
  const [remarksModal, setRemarksModal] = useState(null); // { id, action: 'forward'|'decline' }
  const [remarks, setRemarks] = useState("");

  // Lightbox state
  const [lightboxUrl, setLightboxUrl] = useState(null);

  // Detail modal state
  const [detailComplaint, setDetailComplaint] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setComplaints(await getSubWardenComplaints());
    } catch (error) {
      console.error("Unable to load complaints", error);
    }
  };

  const handleForward = (id) => {
    setRemarksModal({ id, action: "forward" });
    setRemarks("");
  };

  const handleDecline = (id) => {
    setRemarksModal({ id, action: "decline" });
    setRemarks("");
  };

  const confirmAction = async () => {
    if (!remarksModal) return;

    if (remarksModal.action === "forward") {
      await forwardComplaintToApi(remarksModal.id, remarks);
      const data = await getSubWardenComplaints();
      setComplaints(data);
      if (detailComplaint && detailComplaint.id === remarksModal.id) {
        const updated = data.find((c) => c.id === remarksModal.id);
        if (updated) setDetailComplaint(updated);
      }
    } else if (remarksModal.action === "decline") {
      await declineComplaintToApi(remarksModal.id, remarks);
      const data = await getSubWardenComplaints();
      setComplaints(data);
      if (detailComplaint && detailComplaint.id === remarksModal.id) {
        const updated = data.find((c) => c.id === remarksModal.id);
        if (updated) setDetailComplaint(updated);
      }
    }
    setRemarksModal(null);
    setRemarks("");
  };

  // Stats
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "PENDING").length;
  const forwardedCount = complaints.filter((c) => c.status === "FORWARDED" || c.status === "IN_PROGRESS").length;
  const declinedCount = complaints.filter((c) => c.status === "DECLINED").length;
  const resolvedCount = complaints.filter((c) => c.status === "RESOLVED").length;

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    // Treat IN_PROGRESS same as FORWARDED for tab purposes
    let mappedStatus = c.status;
    if (c.status === "IN_PROGRESS") mappedStatus = "FORWARDED";

    const matchesTab = activeTab === "all" || mappedStatus === activeTab;
    const matchesCategory = categoryFilter === "all" || c.category === categoryFilter;
    const matchesSearch =
      (c.roomNumber || "").includes(searchTerm) ||
      (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesCategory && matchesSearch;
  });

  // Extract categories dynamically
  const categories = ["all", ...new Set(complaints.map((c) => c.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints & Maintenance</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Review complaints raised by students. Forward maintenance issues to the technical unit or decline incorrect reports.
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "All complaints", count: totalCount, bg: "bg-gray-50", text: "text-gray-700", icon: ClipboardCheck },
          { label: "Pending Action", count: pendingCount, bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
          { label: "Forwarded", count: forwardedCount, bg: "bg-blue-50", text: "text-blue-700", icon: Wrench },
          { label: "Declined", count: declinedCount, bg: "bg-red-50", text: "text-red-700", icon: XCircle },
          { label: "Resolved", count: resolvedCount, bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle },
        ].map(({ label, count, bg, text, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-150 p-4.5">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${bg} ${text} flex items-center justify-center`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-lg font-extrabold text-gray-900">{count}</p>
                <p className="text-[10px] text-gray-400 font-medium">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs list */}
      <div className="bg-white rounded-2xl border border-gray-150 p-1.5 flex flex-wrap gap-1">
        {[
          { value: "all", label: `All (${totalCount})` },
          { value: "PENDING", label: `Pending Review (${pendingCount})` },
          { value: "FORWARDED", label: `Forwarded (${forwardedCount})` },
          { value: "DECLINED", label: `Declined (${declinedCount})` },
          { value: "RESOLVED", label: `Resolved (${resolvedCount})` },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === value
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filter and search parameters */}
      <div className="bg-white rounded-2xl border border-gray-150 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={14} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by room, title, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-xs text-gray-800 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.filter((c) => c !== "all").map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Complaints list */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center text-gray-400">
            <AlertTriangle className="mx-auto mb-2 text-gray-300" size={32} />
            <p className="text-sm font-semibold">No complaints found matching filters</p>
          </div>
        ) : (
          filteredComplaints.map((comp) => {
            const config = STATUS_CONFIG[comp.status] || STATUS_CONFIG.PENDING;
            const StatusIcon = config.icon;
            const isPending = comp.status === "PENDING";
            
            const displayPhotoUrl = comp.photoUrl 
              ? (comp.photoUrl.startsWith('http') ? comp.photoUrl : `http://localhost:8080${comp.photoUrl}`) 
              : null;

            return (
              <div
                key={comp.id}
                className="bg-white border border-gray-150 rounded-2xl p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer"
                onClick={() => setDetailComplaint(comp)}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.color}`}>
                      <StatusIcon size={10} />
                      {config.label}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">Category: {comp.category}</span>
                    {displayPhotoUrl && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">
                        <Camera size={9} />
                        Photo attached
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
                      {comp.title}
                      <span className="text-[10px] text-gray-300 font-mono">#{comp.id}</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{comp.description}</p>
                  </div>

                  {/* Thumbnail preview of student photo */}
                  {displayPhotoUrl && (
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                        <img src={displayPhotoUrl} alt="Incident" className="h-16 w-20 object-cover" />
                      </div>
                    </div>
                  )}

                  {/* Remarks */}
                  {comp.subWardenRemarks && comp.status !== "PENDING" && (
                    <div className="px-3 py-2 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                      <p className="text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                        <MessageSquare size={10} />
                        Your Remarks:
                      </p>
                      <p className="text-[11px] text-indigo-500 mt-0.5">{comp.subWardenRemarks}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-1 border-t border-gray-50">
                    {comp.roomNumber && <p className="font-semibold text-gray-700">Room {comp.roomNumber}</p>}
                    {comp.roomNumber && <div className="w-1 h-1 rounded-full bg-gray-200" />}
                    <p>{comp.hostelName}</p>
                    <div className="w-1 h-1 rounded-full bg-gray-200" />
                    <p>Date: {new Date(comp.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {isPending && (
                  <div className="flex items-center gap-2.5 self-end md:self-start md:pt-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDecline(comp.id); }}
                      className="px-4 py-2 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-700 border border-gray-200 hover:border-red-100 rounded-xl text-xs font-bold transition"
                    >
                      Decline
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleForward(comp.id); }}
                      className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 flex items-center gap-1.5 transition"
                    >
                      <Wrench size={13} />
                      Forward to Maintenance
                    </button>
                  </div>
                )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Complaint Detail Modal ── */}
      {detailComplaint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setDetailComplaint(null)}
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
                    onClick={() => setDetailComplaint(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={18} className="text-gray-500" />
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{detailComplaint.title}</h2>
                    <p className="text-[11px] font-mono text-gray-400">#{detailComplaint.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDetailComplaint(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status and meta badges */}
              <div className="flex flex-wrap items-center gap-2">
                {(() => {
                  const config = STATUS_CONFIG[detailComplaint.status] || STATUS_CONFIG.PENDING;
                  const StatusIcon = config.icon;
                  return (
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${config.color}`}>
                      <StatusIcon size={12} />
                      {config.label}
                    </span>
                  );
                })()}
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                  <Tag size={11} />
                  {detailComplaint.category}
                </span>
              </div>

              {/* Description */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                  {detailComplaint.description}
                </p>
              </div>

              {/* Location Info (No PII) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={12} className="text-gray-400" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Location</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{detailComplaint.hostelName}</p>
                  {detailComplaint.roomNumber && (
                    <p className="text-[11px] font-medium text-gray-500 mt-0.5">Room {detailComplaint.roomNumber}</p>
                  )}
                </div>
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays size={12} className="text-gray-400" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Reported Date</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{new Date(detailComplaint.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Incident Photo */}
              {detailComplaint.photoUrl && (
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Camera size={12} />
                    Incident Photo
                  </p>
                  <div
                    className="relative group cursor-pointer rounded-xl overflow-hidden border border-gray-100 shadow-sm w-fit"
                    onClick={() => {
                        const displayUrl = detailComplaint.photoUrl.startsWith('http') ? detailComplaint.photoUrl : `http://localhost:8080${detailComplaint.photoUrl}`;
                        setLightboxUrl(displayUrl);
                    }}
                  >
                    <img
                      src={detailComplaint.photoUrl.startsWith('http') ? detailComplaint.photoUrl : `http://localhost:8080${detailComplaint.photoUrl}`}
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

              {/* Sub Warden Remarks */}
              {detailComplaint.subWardenRemarks && detailComplaint.status !== "PENDING" && (
                <div className="px-4 py-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                  <p className="text-[11px] font-bold text-indigo-600 flex items-center gap-1.5 mb-1">
                    <MessageSquare size={12} />
                    Sub Warden Remarks
                  </p>
                  <p className="text-sm text-indigo-600/80">{detailComplaint.subWardenRemarks}</p>
                </div>
              )}
              
              {/* Maintenance Remarks */}
              {detailComplaint.maintenanceRemarks && (
                <div className="px-4 py-3 bg-emerald-50/60 border border-emerald-100 rounded-xl mt-2">
                  <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5 mb-1">
                    <MessageSquare size={12} />
                    Maintenance Remarks
                  </p>
                  <p className="text-sm text-emerald-600/80">{detailComplaint.maintenanceRemarks}</p>
                </div>
              )}

              {/* Actions */}
              {detailComplaint.status === "PENDING" && (
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleDecline(detailComplaint.id)}
                    className="flex-1 py-2.5 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-700 border border-gray-200 hover:border-red-100 rounded-xl text-sm font-bold transition"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleForward(detailComplaint.id)}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 transition"
                  >
                    <Wrench size={14} />
                    Forward to Maintenance
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Remarks Modal ── */}
      {remarksModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {remarksModal.action === "forward" ? "Forward to Maintenance" : "Decline Complaint"}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              {remarksModal.action === "forward"
                ? "Add optional remarks before forwarding this complaint to the maintenance department."
                : "Add a reason for declining this complaint. The student will see your remarks."}
            </p>

            <textarea
              rows="3"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks (optional)..."
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-gray-300"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setRemarksModal(null); setRemarks(""); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-sm ${
                  remarksModal.action === "forward"
                    ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
                    : "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                }`}
              >
                {remarksModal.action === "forward" ? "Forward" : "Decline"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox Modal ── */}
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
}
