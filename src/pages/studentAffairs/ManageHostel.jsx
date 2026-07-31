import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHostelById } from "../../service/hostelService";
import {
  createBuilding,
  getAllBuildings,
  getBuildingById,
} from "../../service/buildingService";
import { Building2, Layers, DoorOpen, Users, Plus, X } from "lucide-react";

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

  const handleBuildingChange = (e) => {
    setBuildingData({
      ...buildingData,
      [e.target.name]: e.target.value,
    });
  };

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
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {hostel.hostelName}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Type: {hostel.hostelType} · Location: {hostel.location} · Capacity: {hostel.totalCapacity}
          </p>
        </div>

        <button
          onClick={() => setShowBuildingForm(true)}
          className="bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition flex items-center gap-2 text-sm font-semibold self-start"
        >
          <Plus size={16} />
          Create Building
        </button>
      </div>

      {/* BUILDING FORM */}
      {showBuildingForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Create New Building</h2>
            <button
              type="button"
              onClick={() => setShowBuildingForm(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleCreateBuilding}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                name="buildingName"
                placeholder="Building Name"
                value={buildingData.buildingName}
                onChange={handleBuildingChange}
                className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
              <input
                type="number"
                name="numberOfFloors"
                placeholder="Number of Floors"
                value={buildingData.numberOfFloors}
                onChange={handleBuildingChange}
                className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
              <input
                type="number"
                name="roomsPerFloor"
                placeholder="Rooms Per Floor"
                value={buildingData.roomsPerFloor}
                onChange={handleBuildingChange}
                className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
              <input
                type="number"
                name="roomCapacity"
                placeholder="Room Capacity"
                value={buildingData.roomCapacity}
                onChange={handleBuildingChange}
                className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-semibold text-sm"
              >
                Save Building
              </button>
              <button
                type="button"
                onClick={() => setShowBuildingForm(false)}
                className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition font-semibold text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BUILDING LIST */}
      <div>
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Buildings</h2>

        {buildings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
            No buildings found. Create one to get started.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {buildings.map((building) => {
              const stats = getBuildingStats(building);

              return (
                <div
                  key={building.id}
                  className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Building2 size={20} className="text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-white truncate">
                          {building.buildingName}
                        </h3>
                        <p className="text-white/70 text-xs">
                          {building.description || "Hostel Building"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <Layers size={16} className="mx-auto text-indigo-500 mb-1" />
                        <p className="text-lg font-bold text-gray-800">
                          {stats.floorsCount}
                        </p>
                        <p className="text-[10px] text-gray-400">Floors</p>
                      </div>

                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <DoorOpen size={16} className="mx-auto text-blue-500 mb-1" />
                        <p className="text-lg font-bold text-gray-800">
                          {stats.totalRooms}
                        </p>
                        <p className="text-[10px] text-gray-400">Rooms</p>
                      </div>

                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <Users size={16} className="mx-auto text-emerald-500 mb-1" />
                        <p className="text-lg font-bold text-gray-800">
                          {stats.totalCapacity}
                        </p>
                        <p className="text-[10px] text-gray-400">Capacity</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between py-1.5 border-b border-gray-50">
                        <span className="text-xs text-gray-400">Floors</span>
                        <span className="text-sm font-semibold text-gray-700">
                          {building.numberOfFloors || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-50">
                        <span className="text-xs text-gray-400">Rooms per Floor</span>
                        <span className="text-sm font-semibold text-gray-700">
                          {building.roomsPerFloor || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-50">
                        <span className="text-xs text-gray-400">Room Capacity</span>
                        <span className="text-sm font-semibold text-gray-700">
                          {building.roomCapacity || "-"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        navigate(`/student-affairs/building/${building.id}`);
                      }}
                      className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition font-semibold text-sm"
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
