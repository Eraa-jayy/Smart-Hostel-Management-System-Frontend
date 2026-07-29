import React, { useEffect, useState } from "react";
import { getAllHostels } from "../../service/hostelService";
import { getAllBuildings, getBuildingById } from "../../service/buildingService";
import { bulkUploadStudents } from "../../service/studentAllocationService";
import { Upload, CheckCircle, XCircle, GraduationCap, BookOpen, ArrowLeft } from "lucide-react";

const FACULTIES = [
  "Faculty of Agriculture",
  "Faculty of Allied Health Sciences",
  "Faculty of Engineering",
  "Faculty of Fisheries and Marine Sciences & Technology",
  "Faculty of Humanities and Social Sciences",
  "Faculty of Management and Finance",
  "Faculty of Medicine",
  "Faculty of Science",
  "Faculty of Technology",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function BulkUploadStudents() {
  const [step, setStep] = useState(1);   // 1: faculty, 2: year, 3: upload form

  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [hostels, setHostels] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);

  const [selectedHostel, setSelectedHostel] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [expectedReleaseDate, setExpectedReleaseDate] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

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

  // ===== STEP 1: Faculty select =====
  const handleFacultySelect = (faculty) => {
    setSelectedFaculty(faculty);
    setStep(2);
  };

  // ===== STEP 2: Year select =====
  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setStep(3);
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedFaculty("");
    } else if (step === 3) {
      setStep(2);
      setSelectedYear("");
    }
  };

  // ===== STEP 3: Hostel/Building/Floor + Upload =====
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
    if (!expectedReleaseDate) {
      alert("Please select expected release date");
      return;
    }
    if (!file) {
      alert("Please select an Excel file");
      return;
    }

    // academicYear eka Faculty + Year ekin auto-generate wenawa
    const academicYear = `${selectedFaculty} - ${selectedYear}`;

    setLoading(true);
    setResult(null);

    try {
      const response = await bulkUploadStudents(
        file,
        selectedFloor,
        academicYear,
        expectedReleaseDate
      );
      setResult(response.data);
    } catch (error) {
      console.log(error);
      alert("Upload failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setStep(1);
    setSelectedFaculty("");
    setSelectedYear("");
    setSelectedHostel("");
    setSelectedBuilding("");
    setSelectedFloor("");
    setExpectedReleaseDate("");
    setFile(null);
    setResult(null);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Bulk Upload Students</h1>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <span className={step >= 1 ? "text-blue-600 font-semibold" : ""}>
          1. Faculty
        </span>
        <span>→</span>
        <span className={step >= 2 ? "text-blue-600 font-semibold" : ""}>
          2. Year
        </span>
        <span>→</span>
        <span className={step >= 3 ? "text-blue-600 font-semibold" : ""}>
          3. Upload
        </span>
      </div>

      {/* ===== STEP 1: Faculty Cards ===== */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-5">Select Faculty</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {FACULTIES.map((faculty) => (
              <button
                key={faculty}
                onClick={() => handleFacultySelect(faculty)}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:border-blue-500 border-2 border-transparent transition flex flex-col items-center gap-3"
              >
                <div className="bg-blue-100 p-4 rounded-full">
                  <GraduationCap className="text-blue-600" size={28} />
                </div>
                <span className="font-semibold text-gray-700">{faculty}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== STEP 2: Year Cards ===== */}
      {step === 2 && (
        <div>
          <button
            onClick={goBack}
            className="flex items-center gap-1 text-blue-600 font-semibold mb-5"
          >
            <ArrowLeft size={16} /> Back to Faculty
          </button>

          <h2 className="text-xl font-semibold mb-1">
            {selectedFaculty}
          </h2>
          <p className="text-gray-500 mb-5">Select Academic Year</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {YEARS.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:border-indigo-500 border-2 border-transparent transition flex flex-col items-center gap-3"
              >
                <div className="bg-indigo-100 p-4 rounded-full">
                  <BookOpen className="text-indigo-600" size={28} />
                </div>
                <span className="font-semibold text-gray-700">{year}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== STEP 3: Upload Form ===== */}
      {step === 3 && (
        <div>
          <button
            onClick={goBack}
            className="flex items-center gap-1 text-blue-600 font-semibold mb-5"
          >
            <ArrowLeft size={16} /> Back to Year
          </button>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-5">
            <p className="text-sm text-blue-700">
              <strong>{selectedFaculty}</strong> · <strong>{selectedYear}</strong>
            </p>
          </div>

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

              {/* Expected Release Date */}
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Expected Release Date
              </label>
              <input
                type="date"
                value={expectedReleaseDate}
                onChange={(e) => setExpectedReleaseDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="border p-3 rounded w-full mb-1"
              />
              <p className="text-xs text-gray-400 mb-4">
                Students will be automatically released from their rooms on this date
              </p>

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
        </div>
      )}

      {/* ===== RESULT SECTION ===== */}
      {result && (
        <div className="bg-white p-6 rounded-xl shadow max-w-4xl mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Upload Result</h2>
            <button
              onClick={resetAll}
              className="text-blue-600 font-semibold text-sm"
            >
              Upload Another Batch
            </button>
          </div>

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