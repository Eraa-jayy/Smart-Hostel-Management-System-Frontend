import React from "react";
import { Bell, UserCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-white shadow flex justify-between items-center px-6 py-4">

      <h1 className="text-2xl font-bold">
        Smart Hostel Management System
      </h1>

      <div className="flex items-center gap-5">

        <Bell className="cursor-pointer" />

        <div className="flex items-center gap-2">
          <UserCircle size={35} />
          <span className="font-semibold">
            Student Affairs Officer
          </span>
        </div>

      </div>
    </header>
  );
}