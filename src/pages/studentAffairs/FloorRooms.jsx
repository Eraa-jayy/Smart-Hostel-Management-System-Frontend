import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RoomCard from "../../components/studentAffairs/RoomCard";

const FloorRooms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  const floor = location.state;

  if (!floor) {
    return (
      <div className="p-10 text-center text-gray-400">
        Floor not found. Please navigate from building page
      </div>
    );
  }

  const rooms = floor.rooms || [];

  const mappedRooms = rooms.map((room) => ({
    id: room.id,
    number: room.roomNumber,
    capacity: room.capacity,
    occupied: room.currentOccupancy,
  }));

  const filteredRooms = mappedRooms.filter((room) =>
    room.number.includes(search)
  );

  const viewRoom = (room) => {
    navigate(
      `/student-affairs/room/${room.id}`,
      { state: room }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {floor.floorName} Rooms
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Floor {floor.floorNumber} · {floor.id}
          </p>
        </div>
        <input
          type="text"
          placeholder="Search Room Number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        />
      </div>

      {filteredRooms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          No rooms found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onView={viewRoom}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FloorRooms;
