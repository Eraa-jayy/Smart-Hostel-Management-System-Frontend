import React, { useEffect, useState } from "react";
import {
  getAllAllocations,
  releaseAllocation,
  updateAllocationStatus
} from "../../service/studentAllocationService";
import { Users, DoorOpen, Calendar, LogOut } from "lucide-react";

export default function Allocations() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [facultyFilter, setFacultyFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAllocations();
  }, []);

  const loadAllocations = async () => {
    setLoading(true);
    try {
      const response = await getAllAllocations();
      setAllocations(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRelease = async (id) => {
    const confirmRelease = window.confirm(
      "Are you sure you want to release this student's room allocation?"
    );
    if (!confirmRelease) return;

    try {
      await releaseAllocation(id);
      alert("Allocation released successfully");
      loadAllocations();
    } catch (error) {
      console.log(error);
      alert("Failed to release allocation");
    }
  };

  const handleStatusChange = async (allocation) => {

    const newStatus =
        allocation.status === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    try {

        await updateAllocationStatus(
         allocation.id,
        newStatus
        );

        alert(`Student is now ${newStatus}`);

        loadAllocations();

        } catch (error) {

        

        alert("Failed to update status");
        }
    };

  // ===== NEW: academicYear string eka "Faculty XX - Nth Year" widiyata split karanawa =====
  const parseAcademicYear = (academicYear) => {
    if (!academicYear) return { faculty: "-", year: "-" };
    const parts = academicYear.split(" - ");
    return {
      faculty: parts[0] || "-",
      year: parts[1] || "-",
    };
  };

  // ===== NEW: Unique faculty/year list eka data eken auto-generate karanawa =====
  const facultyOptions = [
    ...new Set(
      allocations.map((a) => parseAcademicYear(a.academicYear).faculty)
    ),
  ].filter((f) => f !== "-");

  const yearOptions = [
    ...new Set(
      allocations.map((a) => parseAcademicYear(a.academicYear).year)
    ),
  ].filter((y) => y !== "-");

  // Filter + search karana logic eka
  const filteredAllocations = allocations.filter((a) => {
    const { faculty, year } = parseAcademicYear(a.academicYear);

    const matchesStatus =
      statusFilter === "ALL" || a.status === statusFilter;

    const matchesFaculty =
      facultyFilter === "ALL" || faculty === facultyFilter;

    const matchesYear =
      yearFilter === "ALL" || year === yearFilter;

    const matchesSearch =
      a.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesFaculty && matchesYear && matchesSearch;
  });

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Student Allocations</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Users className="text-blue-600" size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold">{allocations.length}</p>
            <p className="text-sm text-gray-500">Total Allocations</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
          <div className="bg-green-100 p-3 rounded-lg">
            <DoorOpen className="text-green-600" size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {allocations.filter((a) => a.status === "ACTIVE").length}
            </p>
            <p className="text-sm text-gray-500">Active</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
          <div className="bg-gray-200 p-3 rounded-lg">
            <LogOut className="text-gray-600" size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {allocations.filter((a) => a.status === "INACTIVE").length}
            </p>
            <p className="text-sm text-gray-500">Released</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-5 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by name, reg no, or room..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2.5 rounded-lg flex-1 min-w-[200px]"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2.5 rounded-lg"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Released</option>
        </select>

        {/* ===== NEW: Faculty filter ===== */}
        <select
          value={facultyFilter}
          onChange={(e) => setFacultyFilter(e.target.value)}
          className="border p-2.5 rounded-lg"
        >
          <option value="ALL">All Faculties</option>
          {facultyOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        {/* ===== NEW: Year filter ===== */}
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="border p-2.5 rounded-lg"
        >
          <option value="ALL">All Years</option>
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading...</div>
        ) : filteredAllocations.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No allocations found.
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3">Reg No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Room</th>
                <th className="p-3">Faculty</th>
                <th className="p-3">Year</th>
                <th className="p-3">Allocated Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAllocations.map((a) => {
                const { faculty, year } = parseAcademicYear(a.academicYear);
                return (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{a.registrationNumber}</td>
                    <td className="p-3 font-medium">{a.studentName}</td>
                    <td className="p-3 flex items-center gap-1">
                      <DoorOpen size={14} className="text-gray-400" />
                      {a.roomNumber}
                    </td>
                    <td className="p-3">{faculty}</td>
                    <td className="p-3">{year}</td>
                    <td className="p-3 flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      {a.allocatedDate}
                    </td>
                    <td className="p-3">
                        <button
                        onClick={() => handleStatusChange(a)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                        a.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                         }`}
                        >
                            <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                            a.status === "ACTIVE"
                            ? "translate-x-6"
                            : "translate-x-1"
                            }`}
                            />
                        </button>
                    </td>
                    <td className="p-3">
                      {a.status === "ACTIVE" && (
                        <button
                          onClick={() => handleRelease(a.id)}
                          className="text-red-600 hover:underline text-xs font-semibold"
                        >
                          Release
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}