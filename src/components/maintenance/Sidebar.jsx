import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  History,
  LogOut,
  Wrench,
  Building2,
} from "lucide-react";

const links = [
  { label: "Complaints", to: "/maintenance/complaints", icon: ClipboardList },
  { label: "History", to: "/maintenance/history", icon: History },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    ["token", "username", "role", "fullName"].forEach((key) => localStorage.removeItem(key));
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
            <p className="text-[11px] font-medium text-slate-500">Maintenance Portal</p>
          </div>
        </div>
      </div>

      <div className="mx-5 h-px bg-white/5" />

      <p className="px-6 pb-2 pt-5 text-[10px] font-semibold uppercase tracking-widest text-white/60">
        Work orders
      </p>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-1">
        {links.map(({ label, to, icon: Icon }) => {
          const isActive = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
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
        <div className="my-3 h-px bg-white/5" />

        <button
          type="button"
          onClick={logout}
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
