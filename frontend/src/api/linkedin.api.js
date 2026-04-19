import axios from "./axios";

const BASE_URL = import.meta.env.VITE_API_URL_LOCAL || "http://localhost:5000";

export const connectLinkedIn = () => {
  window.location.href = `${BASE_URL}/api/linkedin/connect`;
};

export const getLinkedInAccount = () => {
  return axios.get("/api/linkedin/me");
};

export const disconnectLinkedIn = () => {
  return axios.post("/api/linkedin/disconnect");
};