import React from "react";
import DashboardCard from "../../components/studentAffairs/DashboardCard";

export default function Dashboard() {
  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Welcome Student Affairs Officer 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <DashboardCard
          title="Total Students"
          value="1250"
          color="bg-blue-600"
        />

        <DashboardCard
          title="Hostels"
          value="5"
          color="bg-green-600"
        />

        <DashboardCard
          title="Allocated"
          value="980"
          color="bg-purple-600"
        />

        <DashboardCard
          title="Pending"
          value="270"
          color="bg-red-500"
        />

      </div>

      <div className="bg-white rounded-xl shadow p-6 mt-8">

        <h2 className="text-xl font-bold mb-4">
          Recent Activities
        </h2>

        <ul className="space-y-3">

          <li>✔ Hostel list uploaded.</li>

          <li>✔ Student allocation completed.</li>

          <li>✔ New notification published.</li>

        </ul>

      </div>

    </div>
  );
}