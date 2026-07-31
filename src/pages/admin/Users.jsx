import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, CalendarDays } from "lucide-react";
import UserTable from "../../components/admin/UserTable";
import {
  getAllUsers,
  toggleUserStatus,
  deleteUser
} from "../../service/adminService.js";

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data);
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      alert("User deleted successfully");
      loadUsers();
    } catch (error) {
      console.log(error);
      alert("Failed to delete user");
    }
  };

  const roleOptions = [...new Set(users.map((u) => u.role))];

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.studentName?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage all system users and accounts
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
            Create User
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-200 transition-all">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by username or student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 bg-white"
        >
          <option value="ALL">All Roles</option>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 p-10">Loading...</div>
      ) : (
        <UserTable
          users={filteredUsers}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}