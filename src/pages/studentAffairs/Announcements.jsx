import React, { useState, useEffect } from "react";
import api from "../../service/axios";

const Announcement = () => {
  

  const [announcements, setAnnouncements] = useState([]);


   

  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
 

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formCategory, setFormCategory] = useState("General");
  const [priority, setPriority] = useState("Normal");


  const fetchAnnouncements = async () => {
    try {
      const response = await api.get("/announcements");

      console.log(
        "Announcements from database:",
        response.data
      );

      setAnnouncements(response.data);

    } catch (error) {

      console.error(
        "Failed to load announcements:",
        error
      );

      if (error.response) {
        console.error(
          "Backend response:",
          error.response.data
        );

        console.error(
          "Status:",
          error.response.status
        );
      }
    }
  };

  // =====================================================
  // LOAD DATA WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // =====================================================
  // CREATE ANNOUNCEMENT
  // =====================================================

  const handleCreate = async (e) => {

    e.preventDefault();

    if (
      title.trim() === "" ||
      description.trim() === ""
    ) {
      alert("Please fill Title and Description");
      return;
    }

    try {

      const response = await api.post(
        "/announcements",
        {
          title: title,
          message: description,
          targetType: "ALL",
          hostelId: null,
        }
      );

      console.log(
        "Announcement created:",
        response.data
      );

      alert(
        "Announcement published successfully!"
      );

      // Clear form
      setTitle("");
      setDescription("");
      setFormCategory("General");
      setPriority("Normal");
      setShowForm(false);

      // Refresh announcements
      fetchAnnouncements();

    } catch (error) {

      console.error(
        "Create announcement error:",
        error
      );

      if (error.response) {

        console.error(
          "Backend response:",
          error.response.data
        );

        console.error(
          "Status:",
          error.response.status
        );
      }

      alert(
        "Failed to publish announcement"
      );
    }
  };

  // =====================================================
  // UPDATE ANNOUNCEMENT
  // =====================================================

  const handleUpdate = async () => {

    if (!editingAnnouncement) {
      return;
    }

    if (
      !editingAnnouncement.title ||
      !editingAnnouncement.message
    ) {
      alert("Please fill Title and Message");
      return;
    }

    try {

      const response = await api.put(
        `/announcements/${editingAnnouncement.id}`,
        {
          title: editingAnnouncement.title,
          message: editingAnnouncement.message,
          targetType:
            editingAnnouncement.targetType || "ALL",
          hostelId:
            editingAnnouncement.hostelId || null,
        }
      );

      console.log(
        "Announcement updated:",
        response.data
      );

      alert(
        "Announcement updated successfully!"
      );

      // Close edit modal
      setEditingAnnouncement(null);

      // Refresh announcements
      fetchAnnouncements();

    } catch (error) {

      console.error(
        "Update announcement error:",
        error
      );

      if (error.response) {

        console.error(
          "Backend response:",
          error.response.data
        );

        console.error(
          "Status:",
          error.response.status
        );
      }

      alert(
        "Failed to update announcement"
      );
    }
  };

  // =====================================================
  // DELETE ANNOUNCEMENT
  // =====================================================

  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmed) {
      return;
    }

    try {

      await api.delete(
        `/announcements/${id}`
      );

      alert(
        "Announcement deleted successfully!"
      );

      // Refresh announcement list
      fetchAnnouncements();

    } catch (error) {

      console.error(
        "Delete announcement error:",
        error
      );

      if (error.response) {

        console.error(
          "Backend response:",
          error.response.data
        );

        console.error(
          "Status:",
          error.response.status
        );
      }

      alert(
        "Failed to delete announcement"
      );
    }
  };

  // =====================================================
  // SEARCH + CATEGORY FILTER
  // =====================================================

  const filteredAnnouncements =
    announcements.filter((announcement) => {

      const message =
        announcement.message || "";

      const announcementTitle =
        announcement.title || "";

      const matchesSearch =
        announcementTitle
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        message
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        announcement.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString();
  };

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="min-h-screen bg-slate-50 p-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-800">
            Announcements
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage important hostel announcements
          </p>

        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + New Announcement
        </button>

      </div>


      {/* =====================================================
          CREATE ANNOUNCEMENT FORM
      ===================================================== */}

      {showForm && (

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold text-slate-800">
                Create New Announcement
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Create a new announcement for students
              </p>

            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-2xl text-slate-400 hover:text-slate-600"
            >
              ×
            </button>

          </div>


          <form onSubmit={handleCreate}>

            {/* Title */}

            <div className="mb-5">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Announcement Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Enter announcement title"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* Category + Priority */}

            <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Category */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  value={formCategory}
                  onChange={(e) =>
                    setFormCategory(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                >

                  <option value="General">
                    General
                  </option>

                  <option value="Maintenance">
                    Maintenance
                  </option>

                  <option value="Canteen">
                    Canteen
                  </option>

                  <option value="Academic">
                    Academic
                  </option>

                  <option value="Hostel">
                    Hostel
                  </option>

                </select>

              </div>


              {/* Priority */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Priority
                </label>

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                >

                  <option value="Normal">
                    Normal
                  </option>

                  <option value="Important">
                    Important
                  </option>

                </select>

              </div>

            </div>


            {/* Description */}

            <div className="mb-5">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Announcement Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Write your announcement here..."
                rows="5"
                className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* Buttons */}

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Publish Announcement
              </button>

            </div>

          </form>

        </div>
      )}


      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 md:flex-row">

          {/* Search */}

          <div className="relative flex-1">

            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search announcements..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>


          {/* Category */}

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
          >

            <option value="All">
              All Categories
            </option>

            <option value="General">
              General
            </option>

            <option value="Maintenance">
              Maintenance
            </option>

            <option value="Canteen">
              Canteen
            </option>

            <option value="Academic">
              Academic
            </option>

            <option value="Hostel">
              Hostel
            </option>

          </select>

        </div>

      </div>


      {/* =====================================================
          ANNOUNCEMENT LIST
      ===================================================== */}

      <div className="space-y-4">

        {filteredAnnouncements.length === 0 ? (

          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">

            <p className="text-slate-500">
              No announcements found.
            </p>

          </div>

        ) : (

          filteredAnnouncements.map(
            (announcement) => (

              <div
                key={announcement.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >

                {/* Top */}

                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">

                  <div className="flex items-start gap-3">

                    {/* Priority Dot */}

                    <div
                      className={`mt-1 h-3 w-3 rounded-full ${
                        announcement.priority ===
                        "Important"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                    ></div>


                    {/* Title */}

                    <div>

                      <h2 className="text-lg font-semibold text-slate-800">
                        {announcement.title}
                      </h2>

                      <div className="mt-2 flex flex-wrap gap-2">

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                          {announcement.category ||
                            "General"}
                        </span>

                        {announcement.priority ===
                          "Important" && (

                          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                            Important
                          </span>

                        )}

                      </div>

                    </div>

                  </div>


                  {/* Date */}

                  <span className="text-xs text-slate-400">

                    {formatDate(
                      announcement.createdAt
                    )}

                  </span>

                </div>


                {/* Message */}

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {announcement.message}
                </p>


                {/* Bottom */}

                <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="text-xs text-slate-500">

                    Posted by{" "}

                    <span className="font-medium text-slate-700">

                      {announcement.createdBy ||
                        "Unknown"}

                    </span>

                  </div>


                  <div className="flex gap-2">

                    {/* View Details */}

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAnnouncement(
                          announcement
                        )
                      }
                      className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      View Details
                    </button>


                    {/* Edit */}

                    <button
                      type="button"
                      onClick={() =>
                        setEditingAnnouncement(
                          announcement
                        )
                      }
                      className="rounded-lg bg-blue-50 px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100"
                    >
                      Edit
                    </button>


                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(announcement.id)
                      }
                      className="rounded-lg bg-red-50 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            )
          )

        )}

      </div>


      {/* =====================================================
          VIEW DETAILS MODAL
      ===================================================== */}

      {selectedAnnouncement && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-lg font-semibold text-slate-800">
                Announcement Details
              </h2>

              <button
                type="button"
                onClick={() =>
                  setSelectedAnnouncement(null)
                }
                className="text-xl text-slate-400 hover:text-slate-600"
              >
                ×
              </button>

            </div>


            <div className="space-y-4">

              {/* Title */}

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Title
                </p>

                <p className="mt-1 text-base font-semibold text-slate-800">
                  {selectedAnnouncement.title}
                </p>

              </div>


              {/* Message */}

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Message
                </p>

                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {selectedAnnouncement.message}
                </p>

              </div>


              {/* Target */}

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Target
                </p>

                <p className="mt-1 text-sm text-slate-700">

                  {selectedAnnouncement.targetType ===
                  "ALL"
                    ? "All Students"
                    : selectedAnnouncement.hostelName ||
                      "Specific Hostel"}

                </p>

              </div>


              {/* Posted By */}

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Posted By
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {selectedAnnouncement.createdBy ||
                    "Unknown"}
                </p>

              </div>


              {/* Role */}

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Posted By Role
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {selectedAnnouncement.createdByRole ||
                    "N/A"}
                </p>

              </div>


              {/* Date */}

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Published At
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {formatDate(
                    selectedAnnouncement.createdAt
                  )}
                </p>

              </div>

            </div>


            {/* Close */}

            <div className="mt-6 flex justify-end">

              <button
                type="button"
                onClick={() =>
                  setSelectedAnnouncement(null)
                }
                className="rounded-lg bg-slate-800 px-5 py-2 text-sm font-medium text-white hover:bg-slate-900"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          EDIT ANNOUNCEMENT MODAL
      ===================================================== */}

      {editingAnnouncement && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-lg font-semibold text-slate-800">
                Edit Announcement
              </h2>

              <button
                type="button"
                onClick={() =>
                  setEditingAnnouncement(null)
                }
                className="text-xl text-slate-400 hover:text-slate-600"
              >
                ×
              </button>

            </div>


            <div className="space-y-4">

              {/* Title */}

              <div>

                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Title
                </label>

                <input
                  type="text"
                  value={
                    editingAnnouncement.title || ""
                  }
                  onChange={(e) =>
                    setEditingAnnouncement({
                      ...editingAnnouncement,
                      title: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />

              </div>


              {/* Message */}

              <div>

                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Message
                </label>

                <textarea
                  rows="5"
                  value={
                    editingAnnouncement.message || ""
                  }
                  onChange={(e) =>
                    setEditingAnnouncement({
                      ...editingAnnouncement,
                      message: e.target.value,
                    })
                  }
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />

              </div>


              {/* Buttons */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setEditingAnnouncement(null)
                  }
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>


                <button
                  type="button"
                  onClick={handleUpdate}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Update
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Announcement;