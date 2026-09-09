import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.error(
    "VITE_API_URL is not set in this production build — API calls will incorrectly target localhost."
  );
}

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const RETRY_DELAY_MS = 3000;

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const isNetworkError = !error.response && error.code !== "ECONNABORTED";
    const isRetryableMethod = config?.method?.toLowerCase() === "get";

    if (isNetworkError && config && !config._retried && isRetryableMethod) {
      config._retried = true;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return instance(config);
    }
    return Promise.reject(error);
  }
);

export default instance;
