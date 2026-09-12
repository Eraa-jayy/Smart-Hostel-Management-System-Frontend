import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  ClipboardList,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  Clock,
  Wrench,
} from "lucide-react";
import {
  getHostelConfig,
  getAllocations,
  getInventory,
} from "../../service/subWardenData";
import {
  getSubWardenComplaints,
  forwardComplaintToApi,
  declineComplaintToApi,
} from "../../service/complaintService";

export default function Dashboard() {
  const navigate = useNavigate();

  const [config, setConfig] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [inventory, setInventory] = useState({});
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setConfig(getHostelConfig());
    setAllocations(getAllocations());
    setInventory(getInventory());
    
    try {
      const data = await getSubWardenComplaints();
      setComplaints(data);
    } catch (e) {
      console.error("Failed to load complaints for dashboard", e);
    }
  };

  const handleForward = async (id) => {
    try {
      await forwardComplaintToApi(id);
      await loadData();
    } catch (e) {
      console.error("Failed to forward", e);
    }
  };

  const handleDecline = async (id) => {
    const confirm = window.confirm("Are you sure you want to decline this complaint?");
    if (confirm) {
      try {
        await declineComplaintToApi(id, "Declined from Dashboard");
        await loadData();
      } catch (e) {
        console.error("Failed to decline", e);
      }
    }
  };

  if (!config) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-lg font-semibold text-gray-500">
        Loading dashboard data...
      </div>
    );
  }

  // Calculate stats
  const totalRooms = config.floorsCount * config.roomsPerFloor;
  const maxCapacity = totalRooms * config.roomCapacity;
  const currentOccupied = allocations.length;
  const occupancyPercent = maxCapacity > 0 ? Math.round((currentOccupied / maxCapacity) * 100) : 0;

  // Inventory calculations
  let totalDamagedItems = 0;
  let totalInventoryCount = 0;
  const itemsStats = {
    beds: { count: 0, damaged: 0 },
    fans: { count: 0, damaged: 0 },
    bulbs: { count: 0, damaged: 0 },
    chairs: { count: 0, damaged: 0 },
    desks: { count: 0, damaged: 0 },
    cupboards: { count: 0, damaged: 0 },
    mattresses: { count: 0, damaged: 0 },
    bed_boards: { count: 0, damaged: 0 },
  };

  Object.values(inventory).forEach((roomInv) => {
    Object.keys(itemsStats).forEach((key) => {
      if (roomInv[key]) {
        itemsStats[key].count += roomInv[key].count || 0;
        itemsStats[key].damaged += roomInv[key].damaged || 0;
        totalDamagedItems += roomInv[key].damaged || 0;
        totalInventoryCount += roomInv[key].count || 0;
      }
    });
  });

  // Complaint stats
  const pendingComplaints = complaints.filter((c) => c.status === "PENDING");
  const inProgressComplaints = complaints.filter((c) => c.status === "FORWARDED" || c.status === "IN_PROGRESS");
  const resolvedComplaints = complaints.filter((c) => c.status === "RESOLVED");

  // Floor-wise Occupancy calculations
  const floorOccupancy = [];
  for (let f = 1; f <= config.floorsCount; f++) {
    const floorRooms = [];
    for (let r = 1; r <= config.roomsPerFloor; r++) {
      floorRooms.push(`${f}${r < 10 ? "0" + r : r}`);
    }
    const floorAllocated = allocations.filter((a) => floorRooms.includes(a.roomNo)).length;
    const floorMaxCapacity = config.roomsPerFloor * config.roomCapacity;
    const floorPercent = Math.round((floorAllocated / floorMaxCapacity) * 100);
    floorOccupancy.push({
      floor: f,
      name: `Floor ${f}`,
      allocated: floorAllocated,
      capacity: floorMaxCapacity,
      percent: floorPercent,
    });
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="relative bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-3xl p-6 md:p-8 text-white overflow-hidden shadow-xl shadow-indigo-950/20">
        <div className="relative z-10 max-w-xl">
          {/* <span className="bg-indigo-500/30 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Smart Hostel Administration
          </span> */}
          <h1 className="text-2xl md:text-3xl font-extrabold mt-3 tracking-tight">
            Welcome back, Sub Warden!
          </h1>
          <p className="text-sm text-indigo-100/80 mt-2 leading-relaxed">
            Monitor and allocate students to their rooms, review inventory checklists, and process maintenance complaints. Currently managing Block A.
          </p>
        </div>
        {/* Background shapes */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Rooms */}
        <div className="bg-white rounded-2xl border border-gray-150 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-indigo-100 transition-all duration-300">
          <div className="flex items-center gap-3.5">
            <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center text-indigo-600">
              <Building2 size={22} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Total Rooms</p>
              <h3 className="text-2xl font-bold text-gray-950 mt-0.5">{totalRooms}</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {config.floorsCount} floors · {config.roomsPerFloor} rooms/floor
              </p>
            </div>
          </div>
        </div>

        {/* Student Occupancy */}
        <div className="bg-white rounded-2xl border border-gray-150 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-emerald-100 transition-all duration-300">
          <div className="flex items-center gap-3.5">
            <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-600">
              <Users size={22} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Occupancy</p>
              <h3 className="text-2xl font-bold text-gray-950 mt-0.5">{occupancyPercent}%</h3>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                {currentOccupied} / {maxCapacity} beds filled
              </p>
            </div>
          </div>
        </div>

        {/* Inventory Damages */}
        <div className="bg-white rounded-2xl border border-gray-150 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-amber-100 transition-all duration-300">
          <div className="flex items-center gap-3.5">
            <div className="bg-amber-50 w-12 h-12 rounded-xl flex items-center justify-center text-amber-600">
              <ClipboardList size={22} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Damaged Items</p>
              <h3 className="text-2xl font-bold text-gray-950 mt-0.5">{totalDamagedItems}</h3>
              <p className="text-[11px] text-amber-600/90 font-medium mt-0.5">
                Requires maintenance review
              </p>
            </div>
          </div>
        </div>

        {/* Pending Complaints */}
        <div className="bg-white rounded-2xl border border-gray-150 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-red-100 transition-all duration-300">
          <div className="flex items-center gap-3.5">
            <div className="bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center text-red-600">
              <AlertTriangle size={22} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Pending Issues</p>
              <h3 className="text-2xl font-bold text-gray-950 mt-0.5">{pendingComplaints.length}</h3>
              <p className="text-[11px] text-red-600/90 font-medium mt-0.5">
                {inProgressComplaints.length} forwarded · {resolvedComplaints.length} solved
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Floor-wise Occupancy (Left / 2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Occupancy card */}
          <div className="bg-white rounded-2xl border border-gray-150 p-5">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-sm font-bold text-gray-800">Floor-wise Bed Occupancy</h2>
                <p className="text-xs text-gray-400">Total rooms and current capacities per floor</p>
              </div>
              <button
                onClick={() => navigate("/subwarden/allocations")}
                className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:underline"
              >
                Go to allocations
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="space-y-4">
              {floorOccupancy.map((floor) => (
                <div key={floor.floor} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-700">{floor.name}</span>
                    <span className="text-gray-500">
                      {floor.allocated} / {floor.capacity} beds ({floor.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        floor.percent >= 90
                          ? "bg-red-500"
                          : floor.percent >= 70
                          ? "bg-amber-500"
                          : "bg-indigo-600"
                      }`}
                      style={{ width: `${floor.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Complaints Dashboard actions */}
          <div className="bg-white rounded-2xl border border-gray-150 p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-sm font-bold text-gray-800">Pending Complaints</h2>
                <p className="text-xs text-gray-400">Review, forward, or decline maintenance reports</p>
              </div>
              <button
                onClick={() => navigate("/subwarden/complaints")}
                className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:underline"
              >
                View all complaints
                <ArrowRight size={13} />
              </button>
            </div>

            {pendingComplaints.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed text-gray-400">
                <CheckCircle className="text-emerald-500 mx-auto mb-2" size={24} />
                <p className="text-xs font-medium">All student complaints have been reviewed!</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {pendingComplaints.slice(0, 3).map((comp) => (
                  <div
                    key={comp.id}
                    className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-gray-800">{comp.title}</h4>
                      </div>
                      <p className="text-xs text-gray-400">
                        Room {comp.roomNo} · Raised by {comp.studentName} on {comp.date}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1 italic">{comp.description}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => handleDecline(comp.id)}
                        className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-white hover:text-red-600 transition"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleForward(comp.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-sm flex items-center gap-1 transition"
                      >
                        <Wrench size={12} />
                        Forward to Maintenance
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Inventory Status (Right Column) */}
        <div className="bg-white rounded-2xl border border-gray-150 p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-800">Inventory Condition</h2>
              <p className="text-xs text-gray-400">Asset counts and damage summary</p>
            </div>
            <button
              onClick={() => navigate("/subwarden/inventory")}
              className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:underline"
            >
              Manage
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="flex-1 space-y-3.5">
            {[
              { key: "beds", name: "Beds" },
              { key: "fans", name: "Fans" },
              { key: "bulbs", name: "Bulbs" },
              { key: "chairs", name: "Chairs" },
              { key: "desks", name: "Desks" },
              { key: "cupboards", name: "Cupboards" },
              { key: "mattresses", name: "Mattresses" },
              { key: "bed_boards", name: "Bed Boards" },
            ].map(({ key, name }) => {
              const stat = itemsStats[key];
              const isDamaged = stat.damaged > 0;
              return (
                <div
                  key={key}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                    isDamaged ? "bg-amber-50/50 border-amber-100" : "bg-gray-50/50 border-gray-100"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-gray-800">{name}</p>
                    <p className="text-[10px] text-gray-400">Total: {stat.count} units</p>
                  </div>
                  <div className="text-right">
                    {isDamaged ? (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <ShieldAlert size={10} />
                        {stat.damaged} Damaged
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        All OK
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
