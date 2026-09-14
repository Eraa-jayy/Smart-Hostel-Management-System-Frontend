import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const getCleanStorageItem = (key, fallback) => {
  const item = localStorage.getItem(key);
  if (!item || item === "null" || item === "undefined" || item.trim() === "") {
    return fallback;
  }
  return item;
};

export default function Navbar() {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fullName = getCleanStorageItem("fullName", "Canteen Staff");
  const username = getCleanStorageItem("username", "Canteen Staff");

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
    <header className="flex h-[68px] items-center justify-between border-b border-gray-200/80 bg-white px-4 sm:px-6 lg:px-8">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
          Hostel Canteen 
        </h1>
        {/* <p className="hidden text-xs text-gray-400 sm:block">
          Publish today's meal menus for students
        </p> */}
      </div>

      <div className="flex items-center gap-2">
        <div className="mx-1 hidden h-8 w-px bg-gray-200 sm:block" />

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((previous) => !previous)}
            className="flex items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-3 text-left transition-colors hover:bg-gray-50"
          >
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-orange-400 to-red-500 text-xs font-bold text-white shadow-md shadow-orange-500/20">
              {fullName.charAt(0).toUpperCase()}
            </div>

            <div className="hidden sm:block">
              <p className="leading-tight text-sm font-semibold text-gray-800">
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

          {isProfileOpen && (
            <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg">
              <div className="border-b border-gray-100 px-4 py-2">
                <p className="text-sm font-semibold text-gray-800">{fullName}</p>
                <p className="truncate text-[11px] text-gray-400">{username}</p>
              </div>

              <div className="py-1">
                {/* <div className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-500">
                  <UserCircle size={15} />
                  Canteen account
                </div> */}
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
