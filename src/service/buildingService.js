import api from "./axios";

// CREATE BUILDING
export const createBuilding = (buildingData) => {
  return api.post("/buildings", buildingData);
};

// GET ALL BUILDINGS
export const getAllBuildings = () => {
  return api.get("/buildings");
};

// GET BUILDING BY ID (with floors & rooms)
export const getBuildingById = (id) => {
  return api.get(`/buildings/${id}/details`);
};

// UPDATE BUILDING
export const updateBuilding = (id, buildingData) => {
  return api.put(`/buildings/${id}`, buildingData);
};

// DELETE BUILDING
export const deleteBuilding = (id) => {
  return api.delete(`/buildings/${id}`);
};