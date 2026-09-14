import axios from "axios";
import api from "./axios";

// BULK UPLOAD STUDENTS VIA EXCEL
export const bulkUploadStudents = (
  file,
  hostelId,
  buildingId,
  floorId,
  academicYear,
  expectedReleaseDate
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("hostelId", hostelId);
  formData.append("buildingId", buildingId);
  formData.append("floorId", floorId);
  formData.append("academicYear", academicYear);
  formData.append("expectedReleaseDate", expectedReleaseDate);

  return api.post("/allocations/bulk-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllAllocations= ()=>{
    return api.get("allocations");
};

export const getAllocationById = (id) =>{
    return api.get(`/allocations/${id}`);
};

export const releaseAllocation = (id) => {
  return api.put(`/allocations/${id}/release`);
};

export const deleteAllocation = (id) => {
  return api.delete(`/allocations/${id}`);
};

export const getRoomMembers = (roomId) => {
    return api.get(`/allocations/room/${roomId}`);
};

export const updateAllocationStatus = (id, status) =>{
    return api.put(
       `/allocations/status/${id}?status=${encodeURIComponent(status)}` 
    );
};

export const getSubWardenAllocations = () => api.get("/allocations/subwarden");
export const updateSubWardenStudentStatus = (id, status) =>
  api.put(`/allocations/subwarden/${id}/status?status=${encodeURIComponent(status)}`);
export const removeSubWardenStudent = (id) =>
  api.put(`/allocations/subwarden/${id}/remove`);

export const getMyRoomDetails = () => {
    return api.get("/allocations/my-room")
}