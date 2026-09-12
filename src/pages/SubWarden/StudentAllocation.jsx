import React, { useState, useEffect } from "react";
import {
  Users,
  DoorOpen,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  HelpCircle,
  X,
  Search,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import {
  getHostelConfig,
  getStudentsPool,
  getAllocations,
  allocateStudentToRoom,
  releaseStudentFromRoom,
  editStudentAllocation,
} from "../../service/subWardenData";

export default function StudentAllocation() {
  // Config & Data
  const [config, setConfig] = useState(null);
  const [studentsPool, setStudentsPool] = useState([]);
  const [allocations, setAllocations] = useState([]);

  // Selections
  const [selectedBlock, setSelectedBlock] = useState("Block A");
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null); // room details modal
  const [roomDetails, setRoomDetails] = useState([]); // students in selected room

  // Search & Edit states
  const [poolSearch, setPoolSearch] = useState("");
  const [selectedStudentToAllocate, setSelectedStudentToAllocate] = useState("");
  const [editingAllocationId, setEditingAllocationId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", regNo: "", academicYear: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const activeConfig = getHostelConfig();
    setConfig(activeConfig);
    setStudentsPool(getStudentsPool());
    const activeAlloc = getAllocations();
    setAllocations(activeAlloc);

    // If modal is open, refresh room list
    if (selectedRoom) {
      const roomAllocs = activeAlloc.filter(
        (a) => a.roomNo === selectedRoom && a.block === selectedBlock
      );
      setRoomDetails(roomAllocs);
    }
  };

  const handleOpenRoomDetails = (roomNo) => {
    setSelectedRoom(roomNo);
    const roomAllocs = allocations.filter(
      (a) => a.roomNo === roomNo && a.block === selectedBlock
    );
    setRoomDetails(roomAllocs);
  };

  const handleCloseRoomDetails = () => {
    setSelectedRoom(null);
    setRoomDetails([]);
    setEditingAllocationId(null);
  };

  const handleAllocate = (e) => {
    e.preventDefault();
    if (!selectedStudentToAllocate) return;

    const student = studentsPool.find((s) => s.id === selectedStudentToAllocate);
    if (!student) return;

    try {
      allocateStudentToRoom(student, selectedRoom, selectedBlock);
      setSelectedStudentToAllocate("");
      loadData();
      alert(`Successfully allocated ${student.name} to Room ${selectedRoom}`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRelease = (allocId, name) => {
    const confirm = window.confirm(`Are you sure you want to remove ${name} from room ${selectedRoom}?`);
    if (!confirm) return;

    releaseStudentFromRoom(allocId);
    loadData();
  };

  const startEdit = (alloc) => {
    setEditingAllocationId(alloc.id);
    setEditForm({ name: alloc.name, regNo: alloc.regNo, academicYear: alloc.academicYear });
  };

  const cancelEdit = () => {
    setEditingAllocationId(null);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.regNo) {
      alert("Name and Registration Number are required.");
      return;
    }

    editStudentAllocation(editingAllocationId, editForm);
    setEditingAllocationId(null);
    loadData();
    alert("Student details updated successfully");
  };

  // Quick auto allocate for testing
  const handleAutoAllocate = () => {
    if (studentsPool.length === 0) {
      alert("No students in the pool to allocate!");
      return;
    }

    // Find first room with space
    let allocatedCount = 0;
    const rooms = [];
    for (let f = 1; f <= config.floorsCount; f++) {
      for (let r = 1; r <= config.roomsPerFloor; r++) {
        rooms.push(`${f}${r < 10 ? "0" + r : r}`);
      }
    }

    const poolCopy = [...studentsPool];
    
    for (let roomNo of rooms) {
      if (poolCopy.length === 0) break;
      
      const currentRoomAlloc = allocations.filter(
        (a) => a.roomNo === roomNo && a.block === selectedBlock
      );
      
      let spaces = config.roomCapacity - currentRoomAlloc.length;
      while (spaces > 0 && poolCopy.length > 0) {
        const student = poolCopy.shift();
        allocateStudentToRoom(student, roomNo, selectedBlock);
        allocatedCount++;
        spaces--;
      }
    }

    if (allocatedCount > 0) {
      alert(`Auto-allocated ${allocatedCount} students successfully!`);
      loadData();
    } else {
      alert("No vacant beds found on this block!");
    }
  };

  if (!config) {
    return <div className="text-center p-10">Loading configuration...</div>;
  }

  // Generate rooms for current floor
  const floorRoomsList = [];
  for (let r = 1; r <= config.roomsPerFloor; r++) {
    floorRoomsList.push(`${selectedFloor}${r < 10 ? "0" + r : r}`);
  }

  // Filter student pool
  const filteredPool = studentsPool.filter(
    (s) =>
      s.name.toLowerCase().includes(poolSearch.toLowerCase()) ||
      s.regNo.toLowerCase().includes(poolSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Room Allocation</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Assign students allocated by Student Affairs to their rooms. Default {config.roomCapacity} students per room.
          </p>
        </div>

        <button
          onClick={handleAutoAllocate}
          disabled={studentsPool.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-200 disabled:text-gray-400 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition self-start"
        >
          <UserCheck size={16} />
          Auto Allocate All
        </button>
      </div>

      {/* Main content grid: Left - Room Selector | Right - Student pool info */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Rooms Grid (Left - 3 Cols) */}
        <div className="xl:col-span-3 space-y-6">
          {/* Blocks and Floors Tabs */}
          <div className="bg-white rounded-2xl border border-gray-150 p-4 space-y-4">
            {/* Block list */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Block:</span>
              <div className="flex gap-2">
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
              const roomAllocs = allocations.filter(
                (a) => a.roomNo === roomNo && a.block === selectedBlock
              );
              const occupancy = roomAllocs.length;
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

        {/* Unallocated Student Pool panel (Right - 1 Col) */}
        <div className="bg-white rounded-2xl border border-gray-150 p-5 flex flex-col max-h-[500px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-gray-800">Unallocated Pool</h2>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {studentsPool.length} Students
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Placed in this hostel by Student Affairs, awaiting room assignment.
            </p>

            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search students..."
                value={poolSearch}
                onChange={(e) => setPoolSearch(e.target.value)}
                className="w-full pl-8.5 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredPool.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                {studentsPool.length === 0
                  ? "All students are allocated!"
                  : "No students match your search."}
              </div>
            ) : (
              filteredPool.map((student) => (
                <div
                  key={student.id}
                  className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex flex-col justify-between hover:border-gray-200 transition"
                >
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 leading-tight">{student.name}</h4>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{student.regNo}</p>
                    <p className="text-[10px] text-gray-500 mt-1 font-medium">{student.academicYear}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Room Details Allocation Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-800 p-5 text-white flex justify-between items-center">
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
            <div className="p-6 flex-1 overflow-y-auto space-y-5">
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
                        className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col justify-between gap-3"
                      >
                        {editingAllocationId === alloc.id ? (
                          /* Inline Edit Form */
                          <form onSubmit={saveEdit} className="space-y-3">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase">Student Name</label>
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full mt-1 px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase">Registration No</label>
                                <input
                                  type="text"
                                  value={editForm.regNo}
                                  onChange={(e) => setEditForm({ ...editForm, regNo: e.target.value })}
                                  className="w-full mt-1 px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase">Faculty/Year</label>
                                <input
                                  type="text"
                                  value={editForm.academicYear}
                                  onChange={(e) => setEditForm({ ...editForm, academicYear: e.target.value })}
                                  className="w-full mt-1 px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 justify-end pt-1">
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-500"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
                              >
                                Save Details
                              </button>
                            </div>
                          </form>
                        ) : (
                          /* Read view */
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h5 className="text-xs font-bold text-gray-800">{alloc.name}</h5>
                              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{alloc.regNo}</p>
                              <p className="text-[10px] text-gray-500 mt-1 font-medium">{alloc.academicYear}</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => startEdit(alloc)}
                                title="Edit Student details"
                                className="w-8 h-8 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition"
                              >
                                <Edit2 size={13} />
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
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Allocate Form Section */}
              {roomDetails.length < config.roomCapacity && (
                <div className="border-t border-gray-100 pt-5">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Allocate Student to Room
                  </h4>
                  <form onSubmit={handleAllocate} className="flex gap-2">
                    <select
                      value={selectedStudentToAllocate}
                      onChange={(e) => setSelectedStudentToAllocate(e.target.value)}
                      className="flex-1 px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select student from pool...</option>
                      {studentsPool.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.regNo})
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      disabled={!selectedStudentToAllocate}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1"
                    >
                      <Plus size={14} />
                      Allocate
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
