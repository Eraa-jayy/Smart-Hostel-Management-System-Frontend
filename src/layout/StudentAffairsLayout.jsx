import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/studentAffairs/Sidebar";
import Navbar from "../components/studentAffairs/Navbar";

export default function StudentAffairsLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}