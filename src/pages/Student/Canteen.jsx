import React from "react";

export default function Canteen() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Canteen
        </h1>

        <p className="text-gray-500 mt-2">
          Today's meal menu published by the canteen.
        </p>
      </div>

      {/* Today's Menu */}
      <div className="bg-white rounded-xl shadow p-8">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-semibold">
            🍽 Today's Menu
          </h2>

          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
            13 July 2026
          </span>

        </div>

        {/* Breakfast */}
        <div className="mb-8">

          <div className="flex items-center justify-between">

            <h3 className="text-xl font-semibold">
              🌅 Breakfast
            </h3>

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              Available
            </span>

          </div>

          <ul className="list-disc ml-8 mt-4 space-y-2 text-gray-700">
            <li>Milk Rice</li>
            <li>Lunu Miris</li>
            <li>Tea</li>
          </ul>

        </div>

        {/* Lunch */}
        <div className="mb-8">

          <div className="flex items-center justify-between">

            <h3 className="text-xl font-semibold">
              ☀️ Lunch
            </h3>

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              Available
            </span>

          </div>

          <ul className="list-disc ml-8 mt-4 space-y-2 text-gray-700">
            <li>Rice</li>
            <li>Chicken Curry</li>
            <li>Dhal Curry</li>
            <li>Papadam</li>
            <li>Salad</li>
          </ul>

        </div>

        {/* Dinner */}
        <div>

          <div className="flex items-center justify-between">

            <h3 className="text-xl font-semibold">
              🌙 Dinner
            </h3>

            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
              Not Published
            </span>

          </div>

          <p className="mt-4 text-gray-500">
            Today's dinner menu has not been published yet.
          </p>

        </div>

      </div>

      {/* Meal Times */}
      <div className="bg-white rounded-xl shadow mt-8 p-8">

        <h2 className="text-2xl font-semibold mb-6">
          Meal Times
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-gray-50 rounded-lg p-5">

            <h3 className="font-semibold text-lg">
              🌅 Breakfast
            </h3>

            <p className="text-gray-600 mt-2">
              7.00 AM - 9.00 AM
            </p>

          </div>

          <div className="bg-gray-50 rounded-lg p-5">

            <h3 className="font-semibold text-lg">
              ☀️ Lunch
            </h3>

            <p className="text-gray-600 mt-2">
              12.00 PM - 2.00 PM
            </p>

          </div>

          <div className="bg-gray-50 rounded-lg p-5">

            <h3 className="font-semibold text-lg">
              🌙 Dinner
            </h3>

            <p className="text-gray-600 mt-2">
              6.00 PM - 8.00 PM
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}