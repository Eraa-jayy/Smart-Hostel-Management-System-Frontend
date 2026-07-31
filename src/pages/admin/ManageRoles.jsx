import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Shield,
  Users,
  Building2,
  GraduationCap,
  Swords,
  UserCog,
  ArrowRight,
} from "lucide-react";
import { getAllUsers } from "../../service/adminService";

const ROLE_CONFIG = [
  { role: "ADMIN", label: "Admin", icon: Shield, color: "bg-blue-500", textColor: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
  { role: "STUDENT_AFFAIRS", label: "Student Affairs", icon: Building2, color: "bg-emerald-500", textColor: "text-emerald-600", bgColor: "bg-emerald-50", borderColor: "border-emerald-200" },
  { role: "WARDEN", label: "Warden", icon: Swords, color: "bg-amber-500", textColor: "text-amber-600", bgColor: "bg-amber-50", borderColor: "border-amber-200" },
  { role: "SUBWARDEN", label: "Subwarden", icon: UserCog, color: "bg-violet-500", textColor: "text-violet-600", bgColor: "bg-violet-50", borderColor: "border-violet-200" },
  { role: "STUDENT", label: "Student", icon: GraduationCap, color: "bg-rose-500", textColor: "text-rose-600", bgColor: "bg-rose-50", borderColor: "border-rose-200" },
];

export default function ManageRoles() {
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

  const roleCounts = {};
  const roleActive = {};
  const roleDisabled = {};
  users.forEach((u) => {
    roleCounts[u.role] = (roleCounts[u.role] || 0) + 1;
    if (u.enabled) roleActive[u.role] = (roleActive[u.role] || 0) + 1;
    else roleDisabled[u.role] = (roleDisabled[u.role] || 0) + 1;
  });

  if (loading) {
    return <div className="text-center text-gray-400 p-10">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            View user distribution across all system roles
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <CalendarDays size={14} />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </div>

      {/* Role Distribution Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {ROLE_CONFIG.map(({ role, label, icon: Icon, color, textColor, bgColor, borderColor }) => {
          const total = roleCounts[role] || 0;
          const active = roleActive[role] || 0;
          const disabled = roleDisabled[role] || 0;
          return (
            <div key={role} className={`bg-white rounded-2xl border ${borderColor} p-5 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
                  <Icon size={22} className={textColor} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{label}</p>
                  <p className="text-[11px] text-gray-400">{role}</p>
                </div>
              </div>
              <div className="flex items-end justify-between mb-3">
                <p className="text-3xl font-bold text-gray-900">{total}</p>
                <div className="flex gap-2 text-xs">
                  <span className="text-emerald-600 font-semibold">{active} active</span>
                  {disabled > 0 && <span className="text-red-500 font-semibold">{disabled} disabled</span>}
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${color}`}
                  style={{ width: `${total > 0 ? (active / total) * 100 : 0}%` }}
                />
              </div>
              <Link
                to={`/admin/users?role=${role}`}
                className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <Users size={14} />
                View {label} Users
                <ArrowRight size={14} />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Role Distribution Summary</h3>
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Role</th>
                <th className="p-3 text-center font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Total</th>
                <th className="p-3 text-center font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Active</th>
                <th className="p-3 text-center font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Disabled</th>
                <th className="p-3 text-center font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Active %</th>
              </tr>
            </thead>
            <tbody>
              {ROLE_CONFIG.map(({ role, label, textColor }) => {
                const total = roleCounts[role] || 0;
                const active = roleActive[role] || 0;
                const disabled = roleDisabled[role] || 0;
                const pct = total > 0 ? Math.round((active / total) * 100) : 0;
                return (
                  <tr key={role} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 font-medium text-gray-800">
                      <span className={`text-xs font-semibold ${textColor}`}>{label}</span>
                    </td>
                    <td className="p-3 text-center font-semibold text-gray-900">{total}</td>
                    <td className="p-3 text-center font-semibold text-emerald-600">{active}</td>
                    <td className="p-3 text-center font-semibold text-red-500">{disabled}</td>
                    <td className="p-3 text-center">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pct >= 80 ? "bg-emerald-50 text-emerald-600" : pct >= 50 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"}`}>
                        {pct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
