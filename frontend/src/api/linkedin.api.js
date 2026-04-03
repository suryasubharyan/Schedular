import axios from "./axios";

const ENV = import.meta.env.VITE_ENV;

const BASE_URL =
  ENV === "local"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PROD;

export const connectLinkedIn = () => {
  window.location.href = `${BASE_URL}/api/linkedin/connect`;
};

export const getLinkedInAccount = () => {
  return axios.get("/api/linkedin/me");
};

export const disconnectLinkedIn = () => {
  return axios.post("/api/linkedin/disconnect");
};