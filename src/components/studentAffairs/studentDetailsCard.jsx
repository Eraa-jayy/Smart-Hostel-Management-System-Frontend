import React from "react";
import { X } from "lucide-react";

export default function StudentDetails({ student, close }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[450px] p-6 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">
            Student Details
          </h2>
          <button
            onClick={close}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {[
            { label: "Student ID", value: student.id },
            { label: "Name", value: student.name },
            { label: "Faculty", value: student.faculty },
            { label: "Year", value: student.year },
            { label: "Email", value: student.email },
            { label: "Phone", value: student.phone },
            { label: "Hostel", value: student.hostel },
            { label: "Room", value: student.room },
            { label: "Status", value: student.status },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-xs text-gray-400">{label}</span>
              <span className="text-sm font-medium text-gray-700">{value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={close}
          className="mt-6 w-full bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition font-semibold text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}
