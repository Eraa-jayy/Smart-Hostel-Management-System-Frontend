import api from "./axios";

export const getStudentById = (id) =>{
    return api.get(`/students/${id}`);
}

export const getAllStudents = () =>{
    return api.get("/students");
}