// src/api/availability.api.js
import axios from "./axios";

export const getAvailabilityAPI = (date) => {
  return axios.get(`/api/availability/${date}`);
};