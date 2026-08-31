import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <aside className="sticky top-0 z-30 flex h-screen w-[260px] flex-shrink-0 self-start flex-col overflow-hidden border-r border-white/5 bg-[#0a0f1e] shadow-2xl shadow-slate-950/30">
      <div className="px-6 pb-6 pt-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">UniNest</h1>
            <p className="text-[11px] font-medium text-slate-500">Student Portal</p>
          </div>
        </div>
      </div>

      <div className="mx-5 h-px bg-white/5" />

      <p className="px-6 pb-2 pt-5 text-[10px] font-semibold uppercase tracking-widest text-white/60">
        Main Menu
      </p>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-1">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              aria-current={isActive ? "page" : undefined}
              className={`group flex min-h-[46px] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-500/10 text-blue-400 shadow-sm shadow-blue-500/5"
                  : "text-white hover:bg-white/5 hover:text-white"
              }`}
            >
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-500/15 text-blue-400"
                    : "bg-white/5 text-white group-hover:bg-white/10 group-hover:text-white"
                }`}
              >
                <Icon size={17} strokeWidth={2} />
              </div>

              <span className="min-w-0 flex-1 truncate text-left">{label}</span>

              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-0.5 px-3 pb-3">
        {BOTTOM_ITEMS.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`group flex min-h-[46px] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-white hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 text-white transition-colors duration-200 group-hover:bg-white/10">
                <Icon size={17} strokeWidth={2} />
              </div>
              <span className="min-w-0 flex-1 truncate text-left">{label}</span>
            </Link>
          );
        })}

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

      <div className="mx-3 mb-5 rounded-xl border border-white/5 bg-white/[0.03] p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white shadow-lg shadow-blue-500/20">
            JD
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-slate-200">John Doe</p>
            <p className="truncate text-[11px] text-slate-500">CS / 3rd Year</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
