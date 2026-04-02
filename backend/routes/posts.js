import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// Create scheduled post
router.post("/create", async (req, res) => {
  try {
    const { content, scheduledTime, platform, imageUrl, userId } = req.body;

    if (!content || !scheduledTime || !platform || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const post = new Post({
      userId,
      platform,
      content,
      imageUrl,
      scheduledAt: new Date(scheduledTime)
    });

    await post.save();
    res.status(201).json({ message: "Post scheduled successfully", post });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ error: "Failed to schedule post" });
  }
});

// Get posts for user
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId }).sort({ scheduledAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

export default router;