import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  UserCircle,
  LogOut,
  Settings,
  ChevronDown,
  Search,
  Moon,
} from "lucide-react";

export default function StudentNavbar({
  studentName = "John Doe",
  roomNumber = "A-204",
  notificationCount = 3,
  onLogout,
  onSettings,
  onNotificationsClick,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-[68px] bg-white border-b border-gray-200/80 flex items-center justify-between px-6 lg:px-8">
      {/* Left — Greeting */}
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome back, <span className="text-blue-600">{studentName.split(" ")[0]}</span> 👋
        </h2>
        <p className="text-xs text-gray-400 -mt-0.5">
          {roomNumber ? `Room ${roomNumber} • ` : ""}Last login: Today, 09:14 AM
        </p>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          type="button"
          aria-label="Search"
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-400 hover:text-gray-600 transition-colors text-sm"
        >
          <Search size={16} />
          <span className="text-xs text-gray-400">Search...</span>
          <kbd className="ml-2 text-[10px] font-medium bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-400">
            ⌘K
          </kbd>
        </button>

        {/* Dark mode toggle */}
        <button
          type="button"
          aria-label="Toggle dark mode"
          className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <Moon size={18} />
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={onNotificationsClick}
          aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ""}`}
          className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm shadow-red-500/30">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 mx-1" />

        {/* Profile dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            className="flex items-center gap-2.5 rounded-xl hover:bg-gray-50 py-1.5 pl-1.5 pr-3 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20">
              JD
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{studentName}</p>
              <p className="text-[11px] text-gray-400 leading-tight">Student</p>
            </div>
            <ChevronDown
              size={14}
              className={`hidden sm:block text-gray-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 py-1.5 z-50">
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{studentName}</p>
                <p className="text-xs text-gray-400">john.doe@university.edu</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onSettings?.();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Settings size={16} className="text-gray-400" />
                Settings
              </button>
              <div className="my-1.5 border-t border-gray-100" />
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onLogout?.();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} className="text-red-400" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
