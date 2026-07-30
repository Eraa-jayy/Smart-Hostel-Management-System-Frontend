import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  UserCircle,
  Shield,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import { changePassword } from "../../service/authService";

export default function AdminProfile() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "admin";
  const fullName = localStorage.getItem("fullName") || "Admin";
  const role = localStorage.getItem("role") || "ADMIN";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await changePassword(username, currentPassword, newPassword);
      setSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.massage || "Failed to change password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            View your profile information and change password
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <CalendarDays size={14} />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{fullName}</h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
              {role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gray-50/80">
            <p className="text-xs text-gray-400 mb-1">Username</p>
            <p className="text-sm font-semibold text-gray-800">{username}</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50/80">
            <p className="text-xs text-gray-400 mb-1">Role</p>
            <p className="text-sm font-semibold text-gray-800">System Administrator</p>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lock size={18} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-800">Change Password</h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">
              Current Password
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-400 transition-all">
              <Lock size={16} className="text-gray-400" />
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
                className="ml-3 bg-transparent outline-none w-full text-sm"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)}>
                {showCurrent ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">
              New Password
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-400 transition-all">
              <Lock size={16} className="text-gray-400" />
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
                className="ml-3 bg-transparent outline-none w-full text-sm"
              />
              <button type="button" onClick={() => setShowNew(!showNew)}>
                {showNew ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">
              Confirm New Password
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-400 transition-all">
              <Lock size={16} className="text-gray-400" />
              <input
                type={showNew ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                className="ml-3 bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && (
            <p className="text-emerald-600 text-sm flex items-center gap-1">
              <CheckCircle2 size={14} />
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#101c5c] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400 hover:bg-[#1a2a70] transition"
          >
            <Lock size={16} />
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  );
}
