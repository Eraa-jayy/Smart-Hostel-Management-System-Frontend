import React, { useState, useEffect } from "react";
import {
  DoorOpen,
  Trash2,
  X,
} from "lucide-react";
import {
  getHostelConfig,
} from "../../service/subWardenData";
import {
  getSubWardenAllocations,
  removeSubWardenStudent,
  updateSubWardenStudentStatus,
} from "../../service/studentAllocationService";

export default function StudentAllocation() {
  // Config & Data
  const [config, setConfig] = useState(null);
  const [allocations, setAllocations] = useState([]);

  // Selections
  const [selectedBlock, setSelectedBlock] = useState("Block A");
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null); // room details modal
  const [roomDetails, setRoomDetails] = useState([]); // students in selected room
  const [loading, setLoading] = useState(true);

  // Search & Edit states

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const activeConfig = getHostelConfig();
    setConfig(activeConfig);
    setLoading(true);

    try {
      const response = await getSubWardenAllocations();
      const activeAlloc = (response.data || [])
        .filter((allocation) => allocation.status !== "REMOVED")
        .map((allocation) => ({
        ...allocation,
        roomNo: String(allocation.roomNumber),
        name: allocation.studentName,
        regNo: allocation.registrationNumber,
        block: selectedBlock,
        }));
      setAllocations(activeAlloc);

      if (selectedRoom) {
        setRoomDetails(activeAlloc.filter((a) => a.roomNo === selectedRoom));
      }
    } catch (error) {
      console.error("Failed to load Sub Warden allocations:", error);
      alert("Unable to load student room allocations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (allocId, name, status) => {
    if (status === "ACTIVE") {
      const activeInRoom = allocations.filter(
        (allocation) =>
          allocation.roomNo === selectedRoom &&
          allocation.block === selectedBlock &&
          allocation.status !== "INACTIVE" &&
          allocation.id !== allocId
      ).length;
      if (activeInRoom >= config.roomCapacity) {
        alert("This room is already at full active capacity.");
        return;
      }
    }

    try {
      await updateSubWardenStudentStatus(allocId, status);
      await loadData();
      alert(`${name} is now ${status === "ACTIVE" ? "active" : "deactivated"}.`);
    } catch (error) {
      console.error("Failed to update student allocation status:", error);
      alert("Unable to update the student status. Please try again.");
    }
  };

  const handleOpenRoomDetails = (roomNo) => {
    setSelectedRoom(roomNo);
    const roomAllocs = allocations.filter((a) => a.roomNo === roomNo);
    setRoomDetails(roomAllocs);
  };

  const handleCloseRoomDetails = () => {
    setSelectedRoom(null);
    setRoomDetails([]);
  };

  const handleRelease = async (allocId, name) => {
    const confirm = window.confirm(`Are you sure you want to remove ${name} from room ${selectedRoom}?`);
    if (!confirm) return;

    try {
      await removeSubWardenStudent(allocId);
      await loadData();
      setRoomDetails((details) => details.filter((allocation) => allocation.id !== allocId));
    } catch (error) {
      console.error("Failed to remove student allocation:", error);
      alert("Unable to remove the student from the room. Please try again.");
    }
  };

  if (!config) {
    return <div className="text-center p-10">Loading configuration...</div>;
  }

  if (loading && allocations.length === 0) {
    return <div className="text-center p-10">Loading student allocations...</div>;
  }

  // Generate rooms for current floor
  const floorRoomsList = [];
  for (let r = 1; r <= config.roomsPerFloor; r++) {
    floorRoomsList.push(`${selectedFloor}${r < 10 ? "0" + r : r}`);
  }

  return (
    <div className="min-w-0 space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Student Room Allocation</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            View room assignments created by Student Affairs and manage student status.
          </p>
        </div>
      </div>

      {/* Main content grid: Left - Room Selector | Right - Student pool info */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Rooms Grid (Left - 3 Cols) */}
        <div className="xl:col-span-3 space-y-6">
          {/* Blocks and Floors Tabs */}
          <div className="bg-white rounded-2xl border border-gray-150 p-4 space-y-4">
            {/* Block list */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Block:</span>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: config.blocksCount }).map((_, i) => {
                  const bName = `Block ${String.fromCharCode(65 + i)}`;
                  return (
                    <button
                      key={bName}
                      onClick={() => setSelectedBlock(bName)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                        selectedBlock === bName
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {bName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Floor list */}
            <div className="flex items-center gap-3 border-t border-gray-50 pt-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Floor:</span>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: config.floorsCount }).map((_, i) => {
                  const fNum = i + 1;
                  return (
                    <button
                      key={fNum}
                      onClick={() => setSelectedFloor(fNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center transition ${
                        selectedFloor === fNum
                          ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-600"
                          : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {fNum}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {floorRoomsList.map((roomNo) => {
              const roomAllocs = allocations.filter((a) => a.roomNo === roomNo);
              const occupancy = roomAllocs.filter((allocation) => allocation.status === "ACTIVE").length;
              const isFull = occupancy >= config.roomCapacity;
              const isEmpty = occupancy === 0;

              return (
                <button
                  key={roomNo}
                  onClick={() => handleOpenRoomDetails(roomNo)}
                  className={`bg-white border rounded-2xl p-5 text-left transition hover:shadow-md group relative flex flex-col justify-between h-36 ${
                    isFull
                      ? "border-red-100 hover:border-red-300 bg-red-50/5"
                      : isEmpty
                      ? "border-gray-200 hover:border-gray-300"
                      : "border-indigo-100 hover:border-indigo-300 bg-indigo-50/5"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600">Room</span>
                      <DoorOpen
                        size={14}
                        className={
                          isFull
                            ? "text-red-400"
                            : isEmpty
                            ? "text-gray-300"
                            : "text-indigo-400"
                        }
                      />
                    </div>
                    <h3 className="mt-1 text-xl font-extrabold text-gray-900">{roomNo}</h3>
                  </div>

                  {/* Bed occupancy dots */}
                  <div className="mt-2.5 space-y-1.5">
                    <div className="flex gap-1.5">
                      {Array.from({ length: config.roomCapacity }).map((_, i) => {
                        const isBedOccupied = i < occupancy;
                        return (
                          <div
                            key={i}
                            className={`h-3 w-3 rounded-full border ${
                              isBedOccupied
                                ? "bg-indigo-600 border-indigo-600"
                                : "bg-transparent border-gray-300"
                            }`}
                            title={isBedOccupied ? "Occupied Bed" : "Vacant Bed"}
                          />
                        );
                      })}
                    </div>
                    <p className="text-[10px] font-medium text-gray-400">
                      {occupancy} / {config.roomCapacity} filled
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Room Details Allocation Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-xs">
          <div className="flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-indigo-700 to-indigo-800 p-4 text-white sm:p-5">
              <div>
                <h3 className="text-lg font-extrabold">Room {selectedRoom} Details</h3>
                <p className="text-xs text-indigo-100">
                  {selectedBlock} · Floor {selectedFloor} · {roomDetails.length} of {config.roomCapacity} beds filled
                </p>
              </div>
              <button
                onClick={handleCloseRoomDetails}
                className="text-indigo-200 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
              {/* Allocated Students Section */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Allocated Students ({roomDetails.length})
                </h4>

                {roomDetails.length === 0 ? (
                  <div className="text-center p-6 bg-gray-50 border border-dashed rounded-2xl text-gray-400 text-xs">
                    No students currently allocated to this room.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {roomDetails.map((alloc) => (
                      <div
                        key={alloc.id}
                            className={`p-4 border rounded-2xl flex flex-col justify-between gap-3 ${
                              alloc.status === "INACTIVE"
                                ? "border-amber-200 bg-amber-50/60"
                                : "border-gray-100 bg-gray-50"
                            }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                              <h5 className="text-xs font-bold text-gray-800">{alloc.name}</h5>
                              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{alloc.regNo}</p>
                              <p className="text-[10px] text-gray-500 mt-1 font-medium">{alloc.academicYear}</p>
                              <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                alloc.status === "INACTIVE"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}>
                                {                                alloc.status === "INACTIVE" ? "DEACTIVE" : "ACTIVE"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleStatusChange(
                                  alloc.id,
                                  alloc.name,
                                  alloc.status === "INACTIVE" ? "ACTIVE" : "INACTIVE"
                                )}
                                title={alloc.status === "INACTIVE" ? "Activate student" : "Deactivate student"}
                                className="rounded-lg px-2 py-1.5 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50"
                              >
                                {alloc.status === "INACTIVE" ? "Activate" : "Deactivate"}
                              </button>
                              <button
                                onClick={() => handleRelease(alloc.id, alloc.name)}
                                title="Release student from room"
                                className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
