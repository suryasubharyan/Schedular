import axios, { BASE_URL } from "./axios";

export const connectLinkedIn = () => {
  window.location.href = `${BASE_URL}/api/linkedin/connect`;
};

export const getLinkedInAccount = () => {
  return axios.get("/api/linkedin/me");
};

export const disconnectLinkedIn = () => {
  return axios.post("/api/linkedin/disconnect");
};