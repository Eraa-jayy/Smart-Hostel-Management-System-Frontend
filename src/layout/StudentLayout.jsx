import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import StudentNavbar from "../components/StudentNavbar";

export default function StudentLayout() {
  const navigate = useNavigate();

  const studentName = localStorage.getItem("fullName") || "Student";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <StudentSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <StudentNavbar
          studentName={studentName}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}