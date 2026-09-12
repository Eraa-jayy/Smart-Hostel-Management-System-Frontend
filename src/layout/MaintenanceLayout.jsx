import { Outlet } from "react-router-dom";
import Sidebar from "../components/maintenance/Sidebar";
import Navbar from "../components/maintenance/Navbar";

export default function MaintenanceLayout() {
  return <div className="flex min-h-screen bg-[#f0f2f5]"><Sidebar /><div className="flex-1 min-w-0 flex flex-col"><Navbar /><main className="flex-1 overflow-auto p-6 lg:p-8"><Outlet /></main></div></div>;
}
