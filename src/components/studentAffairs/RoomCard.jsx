import React from "react";
import { DoorOpen, Users } from "lucide-react";

const RoomCard = ({ room, onView }) => {
  const available = room.capacity > room.occupied;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${available ? "bg-blue-50" : "bg-red-50"}`}>
          <DoorOpen className={available ? "text-blue-600" : "text-red-500"} size={20} />
        </div>
        <h2 className="text-base font-bold text-gray-800">
          Room {room.number}
        </h2>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between py-2 border-b border-gray-50">
          <span className="text-xs text-gray-400">Capacity</span>
          <span className="text-sm font-semibold text-gray-700">{room.capacity}</span>
        </div>

        <div className="flex justify-between py-2 border-b border-gray-50">
          <span className="flex gap-2 items-center text-xs text-gray-400">
            <Users size={14} />
            Occupied
          </span>
          <span className="text-sm font-semibold text-gray-700">{room.occupied}</span>
        </div>
      </div>

      <div className="mt-4">
        {available ? (
          <span className="bg-emerald-50 text-emerald-600 text-[11px] font-semibold px-2.5 py-1 rounded-full">
            Available
          </span>
        ) : (
          <span className="bg-red-50 text-red-500 text-[11px] font-semibold px-2.5 py-1 rounded-full">
            Full
          </span>
        )}
      </div>

      <button
        onClick={() => onView(room)}
        className="mt-5 w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition font-semibold text-sm"
      >
        View Room
      </button>
    </div>
  );
};

export default RoomCard;
