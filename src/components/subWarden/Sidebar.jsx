import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  AlertTriangle,
  Settings,
  Building,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const menus = [
    { name: "Dashboard", path: "/subwarden/dashboard", icon: LayoutDashboard },
    { name: "Student Allocation", path: "/subwarden/allocations", icon: Users },
    { name: "Inventory Management", path: "/subwarden/inventory", icon: ClipboardList },
    { name: "Complaints", path: "/subwarden/complaints", icon: AlertTriangle },
    { name: "Configuration", path: "/subwarden/config", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("fullName");
    navigate("/login");
  };

  return (
    <aside className="w-[260px] min-h-screen bg-[#0a0f1e] flex flex-col flex-shrink-0">
      {/* Brand */}
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Building size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">UniNest</h1>
            <p className="text-[11px] text-slate-500 font-medium">Sub Warden Portal</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-white/5" />

      {/* Section label */}
      <p className="px-6 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
        Main Options
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
                  ? "bg-indigo-500/10 text-indigo-400 shadow-sm shadow-indigo-500/5"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-indigo-500/15 text-indigo-400"
                      : "bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-slate-300"
                  }`}
                >
                  <Icon size={17} strokeWidth={2} />
                </div>
                {name}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50" />
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
