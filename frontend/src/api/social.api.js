import axios, { BASE_URL } from "./axios";

export const getSocialAccountsAPI = () => axios.get("/api/social/accounts");
export const getSocialAccountAPI = (platform) =>
  axios.get(`/api/social/account/${platform}`);
export const connectSocialPlatformAPI = (platform) =>
  axios.post(`/api/social/connect/${platform}`);
export const openSocialPlatformConnect = (platform) => {
  window.location.href = `${BASE_URL}/api/social/connect/${platform}`;
};
export const disconnectSocialPlatformAPI = (platform) =>
  axios.post(`/api/social/disconnect/${platform}`);
