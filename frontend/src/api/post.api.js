// src/api/post.api.js
import axios from "./axios";

// ✅ CREATE / SAVE / SCHEDULE
export const createPostAPI = (data) => {
  return axios.post("/api/posts", data);
};

// ✅ GET ALL (optional filter)
export const getPostsAPI = (status) => {
  return axios.get(`/api/posts${status ? `?status=${status}` : ""}`);
};

// ✅ UPDATE (reschedule bhi yahi)
export const updatePostAPI = (id, data) => {
  return axios.put(`/api/posts/${id}`, data);
};

// ✅ DELETE
export const deletePostAPI = (id) => {
  return axios.delete(`/api/posts/${id}`);
};