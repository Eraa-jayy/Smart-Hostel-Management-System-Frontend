import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Building2,
  Wrench,
  Bell,
  LogOut
} from "lucide-react";

export default function StudentSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white shadow-lg p-6">

      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600">
          Smart Hostel
        </h1>

        <p className="text-sm text-gray-500">
          Student Panel
        </p>
      </div>


      {/* Menu */}
      <nav className="space-y-3">

        <Link
          to="/student-dashboard"
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100">
          Dashboard
        </Link>


        <Link
          to="/student-complaints"
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100">
          Complaints
        </Link>
              
        <Link
          to="/student-Canteen"
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100"
        >
          Canteen
        </Link>


        <Link
          to="/student-Payments"
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100"
        >
          Payments
        </Link>

        <Link
          to="/student-Notifications"
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100"
        >
          Notification
        </Link>

      </nav>


      {/* Logout */}
      <button className="mt-10 flex items-center gap-3 w-full p-3 rounded-lg text-red-500 hover:bg-red-50">
        <LogOut size={20}/>
        Logout
      </button>


    </aside>
  );
}