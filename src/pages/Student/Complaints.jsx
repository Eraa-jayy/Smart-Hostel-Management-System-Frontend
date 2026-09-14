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
  Sparkles,
  MapPin,
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
  PENDING: { label: "Pending", icon: Clock, color: "bg-amber-50 text-amber-600 border-amber-200/60", dot: "bg-amber-400" },
  FORWARDED: { label: "Forwarded", icon: Wrench, color: "bg-blue-50 text-blue-600 border-blue-200/60", dot: "bg-blue-400" },
  IN_PROGRESS: { label: "In Progress", icon: Wrench, color: "bg-indigo-50 text-indigo-600 border-indigo-200/60", dot: "bg-indigo-400" },
  RESOLVED: { label: "Resolved", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600 border-emerald-200/60", dot: "bg-emerald-400" },
  DECLINED: { label: "Declined", icon: XCircle, color: "bg-rose-50 text-rose-600 border-rose-200/60", dot: "bg-rose-400" },
};

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    try {
      const data = await getMyComplaints();
      setComplaints(data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select an image file (JPEG, PNG, or WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5 MB.");
      return;
    }

    setPhotoFile(file);
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
      const newComplaint = await submitComplaint(
        {
          title: title.trim(),
          category,
          description: description.trim(),
        },
        photoFile
      );

      setTitle("");
      setCategory("");
      setDescription("");
      removePhoto();

      await loadComplaints();

      setSuccessMsg(`Complaint "${newComplaint?.title || title}" submitted successfully!`);
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

  const filtered =
    filterStatus === "all"
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
    <div className="space-y-6 pb-12">
      {/* ── Page Header Banner ── */}
      <div className="w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 text-white shadow-2xl shadow-indigo-950/20 sm:p-8 lg:p-10">
          <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1 text-xs font-semibold tracking-wide text-blue-200 backdrop-blur-md">
                <Sparkles size={13} className="text-blue-300" />
                Maintenance & Support
              </span>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                Hostel Complaints
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Lodge facility issues, track maintenance resolution progress, and access sub-warden feedback in real time.
              </p>
            </div>

          </div>

          {/* Background Lighting Effects */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-20 h-56 w-56 rounded-full bg-indigo-500/25 blur-3xl" />
        </div>
      </div>

      {/* ── Feedback Banners ── */}
      {successMsg && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-xs font-bold text-rose-700 shadow-sm backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <XCircle size={18} className="text-rose-600 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* ── Interactive Metric Cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
        {[
          { label: "Total Filed", value: stats.total, lightBg: "bg-slate-100 text-slate-700", icon: FileWarning },
          { label: "Pending Review", value: stats.pending, lightBg: "bg-amber-50 text-amber-600", icon: Clock },
          { label: "In Resolution", value: stats.inProgress, lightBg: "bg-blue-50 text-blue-600", icon: Wrench },
          { label: "Resolved", value: stats.resolved, lightBg: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 },
          { label: "Declined", value: stats.declined, lightBg: "bg-rose-50 text-rose-600", icon: XCircle },
        ].map(({ label, value, lightBg, icon: Icon }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${lightBg} transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={18} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">{value}</p>
                <p className="text-[11px] font-semibold text-slate-400">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Layout (Form Left / Stream Right) ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        
        {/* Submit Form (Left Span 2) */}
        <div className="h-fit rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Send size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">New Complaint</h2>
              <p className="text-xs text-slate-400">Fill in details for quick action</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Broken ceiling fan in Room A-204"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Category <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Photo Upload Box */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Incident Photo <span className="font-normal text-slate-400">(Optional)</span>
              </label>

              {!photoPreview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-5 text-center transition-all duration-200 ${
                    dragActive
                      ? "border-indigo-500 bg-indigo-50/60 scale-[1.01]"
                      : "border-slate-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/20 cursor-pointer"
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                    dragActive ? "bg-indigo-100 text-indigo-600" : "bg-white text-slate-400 shadow-sm group-hover:text-indigo-500"
                  }`}>
                    <ImagePlus size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      {dragActive ? "Drop image here" : "Drag & drop or click to upload"}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-400">JPEG, PNG, WebP · Max 5 MB</p>
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
                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img
                    src={photoPreview}
                    alt="Incident preview"
                    className="h-40 w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-900/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 backdrop-blur-xs">
                    <button
                      type="button"
                      onClick={() => setLightboxUrl(photoPreview)}
                      className="rounded-xl bg-white/90 p-2 text-slate-700 shadow-md transition-transform hover:scale-105 hover:bg-white"
                    >
                      <ZoomIn size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="rounded-xl bg-white/90 p-2 text-rose-600 shadow-md transition-transform hover:scale-105 hover:bg-rose-50"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200/60 bg-white px-3 py-2">
                    <p className="truncate text-[11px] font-semibold text-slate-600">{photoFile?.name}</p>
                    <p className="ml-2 flex-shrink-0 text-[10px] font-medium text-slate-400">
                      {photoFile && (photoFile.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setCategory("");
                  setDescription("");
                  removePhoto();
                }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
              >
                <RotateCcw size={14} />
                Clear
              </button>
              <button
                type="button"
                id="submit-complaint-btn"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Complaints Stream List (Right Span 3) */}
        <div className="space-y-4 lg:col-span-3">
          
          {/* Filter Bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Filter size={14} className="text-indigo-600" />
              <span>Filter Status:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
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
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    filterStatus === value
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100/80 text-slate-500 hover:bg-slate-200/80 hover:text-slate-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Stack */}
          <div className="space-y-3.5">
            {filtered.map((complaint) => {
              const st = STATUS_CONFIG[complaint.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = st.icon;

              const displayPhotoUrl = complaint.photoUrl
                ? complaint.photoUrl.startsWith("http")
                  ? complaint.photoUrl
                  : `http://localhost:8080${complaint.photoUrl}`
                : null;

              return (
                <div
                  key={complaint.id}
                  className="group rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`mt-1.5 h-2.5 w-2.5 rounded-full ${st.dot} flex-shrink-0 ring-4 ring-slate-50`} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-800">{complaint.title}</h3>
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-400">
                            #{complaint.id}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">{complaint.description}</p>

                        {/* Incident Photo Thumbnail */}
                        {displayPhotoUrl && (
                          <div
                            className="group/img relative mt-3 w-fit cursor-pointer overflow-hidden rounded-xl border border-slate-200"
                            onClick={() => setLightboxUrl(displayPhotoUrl)}
                          >
                            <img
                              src={displayPhotoUrl}
                              alt="Incident photo"
                              className="h-28 max-w-full object-cover rounded-xl transition-transform duration-300 group-hover/img:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30 opacity-0 transition-opacity group-hover/img:opacity-100 backdrop-blur-xs">
                              <div className="rounded-lg bg-white/90 p-1.5 text-slate-700 shadow-sm">
                                <ZoomIn size={14} />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Sub Warden Remarks */}
                        {complaint.subWardenRemarks && (
                          <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
                            <p className="text-[11px] font-bold text-indigo-700">Sub Warden Remarks:</p>
                            <p className="mt-0.5 text-[11px] font-medium text-indigo-600">{complaint.subWardenRemarks}</p>
                          </div>
                        )}

                        {/* Maintenance Remarks */}
                        {complaint.maintenanceRemarks && (
                          <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                            <p className="text-[11px] font-bold text-emerald-700">Maintenance Remarks:</p>
                            <p className="mt-0.5 text-[11px] font-medium text-emerald-600">{complaint.maintenanceRemarks}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <span className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${st.color}`}>
                      <StatusIcon size={12} />
                      {st.label}
                    </span>
                  </div>

                  {/* Card Meta Footer */}
                  <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-[11px] font-semibold text-slate-400">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Tag size={12} className="text-indigo-500" />
                      {complaint.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays size={12} />
                      {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : "—"}
                    </span>
                    {complaint.roomNumber && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin size={12} className="text-slate-400" />
                        {complaint.hostelName} · Room {complaint.roomNumber}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="rounded-2xl border border-slate-200/70 bg-white p-12 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <MessageSquareWarning size={22} />
                </div>
                <p className="text-sm font-bold text-slate-700">No complaints found</p>
                <p className="mt-1 text-xs text-slate-400">Try switching your filter status or submit a new complaint.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Lightbox Modal ── */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-h-[85vh] max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute -right-3 -top-3 z-10 rounded-full bg-white p-2 text-slate-700 shadow-xl transition-transform hover:scale-110 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
            <img
              src={lightboxUrl}
              alt="Incident photo (full size)"
              className="h-auto max-h-[85vh] w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}