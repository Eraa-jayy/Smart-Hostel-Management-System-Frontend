import React from "react";
import { Bell, UserCircle } from "lucide-react";

export default function StudentNavbar() {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">

      {/* Welcome */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome to your room, Student 👋
        </h2>
      </div>


      {/* Right Side */}
      <div className="flex items-center gap-6">

        {/* Notification */}
        <button className="relative text-gray-600 hover:text-blue-600">
          <Bell size={24} />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </button>


        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer">

          <UserCircle 
            size={35}
            className="text-gray-600"
          />

          <div>
            <p className="text-sm font-medium text-gray-800">
              Student Name
            </p>

            <p className="text-xs text-gray-500">
              Student
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}