import api from "./axios";

export const changePassword = (username, currentPassword, newPassword) => {
    return api.post("/auth/change-password", {
        username,
        currentPassword,
        newPassword,
    });
};