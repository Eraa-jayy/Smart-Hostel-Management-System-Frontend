import axios from "axios";
import api from "./axios";

// BULK UPLOAD STUDENTS VIA EXCEL
export const bulkUploadStudents = (file, floorId, academicYear,expectedReleaseDate) => {
  const formData = new FormData();
  formData.append("file", file);
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
    return axios.put(
       `/allocations/status/${id}?status=${status}` 
    );
};
