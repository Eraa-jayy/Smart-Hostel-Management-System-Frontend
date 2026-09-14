import api from "./axios";

export const getMyStaffAssignment = () => api.get("/staff-assignment/me");
