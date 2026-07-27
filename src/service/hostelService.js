import api from "./axios";

// CREATE HOSTEL
export const createHostel = (hostelData) => {
  return api.post("/hostels", hostelData);
};

// GET ALL HOSTELS
export const getAllHostels = () => {
  return api.get("/hostels");
};

// GET HOSTEL BY ID
export const getHostelById = (id) => {
  return api.get(`/hostels/${id}`);
};

// UPDATE HOSTEL
export const updateHostel = (id, hostelData) => {
  return api.put(`/hostels/${id}`, hostelData);
};

// DELETE HOSTEL
export const deleteHostel = (id) => {
  return api.delete(`/hostels/${id}`);
};
