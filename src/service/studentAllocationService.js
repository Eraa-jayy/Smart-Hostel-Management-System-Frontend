import api from "./axios";

// BULK UPLOAD STUDENTS VIA EXCEL
export const bulkUploadStudents = (file, floorId, academicYear) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("floorId", floorId);
  formData.append("academicYear", academicYear);

  return api.post("/allocations/bulk-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};