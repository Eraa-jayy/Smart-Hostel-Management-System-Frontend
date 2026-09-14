import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserX,
  GraduationCap,
  CalendarDays,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import DashboardCard from "../../components/studentAffairs/DashboardCard";
import { getAllUsers } from "../../service/adminService";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const roleCounts = users.reduce((counts, user) => {
    counts[user.role] = (counts[user.role] || 0) + 1;
    return counts;
  }, {});

  const roleDistribution = [
    { role: "ADMIN", color: "bg-blue-500", label: "Administrators" },
    { role: "STUDENT_AFFAIRS", color: "bg-emerald-500", label: "Student Affairs" },
    { role: "SUBWARDEN", color: "bg-violet-500", label: "Sub-Wardens" },
    { role: "STUDENT", color: "bg-rose-500", label: "Students" },
  ];

  const stats = [
    {
      title: "Total Accounts",
      value: users.length,
      sub: "Registered system users",
      icon: Users,
      accent: "from-blue-500 to-indigo-600",
      lightBg: "bg-blue-50 text-blue-600",
      change: "All time",
    },
    {
      title: "Active Accounts",
      value: users.filter((u) => u.enabled).length,
      sub: "Enabled login credentials",
      icon: UserCheck,
      accent: "from-emerald-500 to-teal-600",
      lightBg: "bg-emerald-50 text-emerald-600",
      change: "Active",
    },
    {
      title: "Disabled Accounts",
      value: users.filter((u) => !u.enabled).length,
      sub: "Suspended or deactivated",
      icon: UserX,
      accent: "from-rose-500 to-red-600",
      lightBg: "bg-rose-50 text-rose-600",
      change: "Inactive",
    },
    {
      title: "Student Accounts",
      value: roleCounts.STUDENT || 0,
      sub: "Enrolled hostel residents",
      icon: GraduationCap,
      accent: "from-purple-500 to-violet-600",
      lightBg: "bg-purple-50 text-purple-600",
      change: "Enrolled",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Hero Banner ── */}
      <div className="w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 text-white shadow-2xl shadow-indigo-950/20 sm:p-8 lg:p-10">
          <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1 text-xs font-semibold tracking-wide text-blue-200 backdrop-blur-md">
                <Sparkles size={13} className="text-blue-300" />
                System Overview & Management
              </span>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                Administrator Dashboard
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
                Monitor user accounts, manage security access levels, and review system-wide role distribution.
              </p>
            </div>

            {/* <button
              onClick={loadUsers}
              className="flex items-center gap-2 self-start rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:shadow-lg sm:self-auto"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh Analytics
            </button> */}
          </div>

          {/* Ambient Lighting & Glassmorphism Overlay */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-20 h-56 w-56 rounded-full bg-indigo-500/25 blur-3xl" />
        </div>
      </div>

      {/* ── Sub-header Meta Bar ── */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-slate-800">System Activity</h2>
          <p className="text-xs text-slate-400">Live summary of administrative metric counters</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
          <CalendarDays size={14} className="text-indigo-600" />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>

      {/* ── Metric Summary Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* ── Role Management Distribution Grid ── */}
      <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Role Management Overview</h3>
              <p className="text-xs text-slate-400">Distribution of permission tiers across registered users</p>
            </div>
          </div>
          <Link
            to="/admin/roles"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-indigo-600 transition-colors hover:bg-slate-200"
          >
            <span>View Details</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {roleDistribution.map(({ role, color, label }) => (
            <Link
              key={role}
              to={`/admin/users?role=${role}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50/50 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg"
            >
              <div className={`mx-auto mb-2.5 h-3 w-3 rounded-full ${color} shadow-sm`} />
              <p className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                {roleCounts[role] || 0}
              </p>
              <p className="mt-1 truncate text-xs font-bold text-slate-500">
                {label}
              </p>
              <p className="mt-0.5 font-mono text-[10px] font-semibold text-slate-400">
                {role}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}