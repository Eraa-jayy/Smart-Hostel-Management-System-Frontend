import React from "react";

export default function DashboardCard({
  title,
  value,
  color,
}) {
  return (
    <div className={`rounded-2xl border border-gray-100 p-5 text-white ${color} hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300`}>
      <h2 className="text-sm">{title}</h2>
      <h1 className="text-3xl font-bold mt-3">
        {value}
      </h1>
    </div>
  );
}
