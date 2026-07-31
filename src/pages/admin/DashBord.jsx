import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserX,
  GraduationCap,
  CalendarDays,
  UserPlus,
  Shield,
  Building2,
  ClipboardList,
  UserCog,
  Activity,
  UserCircle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import { getAllUsers } from "../../service/adminService";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.enabled).length;
  const disabledUsers = users.filter((u) => !u.enabled).length;
  const studentUsers = users.filter((u) => u.role === "STUDENT").length;

  const roleCounts = {};
  users.forEach((u) => {
    roleCounts[u.role] = (roleCounts[u.role] || 0) + 1;
  });

  const roleDistribution = [
    { role: "ADMIN", count: roleCounts["ADMIN"] || 0, color: "bg-blue-500", textColor: "text-blue-600", bgColor: "bg-blue-50" },
    { role: "STUDENT_AFFAIRS", count: roleCounts["STUDENT_AFFAIRS"] || 0, color: "bg-emerald-500", textColor: "text-emerald-600", bgColor: "bg-emerald-50" },
    { role: "WARDEN", count: roleCounts["WARDEN"] || 0, color: "bg-amber-500", textColor: "text-amber-600", bgColor: "bg-amber-50" },
    { role: "SUBWARDEN", count: roleCounts["SUBWARDEN"] || 0, color: "bg-violet-500", textColor: "text-violet-600", bgColor: "bg-violet-50" },
    { role: "STUDENT", count: roleCounts["STUDENT"] || 0, color: "bg-rose-500", textColor: "text-rose-600", bgColor: "bg-rose-50" },
  ];

  const studentAffairsUsers = users.filter((u) => u.role === "STUDENT_AFFAIRS");
  const activeStudentAffairs = studentAffairsUsers.filter((u) => u.enabled).length;

  const recentUsers = [...users].reverse().slice(0, 5);

  const adminActions = users
    .filter((u) => u.role === "ADMIN")
    .slice(0, 3)
    .map((u) => ({
      text: `Account: ${u.username}`,
      status: u.enabled ? "Active" : "Disabled",
      type: u.enabled ? "success" : "warning",
    }));

  const STATS = [
    { label: "Total Users", value: totalUsers, icon: Users, bg: "bg-blue-50", iconColor: "text-blue-600", change: "All time", up: true },
    { label: "Active Users", value: activeUsers, icon: UserCheck, bg: "bg-emerald-50", iconColor: "text-emerald-600", change: "Active", up: true },
    { label: "Disabled Users", value: disabledUsers, icon: UserX, bg: "bg-red-50", iconColor: "text-red-600", change: "Inactive", up: false },
    { label: "Student Accounts", value: studentUsers, icon: GraduationCap, bg: "bg-violet-50", iconColor: "text-violet-600", change: "Enrolled", up: true },
  ];

  const quickActions = [
    { label: "Create User", icon: UserPlus, path: "/admin/users/create", color: "bg-blue-50 text-blue-600" },
    { label: "View Users", icon: Users, path: "/admin/users", color: "bg-emerald-50 text-emerald-600" },
    { label: "Manage Roles", icon: UserCog, path: "/admin/roles", color: "bg-amber-50 text-amber-600" },
    { label: "Student Affairs", icon: Building2, path: "/admin/student-affairs", color: "bg-violet-50 text-violet-600" },
  ];

  if (loading) {
    return <div className="text-center text-gray-400 p-10">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Overview of system activity and user management
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <CalendarDays size={14} />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Row: Quick Actions + Role Management Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ label, icon: Icon, path, color }) => (
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

        {/* Role Management Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Role Management Overview</h3>
            <Link to="/admin/roles" className="text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors">
              View Details
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {roleDistribution.map(({ role, count, color, textColor, bgColor }) => (
              <Link
                key={role}
                to={`/admin/users?role=${role}`}
                className="group p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 text-center"
              >
                <div className={`w-3 h-3 rounded-full ${color} mx-auto mb-2`} />
                <p className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{count}</p>
                <p className="text-[11px] font-medium text-gray-400 mt-0.5 truncate">{role.replace(/_/g, " ")}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Row: Recent Users + User Activity Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Recent Users</h3>
            <Link to="/admin/users" className="text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors">
              View All
            </Link>
          </div>
          <div className="space-y-1">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[11px] font-bold text-gray-500">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{user.username}</p>
                    <p className="text-xs text-gray-400">{user.role}</p>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    user.enabled ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  }`}
                >
                  {user.enabled ? "Active" : "Disabled"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity Monitoring */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">User Activity Monitoring</h3>
            <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
              <Activity size={12} />
              Live
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100/50">
              <p className="text-xs text-blue-500 mb-1">Total Accounts</p>
              <p className="text-lg font-bold text-gray-900">{totalUsers}</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100/50">
              <p className="text-xs text-emerald-500 mb-1">Active Accounts</p>
              <p className="text-lg font-bold text-gray-900">{activeUsers}</p>
            </div>
            <div className="p-4 rounded-xl bg-red-50/60 border border-red-100/50">
              <p className="text-xs text-red-500 mb-1">Disabled Accounts</p>
              <p className="text-lg font-bold text-gray-900">{disabledUsers}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Account Activity</p>
            <div className="space-y-1">
              {recentUsers.map((user, i) => (
                <div key={user.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className={`w-2 h-2 rounded-full ${user.enabled ? "bg-emerald-400" : "bg-red-400"}`} />
                  <p className="text-[13px] text-gray-600 flex-1">
                    <span className="font-medium text-gray-800">{user.username}</span>{" "}
                    account is <span className={user.enabled ? "text-emerald-600" : "text-red-600"}>{user.enabled ? "active" : "disabled"}</span>
                  </p>
                  <span className="text-xs text-gray-400">{user.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Student Affairs Overview + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Student Affairs Account Management Overview */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Student Affairs Accounts</h3>
            <Link to="/admin/student-affairs" className="text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors">
              Manage
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center">
              <Building2 size={24} className="text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{studentAffairsUsers.length}</p>
              <p className="text-xs text-gray-400">
                {activeStudentAffairs} active · {studentAffairsUsers.length - activeStudentAffairs} disabled
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {studentAffairsUsers.slice(0, 3).map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <UserCircle size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{user.username}</span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${user.enabled ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                  {user.enabled ? "Active" : "Disabled"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">System Status</h3>
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              All Systems Online
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-50/80">
              <p className="text-xs text-gray-400 mb-1">User Accounts</p>
              <p className="text-lg font-bold text-gray-900">{totalUsers}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50/80">
              <p className="text-xs text-gray-400 mb-1">Active Sessions</p>
              <p className="text-lg font-bold text-gray-900">{activeUsers}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50/80">
              <p className="text-xs text-gray-400 mb-1">Active Roles</p>
              <p className="text-lg font-bold text-gray-900">{new Set(users.map((u) => u.role)).size}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50/80">
              <p className="text-xs text-gray-400 mb-1">Admin Accounts</p>
              <p className="text-lg font-bold text-gray-900">{roleCounts["ADMIN"] || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
