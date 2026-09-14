import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ChevronDown, UserCircle, Shield } from "lucide-react";

// Helper function to handle literal "null" strings stored in localStorage
const getCleanStorageItem = (key, fallback) => {
  const item = localStorage.getItem(key);
  if (!item || item === "null" || item === "undefined" || item.trim() === "") {
    return fallback;
  }
  return item;
};

export default function AdminTopbar({ onLogout, onOpenProfile, profileImage }) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fullName = getCleanStorageItem("fullName", "Admin");
  const email = getCleanStorageItem("username", "admin@university.edu");

  // Get initials for avatar fallback (e.g. "Admin User" -> "AU" or "A")
  const getInitials = (name) => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "A";
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsProfileOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      navigate("/login");
    }
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
    <header className="flex h-[68px] items-center justify-between border-b border-gray-200/80 bg-white px-4 sm:px-6 lg:px-8">
      {/* Left Title — Admin Panel Header matching SA Navbar structure */}
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
          System Administration
        </h1>
      </div>

      {/* Right Controls — Profile Dropdown & Divider */}
      <div className="flex items-center gap-2">
        <div className="mx-1 hidden h-8 w-px bg-gray-200 sm:block" />

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={isProfileOpen}
            className="flex items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-3 text-left transition-colors hover:bg-gray-50"
          >
            {/* Avatar Container */}
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-md shadow-blue-500/20">
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

            {/* User Meta Details */}
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-tight text-gray-800">
                {fullName}
              </p>
            </div>

            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform duration-200 ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg duration-100 animate-in fade-in zoom-in-95">
              <div className="border-b border-gray-100 px-4 py-2">
                <p className="text-sm font-semibold text-gray-800">
                  Admin
                </p>
                {/* <p className="truncate text-[11px] text-gray-400">
                  {email}
                </p> */}
              </div>

              <div className="py-1">
                {onOpenProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenProfile();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <UserCircle size={15} />
                    Profile
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
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