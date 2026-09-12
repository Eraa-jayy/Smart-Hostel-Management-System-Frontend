import React, { useState, useEffect } from "react";
import {
  FileWarning,
  Send,
  RotateCcw,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  MessageSquareWarning,
  ChevronDown,
  CalendarDays,
  Tag,
  RefreshCw,
  Wrench,
} from "lucide-react";
import {
  getAllComplaints,
  submitComplaint,
} from "../../service/complaintService";

const CATEGORIES = [
  "Electrical",
  "Plumbing",
  "Furniture",
  "Internet / Wi-Fi",
  "Cleanliness",
  "Security",
  "Other",
];

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-emerald-50 text-emerald-600 border-emerald-200 ring-emerald-100" },
  { value: "medium", label: "Medium", color: "bg-amber-50 text-amber-600 border-amber-200 ring-amber-100" },
  { value: "high", label: "High", color: "bg-red-50 text-red-600 border-red-200 ring-red-100" },
];

const STATUS_CONFIG = {
  pending: { label: "Pending", icon: Clock, color: "bg-amber-50 text-amber-600", dot: "bg-amber-400" },
  in_progress: { label: "Forwarded", icon: Wrench, color: "bg-blue-50 text-blue-600", dot: "bg-blue-400" },
  completed: { label: "Resolved", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-400" },
  rejected: { label: "Declined", icon: XCircle, color: "bg-red-50 text-red-600", dot: "bg-red-400" },
};

const PRIORITY_CONFIG = {
  low: "bg-emerald-50 text-emerald-600",
  medium: "bg-amber-50 text-amber-600",
  high: "bg-red-50 text-red-600",
};

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = () => {
    const data = getAllComplaints();
    setComplaints(data);
  };

  const handleSubmit = () => {
    if (!title.trim() || !category || !description.trim()) {
      alert("Please fill in the Title, Category, and Description fields.");
      return;
    }

    setSubmitting(true);

    // Get logged-in student info from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    const newComplaint = submitComplaint({
      title: title.trim(),
      category,
      priority: priority || "medium",
      description: description.trim(),
      studentName: storedUser.fullName || storedUser.name || "Current Student",
      studentRegNo: storedUser.registrationNumber || storedUser.username || "",
      roomNo: storedUser.roomNo || "",
    });

    // Clear form
    setTitle("");
    setCategory("");
    setPriority("");
    setDescription("");
    setSubmitting(false);

    // Refresh
    loadComplaints();

    // Success feedback
    setSuccessMsg(`Complaint "${newComplaint.title}" submitted successfully!`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const filtered = filterStatus === "all"
    ? complaints
    : complaints.filter((c) => c.status === filterStatus);

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in_progress").length,
    resolved: complaints.filter((c) => c.status === "completed").length,
    declined: complaints.filter((c) => c.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Submit and track your maintenance requests
          </p>
        </div>
        <button
          onClick={loadComplaints}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* ── Success Banner ── */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-center gap-2 text-sm text-emerald-700 font-medium animate-pulse">
          <CheckCircle2 size={16} />
          {successMsg}
        </div>
      )}

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total, bg: "bg-gray-50", iconColor: "text-gray-600", icon: FileWarning },
          { label: "Pending", value: stats.pending, bg: "bg-amber-50", iconColor: "text-amber-600", icon: Clock },
          { label: "Forwarded", value: stats.inProgress, bg: "bg-blue-50", iconColor: "text-blue-600", icon: Wrench },
          { label: "Resolved", value: stats.resolved, bg: "bg-emerald-50", iconColor: "text-emerald-600", icon: CheckCircle2 },
          { label: "Declined", value: stats.declined, bg: "bg-red-50", iconColor: "text-red-600", icon: XCircle },
        ].map(({ label, value, bg, iconColor, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={18} className={iconColor} strokeWidth={2} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-[11px] text-gray-400">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Two Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Submit Form (Left) ── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 h-fit">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Send size={16} className="text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-800">New Complaint</h2>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Title <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Broken ceiling fan"
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Category <span className="text-red-400">*</span></label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-2">Priority</label>
              <div className="flex gap-2.5">
                {PRIORITIES.map(({ value, label, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPriority(value)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border-2 transition-all duration-200 ${
                      priority === value
                        ? color + " ring-2"
                        : "bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Description <span className="text-red-400">*</span></label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail..."
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-gray-300"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => { setTitle(""); setCategory(""); setPriority(""); setDescription(""); }}
                className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <RotateCcw size={14} />
                Clear
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all disabled:opacity-50"
              >
                <Send size={14} />
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Complaints List (Right) ── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filter bar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter size={15} />
              <span className="text-[12px] font-medium">Filter:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All" },
                { value: "pending", label: "Pending" },
                { value: "in_progress", label: "Forwarded" },
                { value: "completed", label: "Resolved" },
                { value: "rejected", label: "Declined" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilterStatus(value)}
                  className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all duration-200 ${
                    filterStatus === value
                      ? "bg-gray-900 text-white shadow-sm"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Complaint cards */}
          {filtered.map((complaint) => {
            const st = STATUS_CONFIG[complaint.status] || STATUS_CONFIG.pending;
            const StatusIcon = st.icon;
            return (
              <div
                key={complaint.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`mt-0.5 w-2 h-2 rounded-full ${st.dot} flex-shrink-0`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[14px] font-semibold text-gray-800">{complaint.title}</h3>
                        <span className="text-[10px] font-mono text-gray-300">{complaint.id}</span>
                      </div>
                      <p className="text-[12px] text-gray-400 mt-1 leading-relaxed">{complaint.description}</p>

                      {/* Sub Warden remarks (shown when available) */}
                      {complaint.subWardenRemarks && complaint.status !== "pending" && (
                        <div className="mt-2 px-3 py-2 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                          <p className="text-[11px] font-semibold text-indigo-600">Sub Warden Remarks:</p>
                          <p className="text-[11px] text-indigo-500 mt-0.5">{complaint.subWardenRemarks}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${st.color}`}>
                    <StatusIcon size={11} />
                    {st.label}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-50">
                  {complaint.priority && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_CONFIG[complaint.priority] || ""}`}>
                      {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Tag size={10} />
                    {complaint.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <CalendarDays size={10} />
                    {complaint.date}
                  </span>
                  {complaint.roomNo && (
                    <span className="text-[11px] text-gray-400">
                      Room {complaint.roomNo}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <MessageSquareWarning size={20} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">No complaints found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
