import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  DoorOpen,
  Wrench,
  Megaphone,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  CalendarDays,
  IndianRupee,
  FileWarning,
  ChevronRight,
  UtensilsCrossed,
  Wifi,
  Zap,
  Droplets,
} from "lucide-react";

/* ── Stat Cards ── */
const STATS = [
  {
    label: "Hostel",
    value: "Block A",
    sub: "Royal University",
    icon: Building2,
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    change: "+2%",
    up: true,
  },
  {
    label: "Room No.",
    value: "A-204",
    sub: "Triple Sharing",
    icon: DoorOpen,
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    change: "Assigned",
    up: true,
  },
  {
    label: "Pending Requests",
    value: "2",
    sub: "1 urgent",
    icon: Wrench,
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    change: "-12%",
    up: false,
  },
  {
    label: "Unread Notices",
    value: "5",
    sub: "2 new today",
    icon: Megaphone,
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
    change: "+3",
    up: true,
  },
];

/* ── Quick Actions ── */
const ACTIONS = [
  { label: "File Complaint", icon: FileWarning, path: "/student/complaints", color: "bg-red-50 text-red-600" },
  { label: "View Canteen", icon: UtensilsCrossed, path: "/student/canteen", color: "bg-orange-50 text-orange-600" },
  { label: "Make Payment", icon: CreditCard, path: "/student/payments", color: "bg-blue-50 text-blue-600" },
  { label: "Announcements", icon: Megaphone, path: "/student/notifications", color: "bg-violet-50 text-violet-600" },
];

/* ── Recent Activity ── */
const ACTIVITY = [
  { text: "Payment of ₹8,500 received", time: "2 hours ago", type: "success" },
  { text: "Complaint #1042 resolved", time: "5 hours ago", type: "success" },
  { text: "New announcement: Mid-term exam schedule", time: "Yesterday", type: "info" },
  { text: "Maintenance request pending review", time: "2 days ago", type: "warning" },
  { text: "Room inspection scheduled for Friday", time: "3 days ago", type: "info" },
];

/* ── Upcoming Payments ── */
const PAYMENTS = [
  { name: "Hostel Fee - Jan 2026", amount: "₹8,500", due: "Jan 15, 2026", status: "paid" },
  { name: "Mess Fee - Jan 2026", amount: "₹3,200", due: "Jan 20, 2026", status: "pending" },
  { name: "Hostel Fee - Feb 2026", amount: "₹8,500", due: "Feb 15, 2026", status: "upcoming" },
];

/* ── Announcements ── */
const ANNOUNCEMENTS = [
  { title: "Mid-term Exam Schedule Released", date: "Jan 12, 2026", tag: "Academic", color: "bg-blue-500" },
  { title: "Hostel Fee Deadline Extended", date: "Jan 10, 2026", tag: "Finance", color: "bg-amber-500" },
  { title: "Annual Sports Day - Jan 25", date: "Jan 8, 2026", tag: "Events", color: "bg-emerald-500" },
];

/* ── Facilities ── */
const FACILITIES = [
  { label: "Wi-Fi", icon: Wifi, available: true },
  { label: "Power Backup", icon: Zap, available: true },
  { label: "Water Supply", icon: Droplets, available: true },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Overview of your hostel activity and status
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <CalendarDays size={14} />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, sub, icon: Icon, bg, iconColor, change, up }) => (
          <div
            key={label}
            className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
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
            <p className="text-[11px] text-gray-400 mt-2">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Middle Row: Quick Actions + Room Info + Facilities ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {ACTIONS.map(({ label, icon: Icon, path, color }) => (
              <Link
                key={label}
                to={path}
                className="group flex flex-col items-center gap-2.5 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                  <Icon size={18} strokeWidth={2} />
                </div>
                <span className="text-xs font-medium text-gray-600">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Room Details */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Room Details</h3>
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-xs text-gray-400">Hostel</span>
              <span className="text-sm font-medium text-gray-700">Block A — Royal University</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-xs text-gray-400">Room</span>
              <span className="text-sm font-medium text-gray-700">A-204</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-xs text-gray-400">Type</span>
              <span className="text-sm font-medium text-gray-700">Triple Sharing</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-xs text-gray-400">Floor</span>
              <span className="text-sm font-medium text-gray-700">2nd Floor</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-gray-400">Roommates</span>
              <div className="flex -space-x-2">
                {["AB", "CD", "EF"].map((init, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">
                    {init}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Facilities Status</h3>
          <div className="space-y-3">
            {FACILITIES.map(({ label, icon: Icon, available }) => (
              <div key={label} className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50/80">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${available ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"}`}>
                    <Icon size={16} strokeWidth={2} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${available ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                  {available ? "Available" : "Down"}
                </span>
              </div>
            ))}
          </div>

          {/* Roommates info */}
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-100/50">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={14} className="text-blue-600" />
              <span className="text-xs font-semibold text-blue-800">All Systems Normal</span>
            </div>
            <p className="text-[11px] text-blue-600/70">
              All hostel facilities are operational. Report issues via complaints.
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Activity + Payments + Announcements ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Recent Activity</h3>
            <Link to="/student/notifications" className="text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors">
              View All
            </Link>
          </div>
          <div className="space-y-1">
            {ACTIVITY.map(({ text, time, type }, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 group">
                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  type === "success" ? "bg-emerald-400" : type === "warning" ? "bg-amber-400" : "bg-blue-400"
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-gray-600 leading-snug">{text}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={10} className="text-gray-300" />
                    <span className="text-[11px] text-gray-300">{time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Payment Overview</h3>
            <Link to="/student/payments" className="text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors">
              View All
            </Link>
          </div>

          {/* Summary bar */}
          <div className="flex items-center gap-4 mb-5 p-3.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-100">
            <div className="flex-1">
              <p className="text-[11px] text-gray-400 mb-0.5">Total Paid</p>
              <p className="text-lg font-bold text-gray-900">₹8,500</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="flex-1">
              <p className="text-[11px] text-gray-400 mb-0.5">Remaining</p>
              <p className="text-lg font-bold text-amber-600">₹11,700</p>
            </div>
          </div>

          {/* Payment list */}
          <div className="space-y-2.5">
            {PAYMENTS.map(({ name, amount, due, status }) => (
              <div key={name} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-gray-700 truncate">{name}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Due: {due}</p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <span className="text-[13px] font-semibold text-gray-800">{amount}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    status === "paid"
                      ? "bg-emerald-50 text-emerald-600"
                      : status === "pending"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {status === "paid" ? "Paid" : status === "pending" ? "Due" : "Upcoming"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Latest Announcements</h3>
            <Link to="/student/notifications" className="text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {ANNOUNCEMENTS.map(({ title, date, tag, color }) => (
              <div key={title} className="group p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={`w-1 h-full min-h-[40px] rounded-full ${color} flex-shrink-0`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-gray-800 leading-snug group-hover:text-blue-600 transition-colors">
                      {title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${color}/10 ${
                        tag === "Academic" ? "text-blue-600" : tag === "Finance" ? "text-amber-600" : "text-emerald-600"
                      }`} style={{ backgroundColor: `${color === "bg-blue-500" ? "#eff6ff" : color === "bg-amber-500" ? "#fffbeb" : "#ecfdf5"}` }}>
                        {tag}
                      </span>
                      <span className="text-[11px] text-gray-300">{date}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-400 transition-colors mt-0.5 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>

          {/* Alert banner */}
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50/80 border border-amber-100">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[12px] font-semibold text-amber-800">Fee Deadline Reminder</p>
                <p className="text-[11px] text-amber-600/70 mt-0.5">
                  Mess fee for January is due on Jan 20. Pay now to avoid late charges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
