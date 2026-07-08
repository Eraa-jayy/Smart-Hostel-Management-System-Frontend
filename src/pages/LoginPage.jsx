import React, { useState } from "react";
import { Building2, AtSign, Lock, Eye, EyeOff, LogIn, ArrowLeft, ChevronDown, UserCircle2 } from "lucide-react";

const ROLES = [
  "Student",
  "Student Affairs Unit",
  "Sub Warden",
  "Maintenance Unit",
  "Hostel Canteen Staff",
];

export default function RuHostelLogin({ onLogin }) {
  const [role, setRole] = useState(ROLES[0]);
  const [roleOpen, setRoleOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1e2a78] via-[#2f3f9e] to-[#8f9be0] py-16 px-4">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute top-10 right-20 w-24 h-24 rounded-full bg-white/10 blur-sm" />
        <div className="absolute top-40 left-10 w-10 h-10 rounded-full bg-white/10" />
        <div className="absolute bottom-32 left-16 w-8 h-8 rounded-full bg-white/10" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[560px] bg-white rounded-3xl shadow-2xl px-10 pt-8 pb-9 sm:px-14 sm:pt-10 sm:pb-10">
        {/* Role badge */}
        <div className="flex justify-center -mt-16 mb-6">
          <div className="flex items-center gap-2 bg-amber-200/80 text-[#3a2e0d] font-medium px-5 py-2.5 rounded-full shadow-sm">
            <UserCircle2 size={18} strokeWidth={2} />
            <span>{role} Login</span>
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#101c5c] flex items-center justify-center">
            <Building2 size={20} className="text-white" strokeWidth={2} />
          </div>
          <span className="text-2xl font-bold text-[#101c5c]">UniNest</span>
        </div>

        {/* Heading */}
        <h1 className="text-center text-3xl font-bold text-slate-900 mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-slate-500 mb-8 leading-relaxed">
          Login to access your hostel management dashboard
        </p>

        {/* Role dropdown */}
        <div className="mb-5">
          <label className="block text-sm text-slate-700 mb-2">Login as</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleOpen((o) => !o)}
              className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-left text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#101c5c]/30 focus:border-[#101c5c]"
            >
              <span>{role}</span>
              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform ${roleOpen ? "rotate-180" : ""}`}
              />
            </button>
            {roleOpen && (
              <ul className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                {ROLES.map((r) => (
                  <li key={r}>
                    <button
                      type="button"
                      onClick={() => {
                        setRole(r);
                        setRoleOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors ${
                        r === role ? "text-[#101c5c] font-medium bg-slate-50" : "text-slate-700"
                      }`}
                    >
                      {r}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Username */}
        <div className="mb-5">
          <label className="block text-sm text-slate-700 mb-2">
            Username
          </label>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#101c5c]/30 focus-within:border-[#101c5c]">
            <AtSign size={18} className="text-slate-400 mr-3 shrink-0" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="name@university.edu"
              className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-slate-700">Password</label>
            <a href="#" className="text-sm text-[#101c5c] font-medium hover:underline">
              Forgot Password?
            </a>
          </div>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#101c5c]/30 focus-within:border-[#101c5c]">
            <Lock size={18} className="text-slate-400 mr-3 shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-slate-400 hover:text-slate-600 shrink-0"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Keep logged in */}
        <label className="flex items-center gap-2.5 mb-6 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={keepLoggedIn}
            onChange={(e) => setKeepLoggedIn(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-[#101c5c] focus:ring-[#101c5c]/40"
          />
          <span className="text-slate-700 text-sm">Keep me logged in for 30 days</span>
        </label>

        {/* Submit */}
        <button
          type="button"
          onClick={() => onLogin && onLogin(role)}
          className="w-full flex items-center justify-center gap-2 bg-[#101c5c] hover:bg-[#0c1548] transition-colors text-white font-medium rounded-xl py-4 mb-6"
        >
          Login to Account
          <LogIn size={18} />
        </button>

        <hr className="border-slate-200 mb-6" />

        {/* Footer */}
        <div className="text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-slate-700 text-sm mb-4 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Register
          </a>
          {/* <p className="text-xs tracking-wide text-slate-400 uppercase mb-1">Support</p> */}
          <p className="text-sm text-slate-600">
            Need Help?{" "}
            <a href="#" className="text-[#101c5c] font-semibold hover:underline">
              Contact Student Affairs
            </a>
          </p>
        </div>
      </div>

      {/* Bottom note */}
      {/* <p className="absolute bottom-6 text-center text-xs text-white/70 tracking-wide">
        🛡 Secure Institutional Access Protocol • SSL Encrypted
      </p> */}
    </div>
  );
}