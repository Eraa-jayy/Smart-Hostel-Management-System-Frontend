import { Outlet } from "react-router-dom";
import CanteenSidebar from "../components/canteen/Sidebar";

export default function CanteenLayout() {
  const name = localStorage.getItem("fullName") || localStorage.getItem("username") || "Canteen Staff";
  return <div className="flex min-h-screen bg-[#f0f2f5]"><CanteenSidebar /><div className="flex-1 min-w-0 flex flex-col"><header className="h-[68px] bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8"><div><h2 className="text-lg font-semibold text-gray-800">Canteen <span className="text-orange-500">Workspace</span></h2><p className="text-xs text-gray-400">Publish today's meal menus for students</p></div><span className="text-sm font-semibold text-gray-700">{name}</span></header><main className="flex-1 overflow-auto p-6 lg:p-8"><Outlet /></main></div></div>;
}
