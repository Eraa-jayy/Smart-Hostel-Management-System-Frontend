import React from "react";

export default function Complaints() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800">
        Complaints
      </h1>

      <p className="text-gray-500 mt-2">
        Submit and track your hostel complaints.
      </p>

      {/* Complaint Form */}
      <div className="bg-white rounded-xl shadow mt-8 p-8">

        <h2 className="text-2xl font-semibold mb-6">
          Submit New Complaint
        </h2>

        {/* Complaint Title */}
        <div className="mb-5">
          <label className="block mb-2 font-medium text-gray-700">
            Complaint Title
          </label>

          <input
            type="text"
            placeholder="Enter complaint title"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Category */}
        <div className="mb-5">
          <label className="block mb-2 font-medium text-gray-700">
            Category
          </label>

          <select className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none">
            <option>Select Category</option>
            <option>Electrical</option>
            <option>Plumbing</option>
            <option>Furniture</option>
            <option>Internet / Wi-Fi</option>
            <option>Cleanliness</option>
            <option>Security</option>
            <option>Other</option>
          </select>
        </div>

        {/* Priority */}
        <div className="mb-5">
          <label className="block mb-3 font-medium text-gray-700">
            Priority
          </label>

          <div className="flex gap-6">

            <label className="flex items-center gap-2">
              <input type="radio" name="priority" />
              Low
            </label>

            <label className="flex items-center gap-2">
              <input type="radio" name="priority" />
              Medium
            </label>

            <label className="flex items-center gap-2">
              <input type="radio" name="priority" />
              High
            </label>

          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Description
          </label>

          <textarea
            rows="5"
            placeholder="Describe your complaint..."
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">

          <button
            className="px-6 py-3 rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            Clear
          </button>

          <button
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Submit Complaint
          </button>

        </div>

      </div>

      {/* Complaint History */}
      <div className="bg-white rounded-xl shadow mt-10 p-8">

        <h2 className="text-2xl font-semibold mb-6">
          My Complaints
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full border-collapse">

            <thead>

              <tr className="bg-gray-100">

                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Priority</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Date</th>

              </tr>

            </thead>

            <tbody>

              <tr className="border-b">
                <td className="p-3">Broken Chair</td>
                <td className="p-3">Furniture</td>
                <td className="p-3">Low</td>
                <td className="p-3">
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                    Pending
                  </span>
                </td>
                <td className="p-3">12 Jul 2026</td>
              </tr>

              <tr className="border-b">
                <td className="p-3">Water Leakage</td>
                <td className="p-3">Plumbing</td>
                <td className="p-3">High</td>
                <td className="p-3">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    In Progress
                  </span>
                </td>
                <td className="p-3">10 Jul 2026</td>
              </tr>

              <tr>
                <td className="p-3">Fan Not Working</td>
                <td className="p-3">Electrical</td>
                <td className="p-3">Medium</td>
                <td className="p-3">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Completed
                  </span>
                </td>
                <td className="p-3">08 Jul 2026</td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}