import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/subWarden/Sidebar";
import Navbar from "../components/subWarden/Navbar";

export default function SubWardenLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f5] lg:flex-row">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
