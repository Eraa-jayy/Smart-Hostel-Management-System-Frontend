import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Search,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  X,
  Edit3,
  Lightbulb,
  Fan,
  Bed,
  Armchair,
  FolderOpen,
} from "lucide-react";
import {
  getHostelConfig,
  getInventory,
  updateRoomInventory,
} from "../../service/subWardenData";

const ITEM_TYPES = [
  { key: "beds", name: "Beds", icon: Bed },
  { key: "fans", name: "Fans", icon: Fan },
  { key: "bulbs", name: "Bulbs", icon: Lightbulb },
  { key: "chairs", name: "Chairs", icon: Armchair },
  { key: "desks", name: "Desks", icon: FolderOpen },
  { key: "cupboards", name: "Cupboards", icon: FolderOpen },
  { key: "mattresses", name: "Mattresses", icon: Bed },
  { key: "bed_boards", name: "Bed Boards", icon: Bed },
];

export default function InventoryManagement() {
  const [config, setConfig] = useState(null);
  const [inventory, setInventory] = useState({});

  // Filters
  const [selectedFloor, setSelectedFloor] = useState("ALL");
  const [selectedItemType, setSelectedItemType] = useState("ALL");
  const [roomSearch, setRoomSearch] = useState("");
  const [filterCondition, setFilterCondition] = useState("ALL"); // ALL, DAMAGED, OK

  // Edit Modal State
  const [editingRoom, setEditingRoom] = useState(null);
  const [editValues, setEditValues] = useState({}); // Stores working/damaged counts for items
  const [bulkEditItem, setBulkEditItem] = useState(null);
  const [bulkEditValue, setBulkEditValue] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setConfig(getHostelConfig());
    setInventory(getInventory());
  };

  const handleOpenEdit = (roomNo, roomInv) => {
    setEditingRoom(roomNo);
    const initialValues = {};
    ITEM_TYPES.forEach(({ key }) => {
      const item = roomInv[key] || { working: 0, damaged: 0, count: 0 };

      initialValues[key] = {
        working: Number(item.working || 0),
        damaged: Number(item.damaged || 0),
      };
    });
    setEditValues(initialValues);
  };

  const handleCloseEdit = () => {
    setEditingRoom(null);
    setEditValues({});
  };

  const handleCloseBulkEdit = () => {
    setBulkEditItem(null);
    setBulkEditValue(0);
  };

  const handleCountChange = (itemKey, countType, value) => {
    const current = editValues[itemKey] || { working: 0, damaged: 0 };
    const val = Math.max(0, parseInt(value) || 0);

    setEditValues({
      ...editValues,
      [itemKey]: {
        ...current,
        [countType]: val,
      },
    });
  };

  const handleOpenBulkEdit = (itemKey) => {
    const itemConfig = ITEM_TYPES.find((item) => item.key === itemKey);
    if (!itemConfig) return;

    const hostelTotal = Object.values(inventory).reduce((total, roomInv) => {
      const item = roomInv[itemKey] || { count: 0 };
      return total + Number(item.count || 0);
    }, 0);

    setBulkEditItem({ key: itemKey, name: itemConfig.name });
    setBulkEditValue(hostelTotal);
  };

  const handleBulkEditSave = () => {
    if (!bulkEditItem) return;

    const targetTotal = Math.max(0, Number(bulkEditValue) || 0);
    const roomNumbers = Object.keys(inventory);
    const updatedInventory = { ...inventory };

    if (roomNumbers.length === 0) {
      handleCloseBulkEdit();
      return;
    }

    const basePerRoom = Math.floor(targetTotal / roomNumbers.length);
    const remainder = targetTotal % roomNumbers.length;

    roomNumbers.forEach((roomNo, index) => {
      const currentItem = updatedInventory[roomNo][bulkEditItem.key] || { count: 0, working: 0, damaged: 0 };
      const perRoomCount = basePerRoom + (index < remainder ? 1 : 0);
      const damaged = Math.min(Number(currentItem.damaged || 0), perRoomCount);
      const working = Math.max(0, perRoomCount - damaged);

      updatedInventory[roomNo][bulkEditItem.key] = {
        ...currentItem,
        count: perRoomCount,
        working,
        damaged,
      };
    });

    localStorage.setItem("sw_inventory", JSON.stringify(updatedInventory));
    setInventory(updatedInventory);
    handleCloseBulkEdit();
  };

  const handleSaveInventory = (e) => {
    e.preventDefault();
    Object.keys(editValues).forEach((itemKey) => {
      const { working, damaged } = editValues[itemKey];
      updateRoomInventory(editingRoom, itemKey, working, damaged);
    });
    loadData();
    handleCloseEdit();
    alert(`Inventory for Room ${editingRoom} updated successfully`);
  };

  if (!config) {
    return <div className="text-center p-10">Loading inventory configuration...</div>;
  }

  // Calculate aggregates
  const summaryStats = {};
  ITEM_TYPES.forEach(({ key }) => {
    summaryStats[key] = { total: 0, damaged: 0 };
  });

  Object.values(inventory).forEach((roomInv) => {
    ITEM_TYPES.forEach(({ key }) => {
      if (roomInv[key]) {
        summaryStats[key].total += roomInv[key].count || 0;
        summaryStats[key].damaged += roomInv[key].damaged || 0;
      }
    });
  });

  // Filter Inventory list
  const roomsList = Object.keys(inventory).sort();
  const filteredRooms = roomsList.filter((roomNo) => {
    const roomInv = inventory[roomNo];

    // Floor filter
    const matchesFloor = selectedFloor === "ALL" || roomNo.startsWith(selectedFloor);

    // Search filter
    const matchesSearch = roomNo.includes(roomSearch);

    // Condition filter
    let hasDamaged = false;
    ITEM_TYPES.forEach(({ key }) => {
      if (roomInv[key]?.damaged > 0) hasDamaged = true;
    });

    const matchesCondition =
      filterCondition === "ALL" ||
      (filterCondition === "DAMAGED" && hasDamaged) ||
      (filterCondition === "OK" && !hasDamaged);

    return matchesFloor && matchesSearch && matchesCondition;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5 leading-relaxed">
          Inspect, manage, and edit room facilities (Beds, fans, bulbs, chairs, desks, cupboards, mattresses, and bed boards) across all floors.
        </p>
      </div>

      {/* Aggregate breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
        {ITEM_TYPES.map(({ key, name, icon: Icon }) => {
          const stats = summaryStats[key];
          const hasDamaged = stats.damaged > 0;
          const isQuickEditEnabled = true;

          return (
            <button
              key={key}
              type="button"
              onClick={() => isQuickEditEnabled && handleOpenBulkEdit(key)}
              className={`bg-white rounded-2xl border p-4 hover:shadow-md transition flex flex-col justify-between h-28 text-left ${
                hasDamaged ? "border-amber-200 bg-amber-50/5" : "border-gray-150"
              } cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/20`}
            >
              <div className="flex items-center justify-between">
                <Icon size={16} className={hasDamaged ? "text-amber-500" : "text-gray-400"} />
                {hasDamaged && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500" />
                )}
              </div>
              <div className="mt-2">
                <h4 className="text-xs font-bold text-gray-800 leading-tight">{name}</h4>
                <p className="text-[10px] text-gray-400 font-medium">Total: {stats.total}</p>
                <p
                  className={`text-[10px] font-bold mt-1 ${
                    hasDamaged ? "text-amber-600" : "text-emerald-600"
                  }`}
                >
                  {hasDamaged ? `${stats.damaged} Damaged` : "All Working"}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-2xl border border-gray-150 p-3 sm:p-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full min-w-0 sm:flex-1 sm:min-w-[200px]">
  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
    <Search size={16} className="text-gray-400" />
  </div>
  <input
    type="text"
    placeholder="Search by Room Number (e.g. 101)..."
    value={roomSearch}
    onChange={(e) => setRoomSearch(e.target.value)}
    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
  />
</div>

        <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">All Floors</option>
            {Array.from({ length: config.floorsCount }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Floor {i + 1}
              </option>
            ))}
          </select>

          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">All Conditions</option>
            <option value="DAMAGED">Has Damaged Items</option>
            <option value="OK">All Items OK</option>
          </select>

          <select
            value={selectedItemType}
            onChange={(e) => setSelectedItemType(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">Show All Items</option>
            {ITEM_TYPES.map(({ key, name }) => (
              <option key={key} value={key}>
                {name} Only
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory table */}
      <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden">
        {filteredRooms.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <ClipboardList className="mx-auto text-gray-300 mb-2" size={32} />
            <p className="text-sm font-semibold">No room inventory matching filters found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-xs text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-3 sm:p-4 font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                  {selectedItemType === "ALL" ? (
                    ITEM_TYPES.map(({ key, name }) => (
                      <th key={key} className="p-3 sm:p-4 font-semibold text-gray-500 uppercase tracking-wider text-center">
                        {name}
                      </th>
                    ))
                  ) : (
                    <th className="p-3 sm:p-4 font-semibold text-gray-500 uppercase tracking-wider text-center">
                      {ITEM_TYPES.find((i) => i.key === selectedItemType).name} (Working / Damaged)
                    </th>
                  )}
                  <th className="p-3 sm:p-4 font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((roomNo) => {
                  const roomInv = inventory[roomNo];
                  return (
                    <tr key={roomNo} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 sm:p-4 font-bold text-gray-800">Room {roomNo}</td>
                      {selectedItemType === "ALL" ? (
                        ITEM_TYPES.map(({ key }) => {
                          const item = roomInv[key] || { count: 0, working: 0, damaged: 0 };
                          const damaged = item.damaged > 0;
                          return (
                            <td key={key} className="p-3 sm:p-4 text-center">
                              <span
                                className={`inline-block px-2 py-1 rounded-lg font-medium ${
                                  damaged
                                    ? "bg-amber-100/60 text-amber-800 font-bold"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {item.working}w / <span className={damaged ? "text-red-600 font-extrabold" : ""}>{item.damaged}d</span>
                              </span>
                            </td>
                          );
                        })
                      ) : (
                        <td className="p-3 sm:p-4 text-center">
                          {(() => {
                            const item = roomInv[selectedItemType] || { count: 0, working: 0, damaged: 0 };
                            const damaged = item.damaged > 0;
                            return (
                              <span
                                className={`inline-block px-3 py-1.5 rounded-lg font-bold ${
                                  damaged ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                Working: {item.working} · Damaged: {item.damaged}
                              </span>
                            );
                          })()}
                        </td>
                      )}
                      <td className="p-3 sm:p-4 text-right">
                        <button
                          onClick={() => handleOpenEdit(roomNo, roomInv)}
                          className="w-full sm:w-auto px-3.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 text-xs font-bold transition flex items-center justify-center gap-1.5 sm:ml-auto"
                        >
                          <Edit3 size={12} />
                          Edit Item Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bulk Edit Modal for Beds / Fans / Bulbs */}
      {bulkEditItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-800 p-4 sm:p-5 text-white flex justify-between items-start gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold">Edit {bulkEditItem.name} Hostel Quantity</h3>
                <p className="text-[11px] sm:text-xs text-indigo-100 mt-1">Set the total quantity for this item across the whole hostel.</p>
              </div>
              <button onClick={handleCloseBulkEdit} className="text-indigo-200 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              <div className="rounded-2xl bg-indigo-50 p-4 border border-indigo-100">
                <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-500">Current hostel total</p>
                <p className="text-2xl font-extrabold text-indigo-700 mt-1">{summaryStats[bulkEditItem.key]?.total || 0}</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">
                  New hostel total quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={bulkEditValue}
                  onChange={(e) => setBulkEditValue(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseBulkEdit}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkEditSave}
                  className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/10 transition"
                >
                  Save Quantity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Room Inventory Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-800 p-4 sm:p-5 text-white flex justify-between items-start gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold">Edit Room {editingRoom} Inventory</h3>
                <p className="text-[11px] sm:text-xs text-indigo-100 mt-1">
                  Update quantities of working and damaged assets. Total count will automatically adjust.
                </p>
              </div>
              <button onClick={handleCloseEdit} className="text-indigo-200 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            {/* Modal Content Form */}
            <form onSubmit={handleSaveInventory} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ITEM_TYPES.map(({ key, name, icon: Icon }) => {
                  const values = editValues[key] || { working: 0, damaged: 0 };
                  const total = Number(values.working || 0) + Number(values.damaged || 0);

                  return (
                    <div
                      key={key}
                      className="p-3.5 sm:p-4.5 bg-gray-50 border border-gray-150 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Icon size={16} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-800 leading-tight">{name}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">Total count: {total}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <div className="w-1/2 sm:w-20">
                          <label className="block text-[8px] font-bold text-gray-400 uppercase mb-0.5">Working</label>
                          <input
                            type="number"
                            min="0"
                            value={values.working}
                            onChange={(e) => handleCountChange(key, "working", e.target.value)}
                            className="w-full px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-lg text-center font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="w-1/2 sm:w-20">
                          <label className="block text-[8px] font-bold text-amber-500 uppercase mb-0.5">Damaged</label>
                          <input
                            type="number"
                            min="0"
                            value={values.damaged}
                            onChange={(e) => handleCountChange(key, "damaged", e.target.value)}
                            className="w-full px-2 py-1.5 text-xs bg-white border border-gray-250 rounded-lg text-center font-bold text-amber-700 bg-amber-50/5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/10 transition"
                >
                  Save Inventory Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
