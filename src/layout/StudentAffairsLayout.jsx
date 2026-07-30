import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/studentAffairs/Sidebar";
import Navbar from "../components/studentAffairs/Navbar";

export default function StudentAffairsLayout() {
  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
