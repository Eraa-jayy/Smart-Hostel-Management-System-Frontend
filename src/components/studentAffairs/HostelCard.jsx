import React from "react";
import { Building2, Users, Trash2 } from "lucide-react";

const HostelCard = ({ hostel, onView, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">
      {/* Hostel Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-blue-50 w-11 h-11 rounded-xl flex items-center justify-center">
          <Building2 className="text-blue-600" size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-gray-800 truncate">
            {hostel.hostelName}
          </h2>
          <p className="text-xs text-gray-400">
            {hostel.hostelType} · {hostel.location}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <div className="flex gap-2 items-center text-xs text-gray-400">
            <Users size={14} />
            Total Capacity
          </div>
          <span className="text-sm font-semibold text-gray-700">{hostel.totalCapacity}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-5">
        <button
          onClick={() => onView(hostel)}
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition font-semibold text-sm"
        >
          View Hostel
        </button>

        {onDelete && (
          <button
            onClick={() => onDelete(hostel.id)}
            className="bg-red-500 text-white px-4 py-2.5 rounded-xl hover:bg-red-600 transition"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default HostelCard;
