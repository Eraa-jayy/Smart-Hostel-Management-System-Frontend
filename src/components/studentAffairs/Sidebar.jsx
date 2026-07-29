import React from "react";
import { NavLink,useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Upload,
  Building2,
  Bed,
  FileText,
  Bell,
  LogOut,
} from "lucide-react";

export default function Sidebar() {

  const navigate = useNavigate();

  const menus = [
    { name: "Dashboard", path: "/student-affairs/dashboard", icon: LayoutDashboard },
    { name: "Upload Students", path: "/student-affairs/bulk-upload", icon: Upload },
    { name: "Hostels Management", path: "/student-affairs/hostel", icon: Building2 },
    { name: "Allocations", path: "/student-affairs/allocations", icon: Bed },
    { name: "Reports", path: "/student-affairs/reports", icon: FileText },
    { name: "Notifications", path: "/student-affairs/notifications", icon: Bell },
  ];

  const handleLogout = () =>{

    localStorage.removeItem("token");

    localStorage.removeItem("username");

    localStorage.removeItem("role");

    navigate("/login");

  }

  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col">

      <div className="text-2xl font-bold p-6 border-b border-blue-700">
        Student Affairs
      </div>

      <nav className="flex-1">

        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.name}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-4 hover:bg-blue-700 ${
                  isActive ? "bg-blue-700" : ""
                }`
              }
            >
              <Icon size={20} />
              {menu.name}
            </NavLink>
          );
        })}
      </nav>

      <button onClick={handleLogout}  className="flex items-center gap-3 p-5 hover:bg-red-600">
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}