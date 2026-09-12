import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, ArrowLeft, CalendarDays } from "lucide-react";
import { createUser } from "../../service/adminService.js";
import { getAllHostels } from "../../service/hostelService.js";

const ROLES = [
  "ADMIN",
  "STUDENT_AFFAIRS",
  "WARDEN",
  "SUBWARDEN",
  "MAINTENANCE",
  "CANTEEN",
  "STUDENT",
];

const STAFF_ROLES = ["WARDEN", "SUBWARDEN", "MAINTENANCE", "CANTEEN"];

export default function CreateUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "STUDENT_AFFAIRS",
    hostelId: "",
  });
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHostels();
  }, []);

  const loadHostels = async () => {
    try {
      const res = await getAllHostels();
      setHostels(res.data || []);
    } catch (err) {
      console.error("Failed to load hostels list", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        role: formData.role,
        ...(STAFF_ROLES.includes(formData.role) && formData.hostelId
          ? { hostelId: Number(formData.hostelId) }
          : {}),
      };
      await createUser(payload);
      alert("User created successfully");
      navigate("/admin/users");
    } catch (err) {
      console.log(err);
      const msg =
        typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to create user";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <button
        onClick={() => navigate("/admin/users")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={16} /> Back to Users
      </button>

      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create User</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manually create a staff or admin account
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <CalendarDays size={14} />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">
              Username
            </label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. john.affairs"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {STAFF_ROLES.includes(formData.role) && (
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">
                Assigned Hostel
              </label>
              <select
                name="hostelId"
                value={formData.hostelId}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400"
              >
                <option value="">Select Hostel (Optional / Recommended)</option>
                {hostels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.hostelName} ({h.location || h.hostelType})
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#101c5c] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400"
          >
            <UserPlus size={18} />
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}