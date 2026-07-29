import api from "./axios";

export const getStudentById = (id) =>{
    return api.get(`/students/${id}`);
}

export const getAllStudents = () =>{
    return api.get("/students");
}

export const getMyRoom = async () => {
    const response = await axios.get("/auth/allocations/my-room");
    return response.data;
}