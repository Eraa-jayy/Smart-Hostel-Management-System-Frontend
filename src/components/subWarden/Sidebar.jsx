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
    <aside className="sticky top-0 z-30 flex h-auto w-full flex-shrink-0 self-start flex-col overflow-hidden border-b border-white/5 bg-[#0a0f1e] shadow-2xl shadow-slate-950/30 lg:h-screen lg:w-[260px] lg:border-b-0 lg:border-r">
      <div className="px-4 pb-4 pt-5 sm:px-6 sm:pb-6 sm:pt-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
            <Building size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">UniNest</h1>
            <p className="text-[11px] font-medium text-slate-500">Sub Warden Portal</p>
          </div>
        </div>
      </div>

      <div className="mx-4 h-px bg-white/5 sm:mx-5" />

      <p className="px-4 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-widest text-white/60 sm:px-6 sm:pt-5">
        Main Menu
      </p>

      <nav className="flex-1 space-y-1 overflow-x-auto px-3 py-1 lg:overflow-y-auto">
        {menus.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `group flex min-h-[46px] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-500/10 text-blue-400 shadow-sm shadow-blue-500/5"
                  : "text-white hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-500/15 text-blue-400"
                      : "bg-white/5 text-white group-hover:bg-white/10 group-hover:text-white"
                  }`}
                >
                  <Icon size={17} strokeWidth={2} />
                </div>

                <span className="min-w-0 flex-1 truncate text-left">{name}</span>

                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-0.5 px-3 pb-3 pt-1">
        <div className="my-3 h-px bg-white/5" />

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-white transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-white">
            <LogOut size={17} strokeWidth={2} />
          </div>
          <span className="truncate">LOGOUT</span>
        </button>
      </div>
    </aside>
  );
}