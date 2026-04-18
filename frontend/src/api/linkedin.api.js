import axios from "./axios";

const ENV = import.meta.env.VITE_ENV || "prod";
const LOCAL_API_URL = import.meta.env.VITE_API_URL_LOCAL || "http://localhost:5000";
const PROD_API_URL = import.meta.env.VITE_API_URL_PROD || "https://schedular-dbnc.onrender.com";

const BASE_URL = ENV === "local" ? LOCAL_API_URL : PROD_API_URL;

export const connectLinkedIn = () => {
  window.location.href = `${BASE_URL}/api/linkedin/connect`;
};

export const getLinkedInAccount = () => {
  return axios.get("/api/linkedin/me");
};

export const disconnectLinkedIn = () => {
  return axios.post("/api/linkedin/disconnect");
};