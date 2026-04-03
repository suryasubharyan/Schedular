import axios from "axios";

const ENV = import.meta.env.VITE_ENV;

const BASE_URL = ENV === "local" ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PROD;

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (
    token &&
    !config.url.includes("/api/auth/login") &&
    !config.url.includes("/api/auth/register")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;