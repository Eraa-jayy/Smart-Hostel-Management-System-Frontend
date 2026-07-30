import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createHostel,
  getAllHostels,
  deleteHostel,
} from "../../service/hostelService";
import HostelCard from "../../components/studentAffairs/HostelCard";
import { Plus } from "lucide-react";

export default function Hostel() {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [hostelData, setHostelData] = useState({
    hostelName: "",
    hostelType: "",
    location: "",
    totalCapacity: "",
  });
  const [showForm, setShowForm] = useState(false);

  const loadHostels = async () => {
    try {
      const response = await getAllHostels();
      setHostels(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadHostels();
  }, []);

  const handleChange = (e) => {
    setHostelData({ ...hostelData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createHostel({
        hostelName: hostelData.hostelName,
        hostelType: hostelData.hostelType,
        location: hostelData.location,
        totalCapacity: Number(hostelData.totalCapacity),
      });
      alert("Hostel created successfully");
      setHostelData({ hostelName: "", hostelType: "", location: "", totalCapacity: "" });
      setShowForm(false);
      loadHostels();
    } catch (error) {
      console.log(error);
      alert("Hostel creation failed");
    }
  };

  const handleViewHostel = (hostel) => {
    navigate(`/student-affairs/manage-hostel/${hostel.id}`);
  };

  const handleDeleteHostel = async (hostelId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hostel? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await deleteHostel(hostelId);
      alert("Hostel deleted successfully");
      loadHostels();
    } catch (error) {
      console.log(error);
      alert("Failed to delete hostel. Make sure it has no linked buildings.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hostel Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">Create and manage university hostels</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition flex items-center gap-2 text-sm font-semibold"
        >
          <Plus size={16} />
          Create Hostel
        </button>
      </div>

      {/* CREATE HOSTEL FORM */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Create New Hostel</h2>
          <form onSubmit={handleCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                name="hostelName"
                placeholder="Hostel Name"
                value={hostelData.hostelName}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
              <select
                name="hostelType"
                value={hostelData.hostelType}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              >
                <option value="">Select Type</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              <input
                name="location"
                placeholder="Location"
                value={hostelData.location}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
              <input
                type="number"
                name="totalCapacity"
                placeholder="Capacity"
                value={hostelData.totalCapacity}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition font-semibold text-sm"
              >
                Save Hostel
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition font-semibold text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* HOSTEL LIST */}
      <div>
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Existing Hostels</h2>

        {hostels.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
            No hostels found. Create one to get started.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {hostels.map((hostel) => (
              <HostelCard
                key={hostel.id}
                hostel={hostel}
                onView={handleViewHostel}
                onDelete={handleDeleteHostel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
