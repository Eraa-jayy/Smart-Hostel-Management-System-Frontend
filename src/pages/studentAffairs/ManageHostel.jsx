import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHostelById } from "../../service/hostelService";
import {
  createBuilding,
  getAllBuildings,
  getBuildingById,
} from "../../service/buildingService";
import { Building2, Layers, DoorOpen, Users, Plus } from "lucide-react";

export default function ManageHostel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hostel, setHostel] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [showBuildingForm, setShowBuildingForm] = useState(false);
  const [buildingData, setBuildingData] = useState({
    buildingName: "",
    numberOfFloors: "",
    roomsPerFloor: "",
    roomCapacity: "",
  });

  // ==========================
  // LOAD DATA
  // ==========================

  useEffect(() => {
    loadHostel();
    loadBuildings();
  }, []);

  const loadHostel = async () => {
    try {
      const response = await getHostelById(id);
      setHostel(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadBuildings = async () => {
    try {
      const response = await getAllBuildings();
      const hostelBuildings = response.data.filter(
        (building) => Number(building.hostelId) === Number(id)
      );

      const detailedBuildings = await Promise.all(
        hostelBuildings.map(async (b) => {
          try {
            const detailResponse = await getBuildingById(b.id);
            return detailResponse.data;
          } catch {
            return b;
          }
        })
      );

      setBuildings(detailedBuildings);
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // INPUT CHANGE
  // ==========================

  const handleBuildingChange = (e) => {
    setBuildingData({
      ...buildingData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // CREATE BUILDING
  // ==========================

  const handleCreateBuilding = async (e) => {
    e.preventDefault();

    try {
      const data = {
        buildingName: buildingData.buildingName,
        hostelId: Number(id),
        numberOfFloors: Number(buildingData.numberOfFloors),
        roomsPerFloor: Number(buildingData.roomsPerFloor),
        roomCapacity: Number(buildingData.roomCapacity),
      };

      await createBuilding(data);
      alert("Building created successfully");
      loadBuildings();
      setBuildingData({
        buildingName: "",
        numberOfFloors: "",
        roomsPerFloor: "",
        roomCapacity: "",
      });
      setShowBuildingForm(false);
    } catch (error) {
      console.log(error);
      alert("Building creation failed");
    }
  };

  // ==========================
  // HELPER: Get building stats
  // ==========================

  const getBuildingStats = (building) => {
    const floorsFromApi = building.floors || [];
    const floorsCount = floorsFromApi.length || Number(building.numberOfFloors) || 0;

    const totalRooms = floorsFromApi.length > 0
      ? floorsFromApi.reduce(
          (total, floor) => total + (floor.rooms ? floor.rooms.length : 0),
          0
        )
      : (Number(building.numberOfFloors) || 0) * (Number(building.roomsPerFloor) || 0);

    const totalCapacity = floorsFromApi.length > 0
      ? floorsFromApi.reduce(
          (total, floor) =>
            total + (floor.rooms
              ? floor.rooms.reduce((roomTotal, room) => roomTotal + (room.capacity || 0), 0)
              : 0),
          0
        )
      : totalRooms * (Number(building.roomCapacity) || 0);

    return { floorsCount, totalRooms, totalCapacity };
  };

  if (!hostel) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {hostel.hostelName}
          </h1>
          <p className="mt-2">
            Type: {hostel.hostelType}
          </p>
          <p>
            Location: {hostel.location}
          </p>
          <p>
            Capacity: {hostel.totalCapacity}
          </p>
        </div>

        <button
          onClick={() => setShowBuildingForm(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow flex items-center gap-2"
        >
          <Plus size={18} />
          Create Building
        </button>
      </div>

      {/* BUILDING FORM */}
      {showBuildingForm && (
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-bold mb-5">
            Create New Building
          </h2>

          <form onSubmit={handleCreateBuilding}>
            <input
              name="buildingName"
              placeholder="Building Name"
              value={buildingData.buildingName}
              onChange={handleBuildingChange}
              className="border p-3 rounded w-full mb-3"
            />

            <input
              type="number"
              name="numberOfFloors"
              placeholder="Number of Floors"
              value={buildingData.numberOfFloors}
              onChange={handleBuildingChange}
              className="border p-3 rounded w-full mb-3"
            />

            <input
              type="number"
              name="roomsPerFloor"
              placeholder="Rooms Per Floor"
              value={buildingData.roomsPerFloor}
              onChange={handleBuildingChange}
              className="border p-3 rounded w-full mb-3"
            />

            <input
              type="number"
              name="roomCapacity"
              placeholder="Room Capacity"
              value={buildingData.roomCapacity}
              onChange={handleBuildingChange}
              className="border p-3 rounded w-full mb-3"
            />

            <button className="bg-blue-600 text-white px-5 py-3 rounded-lg">
              Save Building
            </button>
          </form>
        </div>
      )}

      {/* BUILDING LIST */}
      <div>
        <h2 className="text-2xl font-bold mb-5">
          Buildings
        </h2>

        {buildings.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center text-gray-400">
            No buildings found. Create one to get started.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {buildings.map((building) => {
              const stats = getBuildingStats(building);

              return (
                <div
                  key={building.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Building2 size={22} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {building.buildingName}
                        </h3>
                        <p className="text-white/70 text-sm">
                          {building.description || "Hostel Building"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Layers size={18} className="mx-auto text-indigo-500 mb-1" />
                        <p className="text-lg font-bold text-gray-800">
                          {stats.floorsCount}
                        </p>
                        <p className="text-[11px] text-gray-400">Floors</p>
                      </div>

                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <DoorOpen size={18} className="mx-auto text-blue-500 mb-1" />
                        <p className="text-lg font-bold text-gray-800">
                          {stats.totalRooms}
                        </p>
                        <p className="text-[11px] text-gray-400">Rooms</p>
                      </div>

                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Users size={18} className="mx-auto text-emerald-500 mb-1" />
                        <p className="text-lg font-bold text-gray-800">
                          {stats.totalCapacity}
                        </p>
                        <p className="text-[11px] text-gray-400">Capacity</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm mb-5">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Floors</span>
                        <span className="font-semibold">
                          {building.numberOfFloors || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Rooms per Floor</span>
                        <span className="font-semibold">
                          {building.roomsPerFloor || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Room Capacity</span>
                        <span className="font-semibold">
                          {building.roomCapacity || "-"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        navigate(`/student-affairs/building/${building.id}`);
                      }}
                      className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      View Building
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
