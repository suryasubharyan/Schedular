import Post from "../models/Post.js";
import LinkedInAccount from "../models/LinkedInAccount.js";
import { createLinkedInPost } from "../services/linkedin.service.js";
import Availability from "../models/Availability.js";

const convertTo24Hour = (time) => {
  const [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
};

// ✅ CREATE POST
export const createPost = async (req, res) => {
  try {
    const {
      content,
      platform = "linkedin",
      imageUrl,
      imageUrls,
      scheduledDate,
      scheduledSlot,
      status = "draft",
    } = req.body;

    const userId = req.user.userId;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const normalizedImages = Array.isArray(imageUrls)
      ? imageUrls.slice(0, 10).filter(Boolean)
      : imageUrl
      ? [imageUrl]
      : [];

    // 🔥 GET ACCOUNT
    const account = await LinkedInAccount.findOne({
      userId,
      connected: true,
    }).sort({ createdAt: -1 });

    if (!account) {
      return res.status(400).json({ error: "LinkedIn not connected" });
    }

    let scheduledTime = null;

    // 🔥 SCHEDULE
    if (status === "scheduled") {
      if (!scheduledDate || !scheduledSlot) {
        return res.status(400).json({
          error: "Date & time required",
        });
      }

      const [hours, minutes] = scheduledSlot.split(":").map(Number);

      scheduledTime = new Date(scheduledDate);
      scheduledTime.setHours(hours, minutes, 0, 0);

      if (scheduledTime < new Date()) {
        return res.status(400).json({ error: "Time must be future" });
      }

      // 🔥 ATOMIC SLOT LOCK
      const result = await Availability.findOneAndUpdate(
        {
          userId,
          date: scheduledDate,
          bookedSlots: { $ne: scheduledSlot },
        },
        {
          $push: { bookedSlots: scheduledSlot },
        },
        { upsert: true, new: true }
      );

      if (!result) {
        return res.status(400).json({ error: "Slot already booked" });
      }
    }

    // 🚀 POST NOW
    if (status === "posted") {
      const linkedInUrl = await createLinkedInPost({
        accessToken: account.accessToken,
        linkedinId: account.linkedinId,
        content,
        imageUrls: normalizedImages,
      });

      const post = await Post.create({
        content,
        userId,
        accountId: account._id,
        imageUrls: normalizedImages,
        scheduledTime: new Date(),
        status,
        linkedInUrl,
      });

      return res.json({ success: true, post });
    }

    // 📝 SAVE
    const post = await Post.create({
      content,
      userId,
      accountId: account._id,
      imageUrls: normalizedImages,
      scheduledDate,
      scheduledSlot,
      scheduledTime,
      status,
    });

    res.json({ success: true, post });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const post = await Post.findOne({ _id: id, userId });
    if (!post) return res.status(404).json({ error: "Not found" });

    const {
      content,
      status,
      imageUrl,
      imageUrls,
      scheduledDate,
      scheduledSlot,
    } = req.body;

    const normalizedImages = Array.isArray(imageUrls)
      ? imageUrls.slice(0, 10).filter(Boolean)
      : imageUrl
      ? [imageUrl]
      : [];

    const account = await LinkedInAccount.findById(post.accountId);

    // 🔥 RESCHEDULE
    if (status === "scheduled") {
      const [hours, minutes] = scheduledSlot.split(":").map(Number);

      const scheduledTime = new Date(scheduledDate);
      scheduledTime.setHours(hours, minutes, 0, 0);

      if (scheduledTime < new Date()) {
        return res.status(400).json({ error: "Future time required" });
      }

      // ❌ REMOVE OLD SLOT
      if (post.scheduledDate && post.scheduledSlot) {
        await Availability.updateOne(
          { userId, date: post.scheduledDate },
          { $pull: { bookedSlots: post.scheduledSlot } }
        );
      }

      // ✅ NEW SLOT LOCK
      const result = await Availability.findOneAndUpdate(
        {
          userId,
          date: scheduledDate,
          bookedSlots: { $ne: scheduledSlot },
        },
        {
          $push: { bookedSlots: scheduledSlot },
        },
        { upsert: true, new: true }
      );

      if (!result) {
        return res.status(400).json({ error: "Slot already booked" });
      }

      post.scheduledDate = scheduledDate;
      post.scheduledSlot = scheduledSlot;
      post.scheduledTime = scheduledTime;
      post.status = "scheduled";
    }

    // 🚀 POST NOW
    if (status === "posted") {
      const linkedInUrl = await createLinkedInPost({
        accessToken: account.accessToken,
        linkedinId: account.linkedinId,
        content: content || post.content,
        imageUrls: normalizedImages.length
          ? normalizedImages
          : post.imageUrls,
      });

      post.status = "posted";
      post.linkedInUrl = linkedInUrl;

      // cleanup
      post.scheduledDate = null;
      post.scheduledSlot = null;
      post.scheduledTime = null;
    }

    if (content) post.content = content;
    if (normalizedImages.length) post.imageUrls = normalizedImages;

    await post.save();

    res.json({ success: true, post });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ✅ GET POSTS
export const getPosts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, accountId } = req.query;

    const filter = { userId };

    if (accountId) filter.accountId = accountId;
    if (status) filter.status = status;

    const posts = await Post.find(filter).sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET SINGLE POST
export const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ UPDATE POST


// ✅ DELETE POST
export const deletePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const post = await Post.findOneAndDelete({ _id: id, userId });

    if (!post) return res.status(404).json({ error: "Not found" });

    if (post.scheduledDate && post.scheduledSlot) {
      await Availability.updateOne(
        { userId, date: post.scheduledDate },
        { $pull: { bookedSlots: post.scheduledSlot } }
      );
    }

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};