import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquareWarning,
  UtensilsCrossed,
  CreditCard,
  Megaphone,
  LogOut,
  Building2,
  HelpCircle,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/student", icon: LayoutDashboard },
  { label: "Complaints", path: "/student/complaints", icon: MessageSquareWarning },
  { label: "Canteen", path: "/student/canteen", icon: UtensilsCrossed },
  { label: "Payments", path: "/student/payments", icon: CreditCard },
  { label: "Announcements", path: "/student/notifications", icon: Megaphone },
];

const BOTTOM_ITEMS = [
  { label: "Help Center", path: "/student/help", icon: HelpCircle },
];

export default function StudentSidebar({ onLogout }) {
  const location = useLocation();

  return (
    <aside className="w-[260px] min-h-screen bg-[#0a0f1e] flex flex-col">
      {/* Brand */}
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">UniNest</h1>
            <p className="text-[11px] text-slate-500 font-medium">Student Portal</p>
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
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              aria-current={isActive ? "page" : undefined}
              className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-500/10 text-blue-400 shadow-sm shadow-blue-500/5"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-500/15 text-blue-400"
                    : "bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-slate-300"
                }`}
              >
                <Icon size={17} strokeWidth={2} />
              </div>
              {label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-3 space-y-0.5">
        {BOTTOM_ITEMS.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-slate-300 transition-colors duration-200">
                <Icon size={17} strokeWidth={2} />
              </div>
              {label}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-3 h-px bg-white/5" />

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-400/60 group-hover:bg-red-500/15">
            <LogOut size={17} strokeWidth={2} />
          </div>
          Sign Out
        </button>
      </div>

      {/* User card at bottom */}
      <div className="mx-3 mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/20">
            JD
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-slate-200 truncate">John Doe</p>
            <p className="text-[11px] text-slate-500 truncate">CS / 3rd Year</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
