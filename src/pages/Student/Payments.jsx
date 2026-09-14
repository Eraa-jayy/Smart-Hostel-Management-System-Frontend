import React, { useState, useEffect, useRef } from "react";
import {
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  TrendingUp,
  TrendingDown,
  Download,
  Receipt,
  CalendarDays,
  Sparkles,
  FileCheck,
  RefreshCw,
  X,
} from "lucide-react";

const STATUS_CONFIG = {
  VERIFIED: { label: "Verified", color: "bg-emerald-50 text-emerald-700 border-emerald-200/60", icon: CheckCircle2 },
  UPLOADED: { label: "Uploaded", color: "bg-blue-50 text-blue-700 border-blue-200/60", icon: Upload },
  PENDING: { label: "Pending", color: "bg-amber-50 text-amber-700 border-amber-200/60", icon: Clock },
  OVERDUE: { label: "Overdue", color: "bg-rose-50 text-rose-700 border-rose-200/60", icon: AlertCircle },
};

export default function Payments() {
  const [currentPayment, setCurrentPayment] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Upload state
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const fetchPaymentsData = async () => {
    setLoading(true);
    setError("");
    try {
      // TODO: Replace with your actual service endpoint calls
      // e.g., const currentRes = await getMyCurrentDue();
      // e.g., const historyRes = await getMyPaymentHistory();
      // setCurrentPayment(currentRes.data);
      // setPaymentHistory(historyRes.data || []);
      
      setCurrentPayment(null);
      setPaymentHistory([]);
    } catch (err) {
      console.error("Error fetching payments data:", err);
      setError("Failed to load payment details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Summary calculations based on real fetched data
  const totalPaid = paymentHistory
    .filter((p) => p.status === "VERIFIED")
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const totalDue = currentPayment ? Number(currentPayment.amount) || 0 : 0;

  const handleFileSelect = (file) => {
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or image file (JPEG, PNG).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5 MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadSlip = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    setSubmitting(true);
    try {
      // TODO: Replace with your service API call, e.g., uploadPaymentSlip(selectedFile)
      setSuccessMsg("Payment slip uploaded successfully! Awaiting verification.");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchPaymentsData();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload payment slip.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Hero Banner ── */}
      <div className="w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 text-white shadow-2xl shadow-indigo-950/20 sm:p-8 lg:p-10">
          <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1 text-xs font-semibold tracking-wide text-blue-200 backdrop-blur-md">
                <Sparkles size={13} className="text-blue-300" />
                Financial Management
              </span>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                Hostel Payments
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Track your active dues, upload payment confirmation slips, and review past transactions in real-time.
              </p>
            </div>

          </div>

          {/* Background Glow Overlay */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-20 h-56 w-56 rounded-full bg-indigo-500/25 blur-3xl" />
        </div>
      </div>

      {/* ── Notifications ── */}
      {successMsg && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-xs font-bold text-emerald-700 shadow-sm">
          {successMsg}
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-xs font-bold text-rose-700 shadow-sm">
          {error}
        </div>
      )}

      {/* ── Sub-header Meta Bar ── */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-slate-800">Financial Summary</h2>
          <p className="text-xs text-slate-400">Overview of paid and upcoming fees</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
          <CalendarDays size={14} className="text-indigo-600" />
          <span>{new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>

      {/* ── Dynamic Summary Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50/80 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
              <TrendingUp size={22} strokeWidth={2.2} />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
              Verified
            </span>
          </div>

          <div className="mt-4">
            <p className="text-2xl font-black tracking-tight text-slate-900">
              LKR {totalPaid.toLocaleString()}
            </p>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Total Paid</p>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50/80 text-rose-600 transition-transform duration-300 group-hover:scale-110">
              <TrendingDown size={22} strokeWidth={2.2} />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-200/60 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-500">
              Active Dues
            </span>
          </div>

          <div className="mt-4">
            <p className="text-2xl font-black tracking-tight text-slate-900">
              LKR {totalDue.toLocaleString()}
            </p>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Total Outstanding</p>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-rose-500 to-red-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </div>

      {/* ── Main 2-Column Grid Layout ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        
        {/* Left Column: Current Due & Upload Slip (Span 2) */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Current Due Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                    <CreditCard size={22} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-black tracking-tight text-white">Current Payment</h2>
                    <p className="text-xs text-blue-100/80">
                      {currentPayment?.daysLeft ? `Due in ${currentPayment.daysLeft} days` : "Active Fee Record"}
                    </p>
                  </div>
                </div>
                {currentPayment && (
                  <span className="rounded-full border border-white/20 bg-white/20 px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wide backdrop-blur-md">
                    {currentPayment.status || "UNPAID"}
                  </span>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <RefreshCw size={20} className="animate-spin text-indigo-600" />
                <p className="mt-2 text-xs font-semibold text-slate-400">Loading payment details...</p>
              </div>
            ) : currentPayment ? (
              <div className="divide-y divide-slate-100 p-6">
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs font-semibold text-slate-400">Payment Type</span>
                  <span className="text-xs font-bold text-slate-700">{currentPayment.type}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs font-semibold text-slate-400">Academic Term</span>
                  <span className="text-xs font-bold text-slate-700">{currentPayment.semester}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs font-semibold text-slate-400">Amount Payable</span>
                  <span className="text-sm font-black text-slate-900">LKR {Number(currentPayment.amount).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs font-semibold text-slate-400">Due Date</span>
                  <span className="text-xs font-bold text-slate-700">{currentPayment.dueDate}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs font-semibold text-slate-400">Reference ID</span>
                  <span className="font-mono text-xs font-bold text-slate-500">{currentPayment.reference}</span>
                </div>

                <div className="pt-4">
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-blue-700 hover:to-indigo-700">
                    <CreditCard size={15} />
                    Proceed to Payment Gateway
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-xs font-bold text-slate-700">No Pending Payments</p>
                <p className="mt-1 text-[11px] text-slate-400">You have settled all current hostel fee dues.</p>
              </div>
            )}
          </div>

          {/* Upload Payment Slip */}
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                <Upload size={18} strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Submit Payment Slip</h2>
                <p className="text-xs text-slate-400">Upload receipt for manual verification</p>
              </div>
            </div>

            {!selectedFile ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
                  dragOver
                    ? "border-indigo-500 bg-indigo-50/60 scale-[1.01]"
                    : "border-slate-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/20 cursor-pointer"
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                  dragOver ? "bg-indigo-100 text-indigo-600" : "bg-white text-slate-400 shadow-sm group-hover:text-indigo-500"
                }`}>
                  <FileCheck size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">
                    {dragOver ? "Drop your slip here" : "Drag & drop slip or click to browse"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">PDF, JPG, PNG up to 5MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
                />
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileCheck size={18} className="text-indigo-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-800">{selectedFile.name}</p>
                      <p className="text-[10px] text-slate-400">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleUploadSlip}
              disabled={submitting || !selectedFile}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={14} />
                  Upload Slip Confirmation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Payment History (Span 3) */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Receipt size={18} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">Payment History</h2>
                    <p className="text-xs text-slate-400">Past transactions and slip uploads</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <RefreshCw size={20} className="animate-spin text-indigo-600" />
                  <p className="mt-2 text-xs font-semibold text-slate-400">Loading payment history...</p>
                </div>
              ) : paymentHistory.length > 0 ? (
                paymentHistory.map(({ id, name, amount, date, status, receiptUrl }) => {
                  const st = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
                  const StatusIcon = st.icon;

                  return (
                    <div key={id} className="group flex items-center justify-between p-4 transition-colors hover:bg-slate-50/70">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${st.color} flex-shrink-0`}>
                          <StatusIcon size={18} strokeWidth={2.2} />
                        </div>
                        
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {name}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">#{id}</span>
                            <span>•</span>
                            <span>{date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0 ml-3">
                        <div className="text-right">
                          <p className="text-sm font-black text-slate-900">LKR {Number(amount).toLocaleString()}</p>
                          <span className={`mt-0.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${st.color}`}>
                            {st.label}
                          </span>
                        </div>

                        {receiptUrl && (
                          <a
                            href={receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Download Receipt"
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-all hover:border-slate-300 hover:bg-white hover:text-slate-700 shadow-xs"
                          >
                            <Download size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <Receipt size={22} />
                  </div>
                  <p className="text-sm font-bold text-slate-700">No Payment History Found</p>
                  <p className="mt-1 text-xs text-slate-400">Past payment receipts and uploaded slips will appear here.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}