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
  const [hostelOccupancy, setHostelOccupancy] = useState([]);
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
            return { ...detail.data, hostelId: b.hostelId };
          } catch {
            return b;
          }
        })
      );

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Student Affairs Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage university hostels and student allocations
          </p>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <Building2 className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{hostels.length}</p>
              <p className="text-xs text-gray-400">Hostels</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <Layers className="text-indigo-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{buildings.length}</p>
              <p className="text-xs text-gray-400">Buildings</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <DoorOpen className="text-emerald-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRooms}</p>
              <p className="text-xs text-gray-400">Rooms</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <Users className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeAllocations.length}</p>
              <p className="text-xs text-gray-400">Students Allocated</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <PieChart className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{occupancyPercent}%</p>
              <p className="text-xs text-gray-400">Occupancy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hostel-wise Occupancy Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">
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
      <h2 className="text-sm font-semibold text-gray-800">
        University Hostels
      </h2>

      {hostels.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          No hostels found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
