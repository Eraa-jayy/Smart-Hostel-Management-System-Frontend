import React, { useState } from "react";
import {
  Building2,
  AtSign,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowLeft,
  ChevronDown,
  UserCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../service/axios";

const ROLES = [
  { label: "Student", value: "STUDENT" },
  { label: "Student Affairs Unit", value: "STUDENT_AFFAIRS" },
  { label: "Sub Warden", value: "SUB_WARDEN" },
  { label: "Maintenance Unit", value: "MAINTENANCE" },
  { label: "Hostel Canteen Staff", value: "CANTEEN" },
  { label: "system administration",value: "ADMIN"},
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState(ROLES[0]);
  const [roleOpen, setRoleOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const data = response.data;
      console.log("LOGIN SUCCESS : ", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);
      localStorage.setItem("fullName", data.fullName);

      if(data.forcePasswordChange){
        navigate("/change-password");
        return;
      }

      switch (data.role) {

        case "ADMIN":
          navigate("/admin");
          break;
        case "STUDENT":
          navigate("/student");
          break;
        case "STUDENT_AFFAIRS":
          navigate("/student-affairs");
          break;
        case "SUB_WARDEN":
        case "SUBWARDEN":
          navigate("/subwarden");
          break;
        case "WARDEN":
          navigate("/warden");
          break;
        case "MAINTENANCE":
          navigate("/maintenance");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.log("FULL FAILED : ", error);

      console.log(
        "STATUS :",
        error.response?.status
      );

      console.log("DATA :",
        error.response?.data
      );

      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e2a78] via-[#2f3f9e] to-[#8f9be0] px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[560px] px-10 py-10">
        <div className="flex justify-center mb-6">
          <div className="bg-amber-200 px-5 py-2 rounded-full flex gap-2">
            <UserCircle2 size={18} />
            <span>{role.label} Login</span>
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="bg-[#101c5c] p-2 rounded-xl">
            <Building2 className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#101c5c]">UniNest</h1>
        </div>

        <h1 className="text-center text-3xl font-bold">Welcome Back</h1>
        <p className="text-center text-gray-500 mb-8">
          Login to access your dashboard
        </p>

        <label className="text-sm">Login as</label>

        <div className="relative mb-5">
          <button
            className="w-full flex justify-between bg-slate-50 border rounded-xl px-4 py-3"
            onClick={() => setRoleOpen(!roleOpen)}
          >
            {role.label}
            <ChevronDown size={18} />
          </button>

          {roleOpen && (
            <div className="absolute w-full bg-white border rounded-xl z-20">
              {ROLES.map((item) => (
                <button
                  key={item.value}
                  className="w-full text-left px-4 py-3 hover:bg-slate-100"
                  onClick={() => {
                    setRole(item);
                    setRoleOpen(false);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <label className="text-sm">Username</label>
        <div className="flex items-center bg-slate-50 border rounded-xl px-4 py-3 mb-5">
          <AtSign size={18} />
          <input
            className="ml-3 w-full bg-transparent outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>

        <label className="text-sm">Password</label>
        <div className="flex items-center bg-slate-50 border rounded-xl px-4 py-3 mb-5">
          <Lock size={18} />
          <input
            type={showPassword ? "text" : "password"}
            className="ml-3 w-full bg-transparent outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#101c5c] text-white rounded-xl py-4 flex justify-center gap-2"
        >
          {loading ? "Logging in..." : "Login to Account"}
          <LogIn size={18} />
        </button>

        <hr className="my-6" />

        <div className="text-center text-sm">
          <ArrowLeft size={16} className="inline" />
          Back to Register
        </div>
      </div>
    </div>
  );
}
