import api from "./axios";

export const getAllUsers = () => {
    return api.get("/users");
};

export const getUserById = (id) =>{
    return api.get(`/users/${id}`);
};

export const createUser = (userData) =>{
    return api.post ("/users", userData);
};

export const toggleUserStatus = (id) => {
    return api.put(`/users/${id}/toggle-status`);
};

export const deleteUser = (id) => {
    return api.delete(`/users/${id}`);
};