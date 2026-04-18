import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";

import {
  createPost,
  getPosts,
  getSinglePost,
  updatePost,
  deletePost
} from "../controllers/post.controller.js";

const router = express.Router();

// ✅ CREATE
router.post("/", verifyJWT, createPost);

// ✅ GET ALL (with optional ?status=draft)
router.get("/", verifyJWT, getPosts);

// ✅ GET SINGLE
router.get("/:id", verifyJWT, getSinglePost);

// ✅ UPDATE (reschedule bhi isi me hoga)
router.put("/:id", verifyJWT, updatePost);

// ✅ DELETE
router.delete("/:id", verifyJWT, deletePost);

export default router;