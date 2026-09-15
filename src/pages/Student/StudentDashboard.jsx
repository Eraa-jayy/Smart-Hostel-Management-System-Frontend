import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  DoorOpen,
  Wrench,
  Megaphone,
  Bell,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  CalendarDays,
  FileWarning,
  ChevronRight,
  UtensilsCrossed,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { getMyRoomDetails } from "../../service/studentAllocationService";
import api from "../../service/axios";

/* ── Navigation Shortcuts ── */
const ACTIONS = [
  { label: "File Complaint", icon: FileWarning, path: "/student/complaints", color: "text-rose-600 bg-rose-500/10 border-rose-200/50 hover:bg-rose-500 hover:text-white" },
  { label: "View Canteen", icon: UtensilsCrossed, path: "/student/canteen", color: "text-amber-600 bg-amber-500/10 border-amber-200/50 hover:bg-amber-500 hover:text-white" },
  { label: "Make Payment", icon: CreditCard, path: "/student/payments", color: "text-blue-600 bg-blue-500/10 border-blue-200/50 hover:bg-blue-500 hover:text-white" },
  { label: "Announcements", icon: Megaphone, path: "/student/notifications", color: "text-violet-600 bg-violet-500/10 border-violet-200/50 hover:bg-violet-500 hover:text-white" },
];

export default function StudentDashboard() {
  const [roomData, setRoomData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const roomRes = await getMyRoomDetails();
      setRoomData(roomRes.data);

      // Connect API services:
      const announcementsRes = await api.get("/announcements");
      setAnnouncements(announcementsRes.data);

      setRecentActivity([]);
      setRecentPayments([]);
      setFacilities([]);
      setPendingRequestsCount(0);
    } catch (err) {
      console.error("Dashboard data load error:", err);
      setError("No active room allocation found.");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const studentName = roomData?.fullName || "Student";
  const totalCount = announcements.length;
  const unreadCount = announcements.filter((a) => !a.read).length;

  const STATS = [
    {
      label: "Hostel Name",
      value: roomData?.hostelName || "—",
      sub: roomData?.buildingName || "Building Block",
      icon: Building2,
      accent: "from-blue-500 to-indigo-600",
      lightBg: "bg-blue-50/80 text-blue-600",
      change: roomData ? "Assigned" : "N/A",
      up: true,
    },
    {
      label: "Allocated Room",
      value: roomData?.roomNumber || "—",
      sub: roomData?.floorName || "Floor Details",
      icon: DoorOpen,
      accent: "from-emerald-500 to-teal-600",
      lightBg: "bg-emerald-50/80 text-emerald-600",
      change: roomData ? "Active" : "N/A",
      up: true,
    },
    {
      label: "Pending Requests",
      value: pendingRequestsCount.toString(),
      sub: "Active Complaints",
      icon: Wrench,
      accent: "from-amber-500 to-orange-600",
      lightBg: "bg-amber-50/80 text-amber-600",
      change: `${pendingRequestsCount} Open`,
      up: true,
    },
    {
      label: "Total Notices",
      value: totalCount.toString(),
      sub: totalCount > 0 ? "Live on Portal" : "No Notices Yet",
      icon: Megaphone,
      accent: "from-sky-500 to-blue-600",
      lightBg: "bg-sky-50/80 text-sky-600",
      change: `${totalCount} Posted`,
      up: true,
    },
    {
      label: "Unread Notices",
      value: unreadCount.toString(),
      sub: "Hostel Circulars",
      icon: Bell,
      accent: "from-violet-500 to-purple-600",
      lightBg: "bg-violet-50/80 text-violet-600",
      change: unreadCount > 0 ? "New" : "0 New",
      up: true,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ── Welcome Banner ── */}
      <div className="w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 text-white shadow-2xl shadow-indigo-950/20 sm:p-8 lg:p-10">
          <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1 text-xs font-semibold tracking-wide text-blue-200 backdrop-blur-md">
                <Sparkles size={13} className="text-blue-300" />
                Student Portal Dashboard
              </span>

              <h1 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                Welcome back, <span className="bg-gradient-to-r from-blue-200 via-indigo-100 to-white bg-clip-text text-transparent">{studentName}</span>! 👋
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
                Monitor your room allocation status, check active services, process campus utility payments, and handle complaints seamlessly.
              </p>
            </div>

          </div>

          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-20 h-56 w-56 rounded-full bg-indigo-500/25 blur-3xl" />
        </div>
      </div>

      {/* ── Sub-header Meta Bar ── */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-slate-800">Dashboard Overview</h2>
          <p className="text-xs text-slate-400">Real-time status of your hostel ecosystem</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
          <CalendarDays size={14} className="text-indigo-600" />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>

      {/* ── Key Metrics Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {STATS.map(({ label, value, sub, icon: Icon, accent, lightBg, change, up }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60"
          >
            <div className="flex items-start justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${lightBg} transition-all duration-300 group-hover:scale-110`}>
                <Icon size={22} strokeWidth={2.2} />
              </div>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                up ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50" : "bg-rose-50 text-rose-500 border border-rose-200/50"
              }`}>
                {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {change}
              </span>
            </div>
            
            <div className="mt-4">
              <p className="text-2xl font-black tracking-tight text-slate-900">{value}</p>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
            </div>
            
            <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${accent}`} />
              {sub}
            </p>

            <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
          </div>
        ))}
      </div>

      {/* ── Middle Grid Layout ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">Quick Actions</h3>
            <span className="text-xs font-medium text-slate-400">Shortcuts</span>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            {ACTIONS.map(({ label, icon: Icon, path, color }) => (
              <Link
                key={label}
                to={path}
                className={`group flex flex-col items-center gap-3 rounded-2xl border p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${color}`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110">
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <span className="text-xs font-bold leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Room Details Card */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">Room Allocation</h3>
            {roomData && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {roomData.status}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <RefreshCw size={20} className="animate-spin text-indigo-600" />
              <p className="mt-3 text-xs font-medium text-slate-400">Fetching room info...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-6 text-center">
              <p className="text-xs font-semibold text-rose-600">{error}</p>
            </div>
          ) : roomData ? (
            <div className="divide-y divide-slate-100">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-xs font-medium text-slate-400">Hostel Name</span>
                <span className="text-xs font-bold text-slate-700">{roomData.hostelName}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-xs font-medium text-slate-400">Building Block</span>
                <span className="text-xs font-bold text-slate-700">{roomData.buildingName}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-xs font-medium text-slate-400">Room Number</span>
                <span className="text-xs font-bold text-indigo-600">{roomData.roomNumber}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-xs font-medium text-slate-400">Floor</span>
                <span className="text-xs font-bold text-slate-700">{roomData.floorName}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-xs font-medium text-slate-400">Capacity</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                  {roomData.currentOccupancy} / {roomData.roomCapacity} Occupied
                </span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-xs font-medium text-slate-400">Roommates</span>
                <div className="flex -space-x-2">
                  {roomData.roommateNames?.length > 0 ? (
                    roomData.roommateNames.map((name, i) => (
                      <div
                        key={i}
                        title={name}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-bold text-white shadow-sm"
                      >
                        {getInitials(name)}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No roommates</span>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Facilities Card */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">Facilities Live Status</h3>
            <span className="text-xs font-semibold text-emerald-600">Operational</span>
          </div>
          
          <div className="space-y-3">
            {facilities.length > 0 ? (
              facilities.map(({ label, available }) => (
                <div key={label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <span className="text-xs font-bold text-slate-700">{label}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${available ? "bg-emerald-100/70 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    {available ? "Active" : "Issue"}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center">
                <p className="text-xs text-slate-400">Facility updates will appear here.</p>
              </div>
            )}
          </div>

          <div className="mt-5 rounded-xl border border-indigo-100 bg-gradient-to-br from-blue-50/60 via-indigo-50/30 to-purple-50/40 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-indigo-600" />
              <span className="text-xs font-bold text-indigo-950">System Status Normal</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-indigo-700/80">
              All infrastructure services are monitored 24/7. Report any disruption immediately.
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom Grid Streams ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">Recent Activity</h3>
            <Link to="/student/notifications" className="flex items-center gap-0.5 text-xs font-bold text-indigo-600 hover:text-indigo-700">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map(({ text, time }, i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-blue-100 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold leading-relaxed text-slate-700">{text}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock size={11} />
                      <span>{time}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-xs text-slate-400">No recent activity logged.</p>
              </div>
            )}
          </div>
        </div>

        {/* Payments Overview */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">Payment Overview</h3>
            <Link to="/student/payments" className="flex items-center gap-0.5 text-xs font-bold text-indigo-600 hover:text-indigo-700">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentPayments.length > 0 ? (
              recentPayments.map(({ name, amount, due, status }) => (
                <div key={name} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-800">{name}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">Due: {due}</p>
                  </div>
                  <div className="ml-3 text-right">
                    <p className="text-xs font-black text-slate-900">{amount}</p>
                    <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      status === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-xs text-slate-400">No payment records found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Announcements */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">Latest Announcements</h3>
            <Link to="/student/notifications" className="flex items-center gap-0.5 text-xs font-bold text-indigo-600 hover:text-indigo-700">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {announcements.length > 0 ? (
              announcements.slice(0, 4).map((announcement) => {
                const date = announcement.createdAt
                  ? new Date(announcement.createdAt).toLocaleDateString()
                  : "N/A";
                const category = announcement.category || "General";
                return (
                  <div
                    key={announcement.id}
                    className="group flex items-center justify-between rounded-xl border border-slate-100 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
                  >
                    <div className="flex min-w-0 items-start gap-2.5 pr-3 flex-1">
                      {!announcement.read && (
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-violet-500" />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="inline-block rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-700">
                          {category}
                        </span>
                        <p className="mt-1.5 line-clamp-1 text-xs font-bold text-slate-800 transition-colors group-hover:text-indigo-600">
                          {announcement.title}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">{date}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="flex-shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-indigo-500" />
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center">
                <p className="text-xs text-slate-400">No announcements posted.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}