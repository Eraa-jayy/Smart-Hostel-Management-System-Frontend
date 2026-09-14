import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ChevronDown, UserCircle, Wrench } from "lucide-react";

// Helper function to handle literal "null" strings stored in localStorage
const getCleanStorageItem = (key, fallback) => {
  const item = localStorage.getItem(key);
  if (!item || item === "null" || item === "undefined" || item.trim() === "") {
    return fallback;
  }
  return item;
};

export default function MaintenanceNavbar({ onOpenProfile, profileImage }) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fullName = getCleanStorageItem("fullName", getCleanStorageItem("username", "Maintenance Staff"));
  const username = getCleanStorageItem("username", "Maintenance Staff");

  // Get initials for avatar fallback (e.g. "Maintenance Staff" -> "MS")
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsProfileOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-[68px] items-center justify-between border-b border-slate-200/80 bg-white px-3 sm:px-6 lg:px-8">
      {/* Left Header Title */}
      <div className="min-w-0 flex-1">
  <h1 className="truncate text-xl font-bold text-slate-800 sm:text-2xl lg:text-3xl">
    Maintenance Unit
  </h1>
  {/* <p className="hidden text-xs text-slate-400 sm:block">
    Manage hostel allocations, complaints, and student records
  </p> */}
</div>

      {/* Right Side Controls & Profile Dropdown */}
      <div className="flex items-center gap-2">
        <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={isProfileOpen}
            className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2 text-left transition-colors hover:bg-slate-50 sm:gap-2.5 sm:pr-3"
          >
            {/* Avatar Container */}
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-bold text-white shadow-md shadow-indigo-500/20">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(fullName)
              )}
            </div>

            {/* Name Label */}
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-tight text-slate-800">
                {fullName}
              </p>
              {/* <p className="text-[11px] leading-tight text-slate-400">
                Maintenance
              </p> */}
            </div>

            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-200 ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg duration-100 animate-in fade-in zoom-in-95">
              <div className="border-b border-slate-100 px-4 py-2">
                <p className="text-sm font-semibold text-slate-800">{fullName}</p>
                <p className="truncate text-[11px] text-slate-400">{username}</p>
              </div>

              <div className="py-1">
                {/* <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenProfile?.();
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <UserCircle size={15} />
                  Profile
                </button> */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <LogOut size={15} />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
