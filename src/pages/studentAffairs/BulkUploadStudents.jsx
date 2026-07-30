import React, { useEffect, useState } from "react";
import { getAllHostels } from "../../service/hostelService";
import { getAllBuildings, getBuildingById } from "../../service/buildingService";
import { bulkUploadStudents } from "../../service/studentAllocationService";
import { Upload, CheckCircle, XCircle, GraduationCap, BookOpen, ArrowLeft, Building2 } from "lucide-react";

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
  const [step, setStep] = useState(1);
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

  const handleFacultySelect = (faculty) => {
    setSelectedFaculty(faculty);
    setStep(2);
  };

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Upload Students</h1>
        <p className="text-sm text-gray-400 mt-0.5">Upload and allocate students to rooms in bulk</p>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
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

      {/* STEP 1: Faculty Cards */}
      {step === 1 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Select Faculty</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {FACULTIES.map((faculty) => (
              <button
                key={faculty}
                onClick={() => handleFacultySelect(faculty)}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-blue-300 transition-all duration-300 flex flex-col items-center gap-3"
              >
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
                  <GraduationCap className="text-blue-600" size={24} />
                </div>
                <span className="text-sm font-semibold text-gray-700">{faculty}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Year Cards */}
      {step === 2 && (
        <div>
          <button
            onClick={goBack}
            className="flex items-center gap-1 text-blue-600 font-semibold text-sm mb-4 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Faculty
          </button>

          <h2 className="text-sm font-semibold text-gray-800 mb-1">
            {selectedFaculty}
          </h2>
          <p className="text-xs text-gray-400 mb-4">Select Academic Year</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {YEARS.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-indigo-300 transition-all duration-300 flex flex-col items-center gap-3"
              >
                <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center">
                  <BookOpen className="text-indigo-600" size={24} />
                </div>
                <span className="text-sm font-semibold text-gray-700">{year}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Upload Form */}
      {step === 3 && (
        <div>
          <button
            onClick={goBack}
            className="flex items-center gap-1 text-blue-600 font-semibold text-sm mb-4 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Year
          </button>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-5">
            <p className="text-sm text-blue-700 font-medium">
              <Building2 size={14} className="inline mr-1" />
              {selectedFaculty} · {selectedYear}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 max-w-2xl">
            <form onSubmit={handleSubmit}>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Hostel
              </label>
              <select
                value={selectedHostel}
                onChange={handleHostelChange}
                className="border border-gray-200 p-3 rounded-xl w-full mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              >
                <option value="">Select Hostel</option>
                {hostels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.hostelName}
                  </option>
                ))}
              </select>

              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Building
              </label>
              <select
                value={selectedBuilding}
                onChange={handleBuildingChange}
                disabled={!selectedHostel}
                className="border border-gray-200 p-3 rounded-xl w-full mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">Select Building</option>
                {buildings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.buildingName}
                  </option>
                ))}
              </select>

              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Floor
              </label>
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                disabled={!selectedBuilding}
                className="border border-gray-200 p-3 rounded-xl w-full mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">Select Floor</option>
                {floors.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.floorName} (Floor {f.floorNumber})
                  </option>
                ))}
              </select>

              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Expected Release Date
              </label>
              <input
                type="date"
                value={expectedReleaseDate}
                onChange={(e) => setExpectedReleaseDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="border border-gray-200 p-3 rounded-xl w-full mb-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
              <p className="text-xs text-gray-400 mb-4">
                Students will be automatically released on this date
              </p>

              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Excel File
              </label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="border border-gray-200 p-3 rounded-xl w-full mb-6 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 file:text-sm file:font-semibold hover:file:bg-blue-100"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold text-sm flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Upload size={16} />
                {loading ? "Uploading..." : "Upload & Allocate"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RESULT SECTION */}
      {result && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Upload Result</h2>
            <button
              onClick={resetAll}
              className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors"
            >
              Upload Another Batch
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-emerald-50 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle className="text-emerald-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-emerald-700">
                  {result.successCount}
                </p>
                <p className="text-sm text-gray-500">Successfully Allocated</p>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-xl flex items-center gap-3">
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
              <h3 className="font-semibold text-red-700 text-sm mb-2">Failed Records</h3>
              <div className="bg-red-50 p-4 rounded-xl space-y-1 text-sm text-red-700">
                {result.failedReasons.map((reason, idx) => (
                  <p key={idx}>• {reason}</p>
                ))}
              </div>
            </div>
          )}

          {result.createdAccounts?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 text-sm mb-2">
                Allocated Students & Credentials
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="p-2.5 text-[11px] font-semibold text-gray-500 uppercase">Reg No</th>
                      <th className="p-2.5 text-[11px] font-semibold text-gray-500 uppercase">Name</th>
                      <th className="p-2.5 text-[11px] font-semibold text-gray-500 uppercase">Room</th>
                      <th className="p-2.5 text-[11px] font-semibold text-gray-500 uppercase">Username</th>
                      <th className="p-2.5 text-[11px] font-semibold text-gray-500 uppercase">Temp Password</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.createdAccounts.map((acc, idx) => (
                      <tr key={idx} className="border-b border-gray-50">
                        <td className="p-2.5 text-gray-700">{acc.registrationNumber}</td>
                        <td className="p-2.5 text-gray-700">{acc.studentName}</td>
                        <td className="p-2.5 text-gray-700">{acc.roomNumber}</td>
                        <td className="p-2.5 text-gray-700">{acc.username}</td>
                        <td className="p-2.5">
                          {acc.tempPassword || (
                            <span className="text-gray-400 italic text-xs">
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
