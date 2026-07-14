import React from "react";
import StudentSidebar from "../../components/StudentSidebar";
import StudentNavbar from "../../components/StudentNavbar";

export default function StudentDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <StudentSidebar />


      {/* Main Content */}
      <main className="flex-1">

      {/* Navbar */}
    <StudentNavbar />


      {/* Dashboard Content */}
        <div className="p-8">

        <h1 className="text-4xl font-bold text-gray-800">
        Student Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
        Welcome to Smart Hostel Management System
        </p>


    {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">

          <h2 className="text-lg font-semibold text-gray-800">
          🏢 Hostel
          </h2>

          <p className="mt-3 text-gray-500">
             Main Hostel
          </p>

        </div>


        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">

          <h2 className="text-lg font-semibold text-gray-800">
            🚪 Room
          </h2>

            <p className="mt-3 text-gray-500">
              Room No: Not Assigned
            </p>

        </div>


        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">

          <h2 className="text-lg font-semibold text-gray-800">
            🔧 Requests
          </h2>

          <p className="mt-3 text-gray-500">
          0 Pending Requests
          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">

          <h2 className="text-lg font-semibold text-gray-800">
          📢 Notices
          </h2>

          <p className="mt-3 text-gray-500">
          No New Notices
          </p>

        </div>

      </div>
      {/* Bottom Sections */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">


  {/* Recent Activities */}
  <div className="bg-white rounded-xl shadow p-6">

    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      Recent Activities
    </h2>


    <div className="space-y-4">


      <div className="border-b pb-3">
        <p className="font-medium text-gray-700">
          Hostel allocation request submitted
        </p>

        <span className="text-sm text-gray-500">
          Today
        </span>
      </div>



      <div className="border-b pb-3">
        <p className="font-medium text-gray-700">
          Profile updated
        </p>

        <span className="text-sm text-gray-500">
          Yesterday
        </span>
      </div>



      <div>
        <p className="font-medium text-gray-700">
          Welcome to Smart Hostel System
        </p>

        <span className="text-sm text-gray-500">
          Recently
        </span>
      </div>


    </div>

  </div>



  {/* Quick Actions */}
  <div className="bg-white rounded-xl shadow p-6">

    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      Quick Actions
    </h2>


    <div className="grid grid-cols-2 gap-4">


      <button className="p-4 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
        Request Maintenance
      </button>


      <button className="p-4 rounded-lg bg-green-50 text-green-600 hover:bg-green-100">
        View Notices
      </button>


      <button className="p-4 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100">
        My Profile
      </button>


      <button className="p-4 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100">
        Hostel Details
      </button>


    </div>

  </div>


</div>

  </div>

</main>

    </div>
  );
}