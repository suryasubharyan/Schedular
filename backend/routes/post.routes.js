import express from "express";
import verifyJWT from "../middleware/auth.middleware.js";

import { createPost, getPosts, getSinglePost, updatePost, deletePost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/", verifyJWT, createPost);
router.get("/", verifyJWT, getPosts);
router.get("/:id", verifyJWT, getSinglePost);
router.patch("/:id", verifyJWT, updatePost);
router.delete("/:id", verifyJWT, deletePost);

export default router;
