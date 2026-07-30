import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  CalendarDays,
  Building2,
  UserPlus,
  Power,
  Eye,
  UserCircle,
} from "lucide-react";
import { getAllUsers, toggleUserStatus } from "../../service/adminService";

export default function StudentAffairsAccounts() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      const allUsers = response.data || [];
      setUsers(allUsers.filter((u) => u.role === "STUDENT_AFFAIRS"));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatus(id);
      loadUsers();
    } catch (error) {
      console.log(error);
      alert("Failed to update user status");
    }
  };

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    (u.studentName && u.studentName.toLowerCase().includes(search.toLowerCase()))
  );

  const activeCount = users.filter((u) => u.enabled).length;
  const disabledCount = users.filter((u) => !u.enabled).length;

  if (loading) {
    return <div className="text-center text-gray-400 p-10">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Affairs Accounts</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage and monitor Student Affairs unit accounts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <CalendarDays size={14} />
            <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
          <button
            onClick={() => navigate("/admin/users/create")}
            className="flex items-center gap-2 bg-[#101c5c] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a2a70] transition"
          >
            <UserPlus size={16} />
            Create Account
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
              <Building2 size={20} className="text-violet-600" strokeWidth={2} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-xs text-gray-400">Total Accounts</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <UserCircle size={20} className="text-emerald-600" strokeWidth={2} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
              <p className="text-xs text-gray-400">Active Accounts</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
              <Power size={20} className="text-red-500" strokeWidth={2} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{disabledCount}</p>
              <p className="text-xs text-gray-400">Disabled Accounts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-200 transition-all max-w-md">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      {/* Accounts Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          No Student Affairs accounts found.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Username</th>
                <th className="p-4 font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-[11px] uppercase tracking-wider">First Login</th>
                <th className="p-4 font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Linked Student</th>
                <th className="p-4 font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">{user.username}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.enabled ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                      }`}
                    >
                      {user.enabled ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-medium ${user.firstLogin ? "text-amber-600" : "text-emerald-600"}`}>
                      {user.firstLogin ? "Pending" : "Completed"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{user.studentName || "-"}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.enabled
                            ? "hover:bg-amber-50 text-gray-500 hover:text-amber-600"
                            : "hover:bg-emerald-50 text-gray-500 hover:text-emerald-600"
                        }`}
                        title={user.enabled ? "Disable Account" : "Enable Account"}
                      >
                        <Power size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
