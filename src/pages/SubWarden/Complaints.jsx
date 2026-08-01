import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Clock,
  Wrench,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ArrowRight,
  ClipboardCheck,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import {
  getSubWardenComplaints,
  forwardComplaintToApi,
  declineComplaintToApi,
} from "../../service/complaintService";

const STATUS_CONFIG = {
  pending: { label: "Pending Review", icon: Clock, color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  in_progress: { label: "Forwarded to Maintenance", icon: Wrench, color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  completed: { label: "Resolved", icon: CheckCircle, color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  rejected: { label: "Declined", icon: XCircle, color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
};

const PRIORITY_CONFIG = {
  high: "bg-red-50 text-red-700 border-red-100",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  low: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);

  // Filters
  const [activeTab, setActiveTab] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Remarks modal
  const [remarksModal, setRemarksModal] = useState(null); // { id, action: 'forward'|'decline' }
  const [remarks, setRemarks] = useState("");

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
      await loadData();
    } else if (remarksModal.action === "decline") {
      await declineComplaintToApi(remarksModal.id, remarks);
      await loadData();
    }
    setRemarksModal(null);
    setRemarks("");
  };

  // Stats
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "pending").length;
  const forwardedCount = complaints.filter((c) => c.status === "in_progress").length;
  const declinedCount = complaints.filter((c) => c.status === "rejected").length;
  const resolvedCount = complaints.filter((c) => c.status === "completed").length;

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesTab = activeTab === "all" || c.status === activeTab;
    const matchesPriority = priorityFilter === "all" || c.priority === priorityFilter;
    const matchesCategory = categoryFilter === "all" || c.category === categoryFilter;
    const matchesSearch =
      (c.studentName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.roomNo || "").includes(searchTerm) ||
      (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesPriority && matchesCategory && matchesSearch;
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
          { value: "pending", label: `Pending Review (${pendingCount})` },
          { value: "in_progress", label: `Forwarded (${forwardedCount})` },
          { value: "rejected", label: `Declined (${declinedCount})` },
          { value: "completed", label: `Resolved (${resolvedCount})` },
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
          <input
            type="text"
            placeholder="Search by student, room, title, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8.5 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>

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
            const config = STATUS_CONFIG[comp.status] || STATUS_CONFIG.pending;
            const StatusIcon = config.icon;
            const isPending = comp.status === "pending";

            return (
              <div
                key={comp.id}
                className="bg-white border border-gray-150 rounded-2xl p-5 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.color}`}>
                      <StatusIcon size={10} />
                      {config.label}
                    </span>
                    {comp.priority && (
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${PRIORITY_CONFIG[comp.priority] || ""}`}>
                        {comp.priority}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400 font-medium">Category: {comp.category}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
                      {comp.title}
                      <span className="text-[10px] text-gray-300 font-mono">{comp.id}</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{comp.description}</p>
                  </div>

                  {/* Sub Warden remarks */}
                  {comp.subWardenRemarks && comp.status !== "pending" && (
                    <div className="px-3 py-2 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                      <p className="text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                        <MessageSquare size={10} />
                        Your Remarks:
                      </p>
                      <p className="text-[11px] text-indigo-500 mt-0.5">{comp.subWardenRemarks}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-1 border-t border-gray-50">
                    {comp.roomNo && <p className="font-semibold text-gray-700">Room {comp.roomNo}</p>}
                    {comp.roomNo && <div className="w-1 h-1 rounded-full bg-gray-200" />}
                    <p>Reported by: <span className="font-medium text-gray-600">{comp.studentName || "Unknown"}</span></p>
                    {comp.studentRegNo && (
                      <>
                        <div className="w-1 h-1 rounded-full bg-gray-200" />
                        <p className="font-mono text-[10px] text-gray-400">{comp.studentRegNo}</p>
                      </>
                    )}
                    <div className="w-1 h-1 rounded-full bg-gray-200" />
                    <p>Date: {comp.date}</p>
                  </div>
                </div>

                {isPending && (
                  <div className="flex items-center gap-2.5 self-end md:self-start md:pt-1">
                    <button
                      onClick={() => handleDecline(comp.id)}
                      className="px-4 py-2 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-700 border border-gray-200 hover:border-red-100 rounded-xl text-xs font-bold transition"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleForward(comp.id)}
                      className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 flex items-center gap-1.5 transition"
                    >
                      <Wrench size={13} />
                      Forward to Maintenance
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Remarks Modal ── */}
      {remarksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
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
    </div>
  );
}
