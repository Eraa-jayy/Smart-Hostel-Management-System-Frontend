import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBuildingById } from "../../service/buildingService";
import FloorCard from "../../components/studentAffairs/FloorCard";

const BuildingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [building, setBuilding] = useState(null);

  useEffect(() => {
    const loadBuilding = async () => {
      try {
        const response = await getBuildingById(id);
        setBuilding(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    loadBuilding();
  }, [id]);

  const handleFloorView = (floor) => {
    navigate(
      `/student-affairs/floor/${floor.id}`,
      { state: floor }
    );
  };

  if (!building) {
    return (
      <div className="p-10 text-gray-400">
        Building not found
      </div>
    );
  }

  const floors = building.floors ? building.floors : [];

  const totalRooms = floors.reduce(
    (total, floor) =>
      total + (floor.rooms ? floor.rooms.length : 0),
    0
  );

  const totalCapacity = floors.reduce(
    (total, floor) =>
      total + (floor.rooms
        ? floor.rooms.reduce((roomTotal, room) => roomTotal + room.capacity, 0)
        : 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Building Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h1 className="text-2xl font-bold text-gray-900">
          {building.buildingName}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-5">
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400">Floors</p>
            <h3 className="text-lg font-bold text-gray-800">{floors.length}</h3>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400">Rooms</p>
            <h3 className="text-lg font-bold text-gray-800">{totalRooms}</h3>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400">Capacity</p>
            <h3 className="text-lg font-bold text-gray-800">{totalCapacity}</h3>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400">Hostel ID</p>
            <h3 className="text-lg font-bold text-gray-800">{building.hostelId}</h3>
          </div>
        </div>
      </div>

      {/* Floors */}
      <h2 className="text-sm font-semibold text-gray-800">
        Building Floors
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {floors.map((floor) => (
          <FloorCard
            key={floor.id}
            floor={floor}
            onView={handleFloorView}
          />
        ))}
      </div>
    </div>
  );
};

export default BuildingDetails;
