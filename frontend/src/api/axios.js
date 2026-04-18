import axios from "axios";

const ENV = import.meta.env.VITE_ENV || "prod";
const LOCAL_API_URL = import.meta.env.VITE_API_URL_LOCAL || "http://localhost:5000";
const PROD_API_URL = import.meta.env.VITE_API_URL_PROD || "https://schedular-dbnc.onrender.com";

const BASE_URL = ENV === "local" ? LOCAL_API_URL : PROD_API_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const isAuthRoute =
    config.url?.includes("/auth/login") ||
    config.url?.includes("/auth/register") ||
    config.url?.includes("/auth/google-login");

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
