import Post from "../models/Post.js";
import LinkedInAccount from "../models/LinkedInAccount.js";
import { createLinkedInPost } from "../services/linkedin.service.js";
import Availability from "../models/Availability.js";

const convertTo24Hour = (time) => {
  const [timePart, modifier] = time.split(" "); // "10:30 AM"

  let [hours, minutes] = timePart.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }

  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
};

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

    // ✅ FIX: userId from JWT
    const userId = req.user.userId;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const normalizedImages = Array.isArray(imageUrls)
      ? imageUrls.slice(0, 10).filter(Boolean)
      : imageUrl
      ? [imageUrl]
      : [];

    if (normalizedImages.length > 10) {
      return res.status(400).json({ error: "Maximum 10 images allowed" });
    }
    
    if (!["draft", "saved", "scheduled", "posted"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    let scheduledTime = null;
    let availability = null;

    if (status === "scheduled") {
      if (!scheduledDate || !scheduledSlot) {
        return res.status(400).json({
          error: "scheduledDate and scheduledSlot required",
        });
      }

      const { hours, minutes } = convertTo24Hour(scheduledSlot);

scheduledTime = new Date(scheduledDate);
scheduledTime.setHours(hours, minutes, 0, 0);

// ✅ safety check
if (isNaN(scheduledTime.getTime())) {
  return res.status(400).json({
    error: "Invalid date/time format"
  });
}

      if (scheduledTime < new Date()) {
        return res
          .status(400)
          .json({ error: "Time must be in future" });
      }

      availability = await Availability.findOne({
        userId,
        date: scheduledDate,
      });

      if (availability?.bookedSlots.includes(scheduledSlot)) {
        return res.status(400).json({
          error: "Slot already booked",
        });
      }
    }

    // 🚀 Immediate Post
    if (status === "posted") {
      const account = await LinkedInAccount.findOne({ userId });

      if (!account) {
        return res
          .status(400)
          .json({ error: "LinkedIn not connected" });
      }

      if (platform === "linkedin") {
        const linkedInUrl = await createLinkedInPost({
          accessToken: account.accessToken,
          linkedinId: account.linkedinId,
          content,
          imageUrls: normalizedImages,
        });

        scheduledTime = new Date();

        const post = await Post.create({
          content,
          platform,
          userId,
          imageUrl: normalizedImages[0] || imageUrl,
          imageUrls: normalizedImages,
          scheduledDate: status === "scheduled" ? scheduledDate : null,
          scheduledSlot: status === "scheduled" ? scheduledSlot : null,
          scheduledTime,
          status,
          linkedInUrl,
        });

        if (status === "scheduled") {
          if (!availability) {
            await Availability.create({
              userId,
              date: scheduledDate,
              bookedSlots: [scheduledSlot],
            });
          } else {
            availability.bookedSlots.push(scheduledSlot);
            await availability.save();
          }
        }

        return res.status(201).json({
          success: true,
          message: `Post saved as ${status}`,
          post,
        });
      }

      scheduledTime = new Date();
    }

    const post = await Post.create({
      content,
      platform,
      userId,
      imageUrl: normalizedImages[0] || imageUrl,
      imageUrls: normalizedImages,
      scheduledDate: status === "scheduled" ? scheduledDate : null,
      scheduledSlot: status === "scheduled" ? scheduledSlot : null,
      scheduledTime,
      status,
    });

    if (status === "scheduled") {
      if (!availability) {
        await Availability.create({
          userId,
          date: scheduledDate,
          bookedSlots: [scheduledSlot],
        });
      } else {
        availability.bookedSlots.push(scheduledSlot);
        await availability.save();
      }
    }

    res.status(201).json({
      success: true,
      message: `Post saved as ${status}`,
      post,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;

    const filter = { userId };

    if (status) {
      filter.status = status;
    }
    const posts = await Post.find(filter).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const post = await Post.findOne({ _id: id, userId });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

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

    if (normalizedImages.length > 10) {
      return res.status(400).json({ error: "Maximum 10 images allowed" });
    }

    // 🔥 RESCHEDULE LOGIC
    if (status === "scheduled") {
      if (!scheduledDate || !scheduledSlot) {
        return res.status(400).json({
          error: "Date & slot required",
        });
      }

      // ❌ remove old slot
      if (post.scheduledDate && post.scheduledSlot) {
        const old = await Availability.findOne({
          userId,
          date: post.scheduledDate,
        });

        if (old) {
          old.bookedSlots = old.bookedSlots.filter(
            (s) => s !== post.scheduledSlot
          );
          await old.save();
        }
      }

      // ❌ check new slot
      const existing = await Availability.findOne({
        userId,
        date: scheduledDate,
      });

      const isSameSlot =
        scheduledDate === post.scheduledDate &&
        scheduledSlot === post.scheduledSlot;

      if (
        existing &&
        !isSameSlot &&
        existing.bookedSlots.includes(scheduledSlot)
      ) {
        return res.status(400).json({
          error: "Slot already booked",
        });
      }

      // ⏱ convert time
      const { hours, minutes } = convertTo24Hour(scheduledSlot);

      const scheduledTime = new Date(scheduledDate);
      scheduledTime.setHours(hours, minutes, 0, 0);
      if (isNaN(scheduledTime.getTime())) {
  return res.status(400).json({
    error: "Invalid date/time format"
  });
}

      // ✅ save new slot
      if (!existing) {
        await Availability.create({
          userId,
          date: scheduledDate,
          bookedSlots: [scheduledSlot],
        });
      } else {
        existing.bookedSlots.push(scheduledSlot);
        await existing.save();
      }

      post.scheduledDate = scheduledDate;
      post.scheduledSlot = scheduledSlot;
      post.scheduledTime = scheduledTime;
      post.status = "scheduled";
    }

    const isPublishingNow = status === "posted" && post.status !== "posted";

    if (isPublishingNow) {
      if (post.scheduledDate && post.scheduledSlot) {
        const old = await Availability.findOne({
          userId,
          date: post.scheduledDate,
        });

        if (old) {
          old.bookedSlots = old.bookedSlots.filter(
            (s) => s !== post.scheduledSlot
          );
          await old.save();
        }
      }

      const account = await LinkedInAccount.findOne({ userId });
      if (!account) {
        return res.status(400).json({ error: "LinkedIn not connected" });
      }

      const linkedInUrl = await createLinkedInPost({
        accessToken: account.accessToken,
        linkedinId: account.linkedinId,
        content: content || post.content,
        imageUrls: normalizedImages.length ? normalizedImages : post.imageUrls,
      });

      post.linkedInUrl = linkedInUrl || post.linkedInUrl;
      post.status = "posted";
      post.scheduledDate = null;
      post.scheduledSlot = null;
      post.scheduledTime = null;
    }

    if (content) post.content = content;
    if (status && status !== "scheduled") post.status = status;
    post.imageUrls = normalizedImages;
    post.imageUrl = normalizedImages[0] || imageUrl || post.imageUrl;

    await post.save();

    res.json({ success: true, post });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// DELETE /api/posts/:id

export const deletePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const post = await Post.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!post) {
      return res.status(404).json({ error: "Not found" });
    }

    // ❌ remove slot from availability
    if (post.scheduledDate && post.scheduledSlot) {
      const availability = await Availability.findOne({
        userId,
        date: post.scheduledDate,
      });

      if (availability) {
        availability.bookedSlots = availability.bookedSlots.filter(
          (s) => s !== post.scheduledSlot
        );
        await availability.save();
      }
    }

    res.json({ success: true, message: "Post deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
