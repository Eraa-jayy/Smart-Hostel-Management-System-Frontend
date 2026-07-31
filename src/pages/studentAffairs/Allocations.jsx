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

  const parseAcademicYear = (academicYear) => {
    if (!academicYear) return { faculty: "-", year: "-" };
    const parts = academicYear.split(" - ");
    return {
      faculty: parts[0] || "-",
      year: parts[1] || "-",
    };
  };

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Allocations</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage room allocations for students</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <Users className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{allocations.length}</p>
              <p className="text-xs text-gray-400">Total Allocations</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <DoorOpen className="text-emerald-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {allocations.filter((a) => a.status === "ACTIVE").length}
              </p>
              <p className="text-xs text-gray-400">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 w-11 h-11 rounded-xl flex items-center justify-center">
              <LogOut className="text-gray-500" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {allocations.filter((a) => a.status === "INACTIVE").length}
              </p>
              <p className="text-xs text-gray-400">Released</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by name, reg no, or room..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-200 p-2.5 rounded-xl flex-1 min-w-[200px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Released</option>
        </select>

        <select
          value={facultyFilter}
          onChange={(e) => setFacultyFilter(e.target.value)}
          className="border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        >
          <option value="ALL">All Faculties</option>
          {facultyOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
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
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading...</div>
        ) : filteredAllocations.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No allocations found.
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Reg No</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Faculty</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Allocated Date</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAllocations.map((a) => {
                const { faculty, year } = parseAcademicYear(a.academicYear);
                return (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-3 text-gray-700">{a.registrationNumber}</td>
                    <td className="p-3 font-medium text-gray-800">{a.studentName}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <DoorOpen size={14} className="text-gray-400" />
                        <span className="text-gray-700">{a.roomNumber}</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{faculty}</td>
                    <td className="p-3 text-gray-600">{year}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-gray-600">{a.allocatedDate}</span>
                      </div>
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
                          className="text-red-500 hover:text-red-700 text-xs font-semibold hover:underline transition-colors"
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
