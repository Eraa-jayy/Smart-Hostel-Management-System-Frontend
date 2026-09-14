import { Outlet } from "react-router-dom";
import CanteenSidebar from "../components/canteen/Sidebar";
import Navbar from "../components/canteen/Navbar";

export default function CanteenLayout() {
  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <CanteenSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
