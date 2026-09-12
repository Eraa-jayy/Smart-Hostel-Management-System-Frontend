import api from "./axios";

export const getCanteenMeals = () => api.get("/canteen-meals");
export const createCanteenMeal = (meal) => api.post("/canteen-meals", meal);
export const updateCanteenMeal = (id, meal) => api.put(`/canteen-meals/${id}`, meal);
export const deleteCanteenMeal = (id) => api.delete(`/canteen-meals/${id}`);
