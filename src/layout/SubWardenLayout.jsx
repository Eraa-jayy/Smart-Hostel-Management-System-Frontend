import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/subWarden/Sidebar";
import Navbar from "../components/subWarden/Navbar";

export default function SubWardenLayout() {
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
