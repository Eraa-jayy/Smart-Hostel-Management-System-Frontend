import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Upload,
  Building2,
  Bed,
  FileText,
  Bell,
  MessageSquareWarning,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const menus = [
    { name: "Dashboard", path: "/student-affairs/dashboard", icon: LayoutDashboard },
    { name: "Upload Students", path: "/student-affairs/bulk-upload", icon: Upload },
    { name: "Hostels Management", path: "/student-affairs/hostel", icon: Building2 },
    { name: "Allocations", path: "/student-affairs/allocations", icon: Bed },
    { name: "Complaint Status", path: "/student-affairs/complaints", icon: MessageSquareWarning },
    { name: "Reports", path: "/student-affairs/reports", icon: FileText },
    { name: "Notifications", path: "/student-affairs/notifications", icon: Bell },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <aside className="w-[260px] min-h-screen bg-[#0a0f1e] flex flex-col flex-shrink-0">
      {/* Brand */}
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">UniNest</h1>
            <p className="text-[11px] text-slate-500 font-medium">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-white/5" />

      {/* Section label */}
      <p className="px-6 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
        Main Menu
      </p>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {menus.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-500/10 text-blue-400 shadow-sm shadow-blue-500/5"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-500/15 text-blue-400"
                      : "bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-slate-300"
                  }`}
                >
                  <Icon size={17} strokeWidth={2} />
                </div>
                {name}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-3 space-y-0.5">
        {/* Divider */}
        <div className="my-3 h-px bg-white/5" />

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-400/60">
            <LogOut size={17} strokeWidth={2} />
          </div>
          LOGOUT
        </button>
      </div>
    </aside>
  );
}
