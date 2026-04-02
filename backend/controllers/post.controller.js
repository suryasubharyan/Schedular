import Post from "../models/Post.js";
import User from "../models/User.js";
import axios from "axios";

export const createPost = async (req, res) => {
  try {
    const {
      content,
      platform = "linkedin",
      userId,
      imageUrl,
      scheduledDate,
      scheduledSlot,
      status = "draft", // Default to draft
    } = req.body;

    if (!content || !userId) {
      return res.status(400).json({ error: "Content and userId are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let scheduledTime = null;

    // Sirf 'scheduled' posts ke liye date/time validation chalega
    if (status === "scheduled") {
      if (!scheduledDate || !scheduledSlot) {
        return res
          .status(400)
          .json({ error: "scheduledDate and scheduledSlot are required for scheduled posts" });
      }

      // Frontend se input type="time" hamesha "HH:mm" (e.g., "14:30") format mein aata hai
      const [hourString, minuteString] = scheduledSlot.split(":");
      const hour = Number(hourString || 0);
      const minute = Number(minuteString || 0);
      
      scheduledTime = new Date(scheduledDate);
      scheduledTime.setHours(hour, minute, 0, 0);

      if (scheduledTime < new Date()) {
        return res.status(400).json({ error: "Scheduled time must be in the future" });
      }
    }

    if (status === "posted") {
      // Immediate publish to LinkedIn
      if (platform === "linkedin") {
        try {
          await axios.post(
            "https://api.linkedin.com/v2/ugcPosts",
            {
              author: `urn:li:person:${user.linkedinId}`,
              lifecycleState: "PUBLISHED",
              specificContent: {
                "com.linkedin.ugc.ShareContent": {
                  shareCommentary: { text: content },
                  shareMediaCategory: "NONE",
                },
              },
              visibility: {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
              },
            },
            {
              headers: {
                Authorization: `Bearer ${user.accessToken}`,
                "X-Restli-Protocol-Version": "2.0.0",
              },
            }
          );
        } catch (liError) {
          return res.status(500).json({
            error: "LinkedIn posting failed",
            details: liError.message,
          });
        }
      }
      scheduledTime = new Date();
    }

    // Post create karein
    const post = await Post.create({
      content,
      platform,
      userId,
      imageUrl,
      scheduledDate: status === "scheduled" ? scheduledDate : null,
      scheduledSlot: status === "scheduled" ? scheduledSlot : null,
      scheduledTime,
      status,
    });

    res.status(201).json({
      success: true,
      message: `✅ Post saved successfully as ${status}`,
      post,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const post = await Post.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const userId = req.query.userId || null;
    const query = userId ? { userId } : {};

    // Sort descending taaki latest posts upar aayen
    const posts = await Post.find(query).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};