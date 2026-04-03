import axios from "./axios";

export const register = (data) =>
  axios.post("/api/auth/register", data);

export const login = (data) =>
  axios.post("/api/auth/login", data);

export const googleLogin = (googleToken) =>
  axios.post("/api/auth/google-login", { googleToken });

export const verifyToken = () =>
  axios.get("/api/auth/verify");

export const logoutApi = () =>
  axios.post("/api/auth/logout");