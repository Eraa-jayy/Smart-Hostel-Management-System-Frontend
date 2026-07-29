import React from "react";
import { Building2, Users, DoorOpen, Layers, Trash2 } from "lucide-react";

const HostelCard = ({ hostel, onView, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      {/* Hostel Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-blue-100 p-3 rounded-xl">
          <Building2 className="text-blue-600" size={30} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {hostel.hostelName}
          </h2>
          <p className="text-sm text-gray-500">
            {hostel.hostelType} · {hostel.location}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center text-gray-600">
            <Users size={18} />
            Total Capacity
          </div>
          <span className="font-semibold">{hostel.totalCapacity}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={() => onView(hostel)}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
        >
          View Hostel
        </button>

        <button
          onClick={() => onDelete(hostel.id)}
          className="bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default HostelCard;