import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Building2, KeyRound } from "lucide-react";
import { changePassword } from "../service/authService";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await changePassword(username, currentPassword, newPassword);

      alert("Password changed successfully. Please continue.");

      // Role eka anuwa correct dashboard ekatт navigate karanawa
      switch (role) {
        case "STUDENT":
          navigate("/student");
          break;
        case "STUDENT_AFFAIRS":
          navigate("/student-affairs");
          break;
        case "SUB_WARDEN":
          navigate("/subwarden");
          break;
        case "WARDEN":
          navigate("/warden");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.log(err);
      const errorMassage =
        typeof err.response.data === "string"
        ? err.response?.data 
        :err.response?.data?.massage || "Failed to change password";
      
      setError(errorMassage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e2a78] via-[#2f3f9e] to-[#8f9be0] px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[560px] px-10 py-10">
        <div className="flex justify-center mb-6">
          <div className="bg-amber-200 px-5 py-2 rounded-full flex gap-2">
            <KeyRound size={18} />
            <span>First Login - Password Change Required</span>
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="bg-[#101c5c] p-2 rounded-xl">
            <Building2 className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#101c5c]">UniNest</h1>
        </div>

        <h1 className="text-center text-3xl font-bold">Change Your Password</h1>
        <p className="text-center text-gray-500 mb-8">
          For security, please set a new password before continuing
        </p>

        <form onSubmit={handleSubmit}>
          <label className="text-sm">Current (Temporary) Password</label>
          <div className="flex items-center bg-slate-50 border rounded-xl px-4 py-3 mb-5">
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              className="ml-3 w-full bg-transparent outline-none"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter temporary password"
              required
            />
          </div>

          <label className="text-sm">New Password</label>
          <div className="flex items-center bg-slate-50 border rounded-xl px-4 py-3 mb-5">
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              className="ml-3 w-full bg-transparent outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>

          <label className="text-sm">Confirm New Password</label>
          <div className="flex items-center bg-slate-50 border rounded-xl px-4 py-3 mb-5">
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              className="ml-3 w-full bg-transparent outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#101c5c] text-white rounded-xl py-4 flex justify-center gap-2"
          >
            {loading ? "Updating..." : "Change Password & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}