import axios from "./axios";

export const fetchPosts = (userId) =>
  axios.get(`/api/posts?userId=${userId}`);

export const createPost = (data) =>
  axios.post("/api/posts", data);