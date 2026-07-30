import React from "react";
import { Layers, DoorOpen } from "lucide-react";

const FloorCard = ({ floor, onView }) => {
  const roomsCount = floor.rooms ? floor.rooms.length : 0;
  const totalCapacity = floor.rooms
    ? floor.rooms.reduce((sum, room) => sum + (room.capacity || 0), 0)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-indigo-50 w-11 h-11 rounded-xl flex items-center justify-center">
          <Layers className="text-indigo-600" size={22} />
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800">
            Floor {floor.floorNumber}
          </h2>
          <p className="text-xs text-gray-400">
            Hostel Floor
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between py-2 border-b border-gray-50">
          <span className="flex gap-2 items-center text-xs text-gray-400">
            <DoorOpen size={14} />
            Rooms
          </span>
          <span className="text-sm font-semibold text-gray-700">
            {roomsCount}
          </span>
        </div>

        <div className="flex justify-between py-2 border-b border-gray-50">
          <span className="text-xs text-gray-400">Capacity</span>
          <span className="text-sm font-semibold text-gray-700">
            {totalCapacity}
          </span>
        </div>
      </div>

      <button
        onClick={() => onView(floor)}
        className="mt-5 w-full bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 transition font-semibold text-sm"
      >
        View Rooms
      </button>
    </div>
  );
};

export default FloorCard;
