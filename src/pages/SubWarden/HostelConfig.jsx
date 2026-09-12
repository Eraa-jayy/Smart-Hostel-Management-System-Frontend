import React, { useState, useEffect } from "react";
import {
  Settings,
  Building,
  Layers,
  DoorOpen,
  Users,
  Save,
  RotateCcw,
  Sliders,
  CheckCircle,
} from "lucide-react";
import {
  getHostelConfig,
  updateHostelConfig,
} from "../../service/subWardenData";

export default function HostelConfig() {
  const [config, setConfig] = useState({
    blocksCount: 1,
    floorsCount: 4,
    roomsPerFloor: 28,
    roomCapacity: 4,
  });

  const [initialConfig, setInitialConfig] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    const active = getHostelConfig();
    setConfig(active);
    setInitialConfig(active);
    setIsSaved(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig({
      ...config,
      [name]: Math.max(1, parseInt(value) || 0),
    });
  };

  const handleReset = () => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const confirm = window.confirm(
      "Warning: Updating the hostel layout configuration will adjust room indexes and inventory lists. Do you wish to continue?"
    );
    if (!confirm) return;

    updateHostelConfig(config);
    setInitialConfig(config);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    alert("Hostel configuration updated successfully!");
  };

  // Dynamic calculations
  const totalFloors = config.blocksCount * config.floorsCount;
  const totalRooms = totalFloors * config.roomsPerFloor;
  const totalBeds = totalRooms * config.roomCapacity;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hostel Configuration</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Edit and adjust the physical structure layout of the hostel (blocks, floors, rooms, capacity parameters).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form (Left - 2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-150 p-6">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sliders size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800">Structure Parameters</h2>
              <p className="text-xs text-gray-400">Configure building details</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Number of Blocks */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Number of Blocks (Buildings)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="blocksCount"
                    value={config.blocksCount}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                  <Building size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Number of Floors per Block */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Number of Floors per Block
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="floorsCount"
                    value={config.floorsCount}
                    onChange={handleChange}
                    min="1"
                    max="15"
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                  <Layers size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Number of Rooms per Floor */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Rooms per Floor
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="roomsPerFloor"
                    value={config.roomsPerFloor}
                    onChange={handleChange}
                    min="1"
                    max="100"
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                  <DoorOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Room Capacity */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Beds per Room (Students per Room)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="roomCapacity"
                    value={config.roomCapacity}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                  <Users size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Actions button */}
            <div className="flex gap-3 pt-3 border-t border-gray-50 justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition flex items-center gap-1.5"
              >
                <RotateCcw size={13} />
                Reset Changes
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 flex items-center gap-1.5 transition"
              >
                {isSaved ? <CheckCircle size={14} /> : <Save size={14} />}
                {isSaved ? "Saved Successfully" : "Save Configurations"}
              </button>
            </div>
          </form>
        </div>

        {/* Dynamic Capacity Forecast (Right Column) */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl shadow-indigo-950/20 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-tight">Capacity Forecast</h2>
            <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
              Based on the parameters on the left, here is a preview of the scale of the hostel system:
            </p>

            <div className="space-y-4 mt-6">
              {[
                { label: "Total Blocks", value: config.blocksCount, icon: Building },
                { label: "Total Floors", value: totalFloors, icon: Layers },
                { label: "Total Rooms", value: totalRooms, icon: DoorOpen },
                { label: "Total Bed Capacity", value: totalBeds, icon: Users },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3.5 bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-indigo-300">
                    <Icon size={15} />
                  </div>
                  <div>
                    <p className="text-[10px] text-indigo-200 font-semibold uppercase tracking-wider">{label}</p>
                    <h3 className="text-lg font-bold mt-0.5">{value}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/5 text-[11px] text-indigo-200/70 leading-relaxed italic">
            * Note: If you decrease floor or room count below current allocated index, some students may be unallocated or inventory deleted. Ensure you clear rooms before shrinking layout configurations.
          </div>
        </div>
      </div>
    </div>
  );
}
