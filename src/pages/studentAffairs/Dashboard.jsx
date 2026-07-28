import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HostelCard from "../../components/studentAffairs/HostelCard";
import { getAllHostels } from "../../service/hostelService";
import { getAllBuildings, getBuildingById } from "../../service/buildingService";
import { getAllAllocations } from "../../service/studentAllocationService";
import { Building2, Layers, DoorOpen, Users, PieChart } from "lucide-react";

const StudentAffairsDashboard = () => {
  const navigate = useNavigate();

  const [hostels, setHostels] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [hostelOccupancy, setHostelOccupancy] = useState([]);   // ===== NEW =====
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalCapacity: 0,
    totalOccupied: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [hostelsRes, buildingsRes, allocationsRes] = await Promise.all([
        getAllHostels(),
        getAllBuildings(),
        getAllAllocations(),
      ]);

      setHostels(hostelsRes.data);
      setBuildings(buildingsRes.data);
      setAllocations(allocationsRes.data);

      const buildingDetails = await Promise.all(
        buildingsRes.data.map(async (b) => {
          try {
            const detail = await getBuildingById(b.id);
            return { ...detail.data, hostelId: b.hostelId };   // hostelId eka save karagannawa
          } catch {
            return b;
          }
        })
      );

      // Overall stats
      let totalRooms = 0;
      let totalCapacity = 0;
      let totalOccupied = 0;

      buildingDetails.forEach((building) => {
        const floors = building.floors || [];
        floors.forEach((floor) => {
          const rooms = floor.rooms || [];
          totalRooms += rooms.length;
          rooms.forEach((room) => {
            totalCapacity += room.capacity || 0;
            totalOccupied += room.currentOccupancy || 0;
          });
        });
      });

      setStats({ totalRooms, totalCapacity, totalOccupied });

      // ===== NEW: Hostel-wise occupancy calculate karanawa =====
      const occupancyData = hostelsRes.data.map((hostel) => {
        const hostelBuildings = buildingDetails.filter(
          (b) => Number(b.hostelId) === Number(hostel.id)
        );

        let capacity = 0;
        let occupied = 0;

        hostelBuildings.forEach((building) => {
          const floors = building.floors || [];
          floors.forEach((floor) => {
            const rooms = floor.rooms || [];
            rooms.forEach((room) => {
              capacity += room.capacity || 0;
              occupied += room.currentOccupancy || 0;
            });
          });
        });

        const percent = capacity > 0 ? Math.round((occupied / capacity) * 100) : 0;

        return {
          id: hostel.id,
          name: hostel.hostelName,
          capacity,
          occupied,
          percent,
        };
      });

      setHostelOccupancy(occupancyData);

    } catch (error) {
      console.error("Error loading dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewHostel = (hostel) => {
    navigate(`/student-affairs/manage-hostel/${hostel.id}`, {
      state: hostel,
    });
  };

  const activeAllocations = allocations.filter((a) => a.status === "ACTIVE");
  const occupancyPercent =
    stats.totalCapacity > 0
      ? Math.round((stats.totalOccupied / stats.totalCapacity) * 100)
      : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-bold">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Student Affairs Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Manage university hostels and student allocations
        </p>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-10">
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Building2 className="text-blue-600" size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold">{hostels.length}</p>
            <p className="text-xs text-gray-500">Hostels</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
          <div className="bg-indigo-100 p-3 rounded-lg">
            <Layers className="text-indigo-600" size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold">{buildings.length}</p>
            <p className="text-xs text-gray-500">Buildings</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
          <div className="bg-green-100 p-3 rounded-lg">
            <DoorOpen className="text-green-600" size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.totalRooms}</p>
            <p className="text-xs text-gray-500">Rooms</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
          <div className="bg-orange-100 p-3 rounded-lg">
            <Users className="text-orange-600" size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold">{activeAllocations.length}</p>
            <p className="text-xs text-gray-500">Students Allocated</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
          <div className="bg-purple-100 p-3 rounded-lg">
            <PieChart className="text-purple-600" size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold">{occupancyPercent}%</p>
            <p className="text-xs text-gray-500">Occupancy</p>
          </div>
        </div>
      </div>

      {/* ===== NEW: Hostel-wise Occupancy Chart ===== */}
      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          Hostel-wise Occupancy
        </h2>

        {hostelOccupancy.length === 0 ? (
          <p className="text-gray-400 text-center py-5">No data available</p>
        ) : (
          <div className="space-y-5">
            {hostelOccupancy.map((h) => (
              <div key={h.id}>
                <div className="flex justify-between mb-1.5 text-sm">
                  <span className="font-semibold text-gray-700">{h.name}</span>
                  <span className="text-gray-500">
                    {h.occupied} / {h.capacity} ({h.percent}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      h.percent >= 90
                        ? "bg-red-500"
                        : h.percent >= 70
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${h.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hostel Cards */}
      <h2 className="text-xl font-semibold mb-5 text-gray-700">
        University Hostels
      </h2>

      {hostels.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center text-gray-400">
          No hostels found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {hostels.map((hostel) => (
            <HostelCard
              key={hostel.id}
              hostel={hostel}
              onView={handleViewHostel}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAffairsDashboard;