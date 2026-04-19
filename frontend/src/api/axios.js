import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL_LOCAL || "http://localhost:5000";

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
