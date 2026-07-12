import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL_LOCAL || "http://localhost:5000";

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Free-tier hosts (e.g. Render) spin the backend down after idling and take
// a while to wake back up, so the very first request after a lull can fail
// with a bare network error before the server ever sees it. Retry once,
// after a short wait, instead of surfacing that as a broken login/action.
const RETRY_DELAY_MS = 3000;

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const isNetworkError = !error.response && error.code !== "ECONNABORTED";

    if (isNetworkError && config && !config._retried) {
      config._retried = true;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return instance(config);
    }

    return Promise.reject(error);
  }
);

export default instance;
