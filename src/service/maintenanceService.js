import api from "./axios";

// =========================================================
// API-Backed Maintenance Service
// Note: Removed all localStorage mock data and seed functions.
// Statuses: FORWARDED, IN_PROGRESS, RESOLVED
// =========================================================

export const getMaintenanceQueue = async () => {
  try {
    const { data } = await api.get("/complaints/maintenance/queue");
    return data;
  } catch (error) {
    console.error("Failed to load maintenance queue", error);
    throw error;
  }
};

export const getMaintenanceHistory = async () => {
  try {
    const { data } = await api.get("/complaints/maintenance/history");
    return data;
  } catch (error) {
    console.error("Failed to load maintenance history", error);
    throw error;
  }
};

export const startMaintenanceComplaint = async (id) => {
  try {
    const { data } = await api.put(`/complaints/${id}/start`);
    return data;
  } catch (error) {
    console.error("Failed to start maintenance work", error);
    throw error;
  }
};

export const completeMaintenanceComplaint = async (id, remarks) => {
  try {
    const { data } = await api.put(`/complaints/${id}/complete`, { remarks });
    return data;
  } catch (error) {
    console.error("Failed to complete maintenance work", error);
    throw error;
  }
};
