import React from "react";
import { Bell, UserCircle, Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-[68px] bg-white border-b border-gray-200/80 flex items-center justify-between px-6 lg:px-8">
      {/* Left — Greeting */}
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-gray-800">
          Student Affairs <span className="text-blue-600">Dashboard</span>
        </h2>
        <p className="text-xs text-gray-400 -mt-0.5">
          Manage university hostels and student allocations
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

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm shadow-red-500/30">
            3
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 mx-1" />

        {/* Profile */}
        <div className="flex items-center gap-2.5 rounded-xl hover:bg-gray-50 py-1.5 pl-1.5 pr-3 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20">
            SA
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              Student Affairs
            </p>
            <p className="text-[11px] text-gray-400 leading-tight">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
