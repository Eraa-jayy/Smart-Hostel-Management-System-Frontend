import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import StudentNavbar from "../components/StudentNavbar";
import { getMyRoomDetails } from "../service/studentAllocationService";

export default function StudentLayout() {
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState(
    localStorage.getItem("fullName") || localStorage.getItem("username") || "Student"
  );

  useEffect(() => {
    getMyRoomDetails()
      .then(({ data }) => {
        if (data?.fullName) {
          setStudentName(data.fullName);
          localStorage.setItem("fullName", data.fullName);
        }
      })
      .catch((error) => {
        console.error("Unable to load student profile name:", error);
      });
  }, []);

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