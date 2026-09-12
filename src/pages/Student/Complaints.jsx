import React, { useState, useEffect, useRef } from "react";
import {
  FileWarning,
  Send,
  RotateCcw,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  MessageSquareWarning,
  ChevronDown,
  CalendarDays,
  Tag,
  RefreshCw,
  Wrench,
  ImagePlus,
  X,
  ZoomIn,
} from "lucide-react";
import {
  getMyComplaints,
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

const STATUS_CONFIG = {
  PENDING: { label: "Pending", icon: Clock, color: "bg-amber-50 text-amber-600", dot: "bg-amber-400" },
  FORWARDED: { label: "Forwarded", icon: Wrench, color: "bg-blue-50 text-blue-600", dot: "bg-blue-400" },
  IN_PROGRESS: { label: "In Progress", icon: Wrench, color: "bg-indigo-50 text-indigo-600", dot: "bg-indigo-400" },
  RESOLVED: { label: "Resolved", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-400" },
  DECLINED: { label: "Declined", icon: XCircle, color: "bg-red-50 text-red-600", dot: "bg-red-400" },
};

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Photo upload state
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Lightbox state
  const [lightboxUrl, setLightboxUrl] = useState(null);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const data = await getMyComplaints();
      setComplaints(data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load complaints.");
    }
  };

  // Photo handlers
  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select an image file (JPEG, PNG, or WebP).");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5 MB.");
      return;
    }

    setPhotoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!title.trim() || !category || !description.trim()) {
      setErrorMsg("Please fill in all required fields: Title, Category, and Description.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const newComplaint = await submitComplaint({
        title: title.trim(),
        category,
        description: description.trim(),
      }, photoFile);

      // Clear form
      setTitle("");
      setCategory("");
      setDescription("");
      removePhoto();
      
      // Refresh complaints list
      await loadComplaints();

      // Success feedback
      setSuccessMsg(`Complaint "${newComplaint.title}" submitted successfully!`);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Complaint submission error:", err);
      const serverMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null);
      setErrorMsg(serverMsg || "Failed to submit complaint. Make sure you have an active room allocation.");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = filterStatus === "all"
    ? complaints
    : complaints.filter((c) => c.status === filterStatus);

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "PENDING").length,
    inProgress: complaints.filter((c) => c.status === "FORWARDED" || c.status === "IN_PROGRESS").length,
    resolved: complaints.filter((c) => c.status === "RESOLVED").length,
    declined: complaints.filter((c) => c.status === "DECLINED").length,
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

      {/* ── Banners ── */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-center gap-2 text-sm text-emerald-700 font-medium animate-pulse">
          <CheckCircle2 size={16} />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-center gap-2 text-sm text-red-700 font-medium">
          <XCircle size={16} />
          {errorMsg}
        </div>
      )}

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total, bg: "bg-gray-50", iconColor: "text-gray-600", icon: FileWarning },
          { label: "Pending", value: stats.pending, bg: "bg-amber-50", iconColor: "text-amber-600", icon: Clock },
          { label: "In Progress", value: stats.inProgress, bg: "bg-blue-50", iconColor: "text-blue-600", icon: Wrench },
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

            {/* Photo Upload */}
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">
                Incident Photo <span className="text-gray-300">(optional)</span>
              </label>

              {!photoPreview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                    dragActive
                      ? "border-blue-400 bg-blue-50/50 scale-[1.01]"
                      : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    dragActive ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <ImagePlus size={18} className={dragActive ? "text-blue-500" : "text-gray-400"} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-500">
                      {dragActive ? "Drop your image here" : "Drag & drop or click to upload"}
                    </p>
                    <p className="text-[10px] text-gray-300 mt-0.5">
                      JPEG, PNG, WebP · Max 5 MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={photoPreview}
                    alt="Incident preview"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => setLightboxUrl(photoPreview)}
                      className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors shadow-sm"
                    >
                      <ZoomIn size={16} className="text-gray-700" />
                    </button>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="p-2 bg-white/90 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                  </div>
                  <div className="px-3 py-2 flex items-center justify-between">
                    <p className="text-[11px] text-gray-500 truncate">
                      {photoFile?.name}
                    </p>
                    <p className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                      {photoFile && (photoFile.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => { setTitle(""); setCategory(""); setDescription(""); removePhoto(); }}
                className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <RotateCcw size={14} />
                Clear
              </button>
              <button
                type="button"
                id="submit-complaint-btn"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Submit
                  </>
                )}
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
                { value: "PENDING", label: "Pending" },
                { value: "FORWARDED", label: "Forwarded" },
                { value: "IN_PROGRESS", label: "In Progress" },
                { value: "RESOLVED", label: "Resolved" },
                { value: "DECLINED", label: "Declined" },
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
            const st = STATUS_CONFIG[complaint.status] || STATUS_CONFIG.PENDING;
            const StatusIcon = st.icon;
            
            // Generate full photo URL if needed
            const displayPhotoUrl = complaint.photoUrl 
              ? (complaint.photoUrl.startsWith('http') ? complaint.photoUrl : `http://localhost:8080${complaint.photoUrl}`) 
              : null;

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
                        <span className="text-[10px] font-mono text-gray-300">#{complaint.id}</span>
                      </div>
                      <p className="text-[12px] text-gray-400 mt-1 leading-relaxed">{complaint.description}</p>

                      {/* Incident Photo */}
                      {displayPhotoUrl && (
                        <div
                          className="mt-2.5 relative group cursor-pointer rounded-lg overflow-hidden border border-gray-100 w-fit"
                          onClick={() => setLightboxUrl(displayPhotoUrl)}
                        >
                          <img
                            src={displayPhotoUrl}
                            alt="Incident photo"
                            className="h-28 w-auto max-w-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="p-1.5 bg-white/90 rounded-lg shadow-sm">
                              <ZoomIn size={14} className="text-gray-700" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Remarks (shown when available) */}
                      {complaint.subWardenRemarks && (
                        <div className="mt-2 px-3 py-2 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                          <p className="text-[11px] font-semibold text-indigo-600">Sub Warden Remarks:</p>
                          <p className="text-[11px] text-indigo-500 mt-0.5">{complaint.subWardenRemarks}</p>
                        </div>
                      )}
                      
                      {complaint.maintenanceRemarks && (
                        <div className="mt-2 px-3 py-2 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                          <p className="text-[11px] font-semibold text-emerald-600">Maintenance Remarks:</p>
                          <p className="text-[11px] text-emerald-500 mt-0.5">{complaint.maintenanceRemarks}</p>
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
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Tag size={10} />
                    {complaint.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <CalendarDays size={10} />
                    {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : ""}
                  </span>
                  {complaint.roomNumber && (
                    <span className="text-[11px] text-gray-400">
                      {complaint.hostelName} · Room {complaint.roomNumber}
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

      {/* ── Lightbox Modal ── */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
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
