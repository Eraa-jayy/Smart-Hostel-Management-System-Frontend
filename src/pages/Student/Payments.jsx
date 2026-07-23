import React, { useState } from "react";
import {
  IndianRupee,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Receipt,
  CalendarDays,
  ChevronRight,
} from "lucide-react";

const SUMMARY = [
  {
    label: "Total Paid",
    value: "23,500",
    icon: TrendingUp,
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    change: "2 verified",
    up: true,
  },
  {
    label: "Total Due",
    value: "11,700",
    icon: TrendingDown,
    color: "from-red-500 to-red-600",
    bg: "bg-red-50",
    iconColor: "text-red-600",
    change: "1 overdue",
    up: false,
  },
  {
    label: "Upcoming",
    value: "8,500",
    icon: Clock,
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    change: "Feb 15, 2026",
    up: true,
  },
];

const CURRENT_PAYMENT = {
  type: "Hostel Fee",
  semester: "Semester 2",
  amount: "10,000",
  dueDate: "30 July 2026",
  status: "unpaid",
  reference: "HST20260025",
  daysLeft: 16,
};

const PAYMENT_HISTORY = [
  { id: "PAY-001", name: "Hostel Fee — Semester 2", amount: "10,000", date: "Jul 5, 2026", status: "uploaded", receipt: true },
  { id: "PAY-002", name: "Mess Fee — January", amount: "3,200", date: "Jan 5, 2026", status: "verified", receipt: true },
  { id: "PAY-003", name: "Hostel Fee — Semester 1", amount: "8,500", date: "Aug 12, 2025", status: "verified", receipt: true },
  { id: "PAY-004", name: "Mess Fee — August", amount: "3,000", date: "Aug 5, 2025", status: "verified", receipt: true },
  { id: "PAY-005", name: "Security Deposit", amount: "5,000", date: "Jul 28, 2025", status: "verified", receipt: true },
];

const STATUS_CONFIG = {
  verified: { label: "Verified", color: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 },
  uploaded: { label: "Uploaded", color: "bg-blue-50 text-blue-600", icon: Upload },
  pending: { label: "Pending", color: "bg-amber-50 text-amber-600", icon: Clock },
  overdue: { label: "Overdue", color: "bg-red-50 text-red-600", icon: AlertCircle },
};

export default function Payments() {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage your hostel & mess fee payments
          </p>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SUMMARY.map(({ label, value, bg, iconColor, icon: Icon, change, up }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={20} className={iconColor} strokeWidth={2} />
              </div>
              <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
              }`}>
                {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Two Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column: Current Payment + Upload */}
        <div className="lg:col-span-2 space-y-4">
          {/* Current Payment */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-blue-500 to-indigo-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <CreditCard size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Current Payment</h2>
                    <p className="text-[11px] text-white/70">Due in {CURRENT_PAYMENT.daysLeft} days</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white">
                  {CURRENT_PAYMENT.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-3">
              {[
                { label: "Payment Type", value: CURRENT_PAYMENT.type },
                { label: "Semester", value: CURRENT_PAYMENT.semester },
                { label: "Amount", value: CURRENT_PAYMENT.amount },
                { label: "Due Date", value: CURRENT_PAYMENT.dueDate },
                { label: "Reference No", value: CURRENT_PAYMENT.reference },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-[12px] text-gray-400">{label}</span>
                  <span className="text-[13px] font-semibold text-gray-700">{value}</span>
                </div>
              ))}
            </div>

            <div className="px-5 pb-5">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all">
                <CreditCard size={16} />
                Pay Now
              </button>
            </div>
          </div>

          {/* Upload Slip */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                <Upload size={16} className="text-violet-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-800">Upload Payment Slip</h2>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${
                dragOver
                  ? "border-blue-400 bg-blue-50/50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Upload size={18} className="text-gray-400" />
              </div>
              <p className="text-[13px] font-medium text-gray-600">
                Drop your file here or <span className="text-blue-600">browse</span>
              </p>
              <p className="text-[11px] text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
            </div>

            <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-all">
              <Upload size={14} />
              Upload Slip
            </button>
          </div>
        </div>

        {/* Right column: Payment History */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Receipt size={16} className="text-gray-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-800">Payment History</h2>
                </div>
                <button className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-gray-600 transition-colors">
                  <Download size={12} />
                  Export
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {PAYMENT_HISTORY.map(({ id, name, amount, date, status, receipt }) => {
                const st = STATUS_CONFIG[status];
                const StatusIcon = st.icon;
                return (
                  <div key={id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors group">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          status === "verified" ? "bg-emerald-50" : status === "uploaded" ? "bg-blue-50" : "bg-amber-50"
                        }`}>
                          <StatusIcon size={16} className={st.color.split(" ")[1]} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-gray-800 truncate">{name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-mono text-gray-300">{id}</span>
                            <span className="text-[11px] text-gray-400">{date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-[14px] font-bold text-gray-900">{amount}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.color}`}>
                          {st.label}
                        </span>
                        {receipt && (
                          <button className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                            <Download size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
