import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/studentAffairs/Sidebar";
import Navbar from "../components/studentAffairs/Navbar";

export default function StudentAffairsLayout() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(
    () => localStorage.getItem("studentAffairsProfileImage") || ""
  );

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      localStorage.setItem("studentAffairsProfileImage", result);
      setProfileImage(result);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleRemoveProfileImage = () => {
    localStorage.removeItem("studentAffairsProfileImage");
    setProfileImage("");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f5]">
      <Sidebar
        profileImage={profileImage}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar
          profileImage={profileImage}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
                  Profile
                </p>
                <h3 className="mt-1 text-xl font-bold text-gray-900">
                  Edit profile picture
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                aria-label="Close profile dialog"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-28 w-28 rounded-full object-cover ring-4 ring-blue-100"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
                    SA
                  </div>
                )}
              </div>

              <div className="w-full space-y-3">
                <label className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />
                  Upload photo
                </label>

                {profileImage && (
                  <button
                    type="button"
                    onClick={handleRemoveProfileImage}
                    className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
