import React, { useEffect, useState } from "react";
import { getAllHostels } from "../../service/hostelService";
import { getAllBuildings, getBuildingById } from "../../service/buildingService";
import { bulkUploadStudents } from "../../service/studentAllocationService";
import { Upload, CheckCircle, XCircle } from "lucide-react";

export default function BulkUploadStudents() {
  const [hostels, setHostels] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);

  const [selectedHostel, setSelectedHostel] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Load hostels on page load
  useEffect(() => {
    loadHostels();
  }, []);

  const loadHostels = async () => {
    try {
      const response = await getAllHostels();
      setHostels(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Hostel select karama, e hostel ekeම buildings load karanawa
  const handleHostelChange = async (e) => {
    const hostelId = e.target.value;
    setSelectedHostel(hostelId);
    setSelectedBuilding("");
    setSelectedFloor("");
    setFloors([]);

    if (!hostelId) {
      setBuildings([]);
      return;
    }

    try {
      const response = await getAllBuildings();
      const filtered = response.data.filter(
        (b) => Number(b.hostelId) === Number(hostelId)
      );
      setBuildings(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  // Building select karama, e building ekeම floors load karanawa (details endpoint eken)
  const handleBuildingChange = async (e) => {
    const buildingId = e.target.value;
    setSelectedBuilding(buildingId);
    setSelectedFloor("");

    if (!buildingId) {
      setFloors([]);
      return;
    }

    try {
      const response = await getBuildingById(buildingId);
      setFloors(response.data.floors || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFloor) {
      alert("Please select a floor");
      return;
    }
    if (!academicYear) {
      alert("Please enter academic year");
      return;
    }
    if (!file) {
      alert("Please select an Excel file");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await bulkUploadStudents(file, selectedFloor, academicYear);
      setResult(response.data);
    } catch (error) {
      console.log(error);
      alert("Upload failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Bulk Upload Students</h1>

      <div className="bg-white p-6 rounded-xl shadow max-w-2xl">
        <form onSubmit={handleSubmit}>
          {/* Hostel Select */}
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Hostel
          </label>
          <select
            value={selectedHostel}
            onChange={handleHostelChange}
            className="border p-3 rounded w-full mb-4"
          >
            <option value="">Select Hostel</option>
            {hostels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.hostelName}
              </option>
            ))}
          </select>

          {/* Building Select */}
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Building
          </label>
          <select
            value={selectedBuilding}
            onChange={handleBuildingChange}
            disabled={!selectedHostel}
            className="border p-3 rounded w-full mb-4 disabled:bg-gray-100"
          >
            <option value="">Select Building</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.buildingName}
              </option>
            ))}
          </select>

          {/* Floor Select */}
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Floor
          </label>
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            disabled={!selectedBuilding}
            className="border p-3 rounded w-full mb-4 disabled:bg-gray-100"
          >
            <option value="">Select Floor</option>
            {floors.map((f) => (
              <option key={f.id} value={f.id}>
                {f.floorName} (Floor {f.floorNumber})
              </option>
            ))}
          </select>

          {/* Academic Year */}
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Academic Year
          </label>
          <input
            type="text"
            placeholder="e.g. 2025/2026"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="border p-3 rounded w-full mb-4"
          />

          {/* Excel File */}
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Excel File
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="border p-3 rounded w-full mb-6"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400"
          >
            <Upload size={18} />
            {loading ? "Uploading..." : "Upload & Allocate"}
          </button>
        </form>
      </div>

      {/* RESULT SECTION */}
      {result && (
        <div className="bg-white p-6 rounded-xl shadow max-w-4xl mt-8">
          <h2 className="text-xl font-bold mb-4">Upload Result</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-green-700">
                  {result.successCount}
                </p>
                <p className="text-sm text-gray-500">Successfully Allocated</p>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3">
              <XCircle className="text-red-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-red-700">
                  {result.failedCount}
                </p>
                <p className="text-sm text-gray-500">Failed</p>
              </div>
            </div>
          </div>

          {/* Failed Reasons */}
          {result.failedReasons?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-red-700 mb-2">Failed Records</h3>
              <ul className="bg-red-50 p-4 rounded-lg space-y-1 text-sm text-red-700">
                {result.failedReasons.map((reason, idx) => (
                  <li key={idx}>• {reason}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Created Accounts Table */}
          {result.createdAccounts?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Allocated Students & Credentials
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">Reg No</th>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Room</th>
                      <th className="p-2 border">Username</th>
                      <th className="p-2 border">Temp Password</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.createdAccounts.map((acc, idx) => (
                      <tr key={idx}>
                        <td className="p-2 border">{acc.registrationNumber}</td>
                        <td className="p-2 border">{acc.studentName}</td>
                        <td className="p-2 border">{acc.roomNumber}</td>
                        <td className="p-2 border">{acc.username}</td>
                        <td className="p-2 border">
                          {acc.tempPassword || (
                            <span className="text-gray-400 italic">
                              (existing account)
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}