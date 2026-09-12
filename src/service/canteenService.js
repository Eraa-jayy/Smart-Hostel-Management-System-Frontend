import api from "./axios";

export const getCanteenMeals = (hostelId) => api.get(hostelId ? `/canteen-meals?hostelId=${hostelId}` : "/canteen-meals");
export const getMyHostelCanteenMeals = () => api.get("/canteen-meals/my-hostel");
export const createCanteenMeal = (meal) => api.post("/canteen-meals", meal);
export const updateCanteenMeal = (id, meal) => api.put(`/canteen-meals/${id}`, meal);
export const deleteCanteenMeal = (id) => api.delete(`/canteen-meals/${id}`);
