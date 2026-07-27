import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import {
  createHostel,
  getAllHostels,
  deleteHostel,
} from "../../service/hostelService";
import HostelCard from "../../components/studentAffairs/HostelCard";

export default function Hostel() {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [hostelData, setHostelData] = useState({
    hostelName: "",
    hostelType: "",
    location: "",
    totalCapacity: "",
  });

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
      loadHostels();
    } catch (error) {
      console.log(error);
      alert("Hostel creation failed");
    }
  };

  // Navigate to buildings page of this hostel
  const handleViewHostel = (hostel) => {
    navigate(`/student-affairs/manage-hostel/${hostel.id}`);
  };

  // Delete hostel
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
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Hostel Management</h1>

      {/* CREATE HOSTEL FORM - same as before */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h2 className="text-xl font-bold mb-5">Create Hostel</h2>
        <form onSubmit={handleCreate}>
          <input name="hostelName" placeholder="Hostel Name" value={hostelData.hostelName} onChange={handleChange} className="border p-3 w-full mb-3 rounded" />
          <select name="hostelType" value={hostelData.hostelType} onChange={handleChange} className="border p-3 w-full mb-3 rounded">
            <option value="">Select Type</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          <input name="location" placeholder="Location" value={hostelData.location} onChange={handleChange} className="border p-3 w-full mb-3 rounded" />
          <input type="number" name="totalCapacity" placeholder="Capacity" value={hostelData.totalCapacity} onChange={handleChange} className="border p-3 w-full mb-3 rounded" />
          <button className="bg-green-600 text-white px-5 py-3 rounded">Create Hostel</button>
        </form>
      </div>

      {/* HOSTEL LIST - now using real HostelCard component */}
      <div>
        <h2 className="text-2xl font-bold mb-5">Existing Hostels</h2>

        {hostels.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center text-gray-400">
            No hostels found. Create one to get started.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
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