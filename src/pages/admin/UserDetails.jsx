import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, UserCircle2, Power, Trash2, CalendarDays } from "lucide-react";
import {
  getUserById,
  toggleUserStatus,
  deleteUser,
} from "../../service/adminService";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const response = await getUserById(id);
      setUser(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      await toggleUserStatus(id);
      loadUser();
    } catch (error) {
      console.log(error);
      alert("Failed to update status");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      alert("User deleted successfully");
      navigate("/admin/users");
    } catch (error) {
      console.log(error);
      alert("Failed to delete user");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400 p-10">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center text-gray-400 p-10">User not found</div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <button
        onClick={() => navigate("/admin/users")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={16} /> Back to Users
      </button>

      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            View and manage user account information
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <CalendarDays size={14} />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <UserCircle2 className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user.username}</h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
              {user.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-xs text-gray-400 mb-1">Account Status</p>
            <span
              className={`text-sm font-semibold px-3 py-1 rounded-full ${
                user.enabled
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {user.enabled ? "Active" : "Disabled"}
            </span>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">First Login</p>
            <p className="text-sm font-semibold text-gray-700">
              {user.firstLogin ? "Pending" : "Completed"}
            </p>
          </div>

          {user.studentName && (
            <div className="col-span-2">
              <p className="text-xs text-gray-400 mb-1">Linked Student</p>
              <p className="text-sm font-semibold text-gray-700">
                {user.studentName}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleToggleStatus}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-50 text-amber-600 font-semibold text-sm hover:bg-amber-100"
          >
            <Power size={16} />
            {user.enabled ? "Disable Account" : "Enable Account"}
          </button>

          <button
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100"
          >
            <Trash2 size={16} />
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}