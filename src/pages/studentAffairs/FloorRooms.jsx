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

  const rooms = floor.rooms || [];   // ===== FIXED: floor.room -> floor.rooms =====

  const mappedRooms = rooms.map((room) => ({
    id: room.id,
    number: room.roomNumber,
    capacity: room.capacity,
    occupied: room.currentOccupancy,
  }));

  const filteredRooms = mappedRooms.filter((room) =>   // ===== FIXED: rooms -> mappedRooms =====
    room.number.includes(search)
  );

  const viewRoom = (room) => {
    navigate(
      `/student-affairs/room/${room.id}`,
      { state: room }
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">
        {floor.floorName} Rooms
      </h1>

      <input
        type="text"
        placeholder="Search Room Number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-96 p-3 rounded-xl border mb-8"
      />

      {filteredRooms.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center text-gray-400">
          No rooms found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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