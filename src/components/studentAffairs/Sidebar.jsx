import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Upload,
  Building2,
  Bed,
  FileText,
  Bell,
  MessageSquareWarning,
  LogOut,
} from "lucide-react";

export default function Sidebar({ onOpenProfile, profileImage }) {
  const navigate = useNavigate();

  const fullName = localStorage.getItem("fullName") || "Student Affairs";

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "SA";

  const menus = [
    {
      name: "Dashboard",
      path: "/student-affairs/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Upload Students",
      path: "/student-affairs/bulk-upload",
      icon: Upload,
    },
    {
      name: "Hostels Management",
      path: "/student-affairs/hostel",
      icon: Building2,
    },
    {
      name: "Allocations",
      path: "/student-affairs/allocations",
      icon: Bed,
    },
    {
      name: "Complaint Status",
      path: "/student-affairs/complaints",
      icon: MessageSquareWarning,
    },
    {
      name: "Reports",
      path: "/student-affairs/reports",
      icon: FileText,
    },
    {
      name: "Notifications",
      path: "/student-affairs/notifications",
      icon: Bell,
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <aside className="sticky top-0 z-30 flex h-screen w-[260px] flex-shrink-0 self-start flex-col border-r border-white/5 bg-[#0a0f1e] shadow-2xl shadow-slate-950/30">
        <div className="px-6 pt-7 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white">UniNest</h1>
            </div>
          </div>
        </div>

        <div className="mx-5 h-px bg-white/5" />

        <p className="px-6 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-widest text-white/60">
          Main Menu
        </p>

        <nav className="flex-1 space-y-1 px-3">
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

        <div className="space-y-0.5 px-3 pb-3">
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
    </>
  );
}