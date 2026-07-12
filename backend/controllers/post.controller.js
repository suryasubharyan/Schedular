import Post from "../models/Post.js";
import Availability from "../models/Availability.js";
import {
  getPlatformConfig,
  getSocialAccountForUser,
  normalizePlatform,
} from "../services/social-account.service.js";
import { publishSocialPost } from "../services/social-publish.service.js";

const BAD_REQUEST_MESSAGES = [
  "Content is required",
  "Date & time required",
  "Slot already booked",
  "Time must be future",
  "Future time required",
];

const normalizeImages = (imageUrl, imageUrls, maxImages) => {
  const images = Array.isArray(imageUrls)
    ? imageUrls.filter(Boolean)
    : imageUrl
    ? [imageUrl]
    : [];

  return images.slice(0, maxImages);
};

const buildMediaType = ({ imageUrls = [], videoUrl = "" }) => {
  if (videoUrl && imageUrls.length) return "mixed";
  if (videoUrl) return "video";
  if (imageUrls.length) return "image";
  return "text";
};

const buildScheduledTime = (scheduledDate, scheduledSlot) => {
  const [hours, minutes] = scheduledSlot.split(":").map(Number);
  const scheduledTime = new Date(scheduledDate);
  scheduledTime.setHours(hours, minutes, 0, 0);
  return scheduledTime;
};

const releaseAvailabilitySlot = async ({ userId, scheduledDate, scheduledSlot }) => {
  if (!scheduledDate || !scheduledSlot) return;

  await Availability.updateOne(
    { userId, date: scheduledDate },
    { $pull: { bookedSlots: scheduledSlot } }
  );
};

const reserveAvailabilitySlot = async ({
  userId,
  scheduledDate,
  scheduledSlot,
  previousSlot,
}) => {
  try {
    if (previousSlot) {
      await releaseAvailabilitySlot({
        userId,
        scheduledDate: previousSlot.scheduledDate,
        scheduledSlot: previousSlot.scheduledSlot,
      });
    }

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
      throw new Error("Slot already booked");
    }
  } catch (error) {
    if (error?.code === 11000) {
      throw new Error("Slot already booked");
    }

    throw error;
  }
};

const validateMediaForPlatform = ({ platform, imageUrls, videoUrl }) => {
  const config = getPlatformConfig(platform);

  if (imageUrls.length > config.maxImages) {
    throw new Error(`Only ${config.maxImages} images allowed for ${config.label}`);
  }

  if (videoUrl && !config.supportsVideo) {
    throw new Error(`${config.label} does not support video publishing`);
  }
};

const validatePostPayload = ({ content, status, scheduledDate, scheduledSlot }) => {
  if (!content?.trim()) {
    throw new Error("Content is required");
  }

  if (status === "scheduled" && (!scheduledDate || !scheduledSlot)) {
    throw new Error("Date & time required");
  }
};

const applySharedPostFields = ({
  post,
  accountId,
  platform,
  content,
  imageUrls,
  videoUrl,
}) => {
  post.accountId = accountId;
  post.platform = platform;
  post.content = content.trim();
  post.imageUrls = imageUrls;
  post.videoUrl = videoUrl || "";
  post.mediaType = buildMediaType({ imageUrls, videoUrl });
};

export const createPost = async (req, res) => {
  try {
    const {
      content,
      platform = "linkedin",
      imageUrl,
      imageUrls,
      videoUrl = "",
      scheduledDate,
      scheduledSlot,
      status = "draft",
    } = req.body;

    validatePostPayload({ content, status, scheduledDate, scheduledSlot });

    const userId = req.user.userId;
    const normalizedPlatform = normalizePlatform(platform);
    const platformConfig = getPlatformConfig(normalizedPlatform);
    const normalizedImages = normalizeImages(
      imageUrl,
      imageUrls,
      platformConfig.maxImages
    );

    validateMediaForPlatform({
      platform: normalizedPlatform,
      imageUrls: normalizedImages,
      videoUrl,
    });

    const account = await getSocialAccountForUser(userId, normalizedPlatform);
    if (!account) {
      return res.status(400).json({
        error: `${platformConfig.label} not connected`,
      });
    }

    let scheduledTime = null;

    if (status === "scheduled") {
      scheduledTime = buildScheduledTime(scheduledDate, scheduledSlot);

      if (scheduledTime < new Date()) {
        return res.status(400).json({ error: "Time must be future" });
      }

      try {
        await reserveAvailabilitySlot({
          userId,
          scheduledDate,
          scheduledSlot,
        });
      } catch (slotError) {
        return res.status(400).json({ error: slotError.message });
      }
    }

    const post = await Post.create({
      content: content.trim(),
      userId,
      accountId: account._id,
      platform: normalizedPlatform,
      imageUrls: normalizedImages,
      videoUrl,
      mediaType: buildMediaType({
        imageUrls: normalizedImages,
        videoUrl,
      }),
      scheduledDate,
      scheduledSlot,
      scheduledTime: status === "posted" ? new Date() : scheduledTime,
      status,
    });

    if (status === "posted") {
      const publishResult = await publishSocialPost({
        platform: normalizedPlatform,
        account,
        post,
      });

      post.linkedInUrl = publishResult.linkedInUrl || "";
      post.publishedUrl = publishResult.publishedUrl || "";
      await post.save();
    }

    res.json({ success: true, post });
  } catch (error) {
    const statusCode =
      BAD_REQUEST_MESSAGES.includes(error.message) ||
      error.message.includes("images allowed") ||
      error.message.includes("does not support video publishing")
        ? 400
        : 500;
    res.status(statusCode).json({ error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const post = await Post.findOne({ _id: id, userId });

    if (!post) {
      return res.status(404).json({ error: "Not found" });
    }

    const {
      content,
      status = post.status,
      platform = post.platform,
      imageUrl,
      imageUrls,
      videoUrl,
      scheduledDate,
      scheduledSlot,
    } = req.body;

    const nextContent = content ?? post.content;
    const nextPlatform = normalizePlatform(platform);
    const platformConfig = getPlatformConfig(nextPlatform);
    const normalizedImages = normalizeImages(
      imageUrl,
      imageUrls,
      platformConfig.maxImages
    );
    const nextImages =
      Array.isArray(imageUrls) || imageUrl !== undefined ? normalizedImages : post.imageUrls;
    const nextVideoUrl = typeof videoUrl === "string" ? videoUrl : post.videoUrl || "";

    validatePostPayload({
      content: nextContent,
      status,
      scheduledDate,
      scheduledSlot,
    });

    validateMediaForPlatform({
      platform: nextPlatform,
      imageUrls: nextImages,
      videoUrl: nextVideoUrl,
    });

    const account = await getSocialAccountForUser(userId, nextPlatform);
    if (!account) {
      return res.status(400).json({
        error: `${platformConfig.label} not connected`,
      });
    }

    applySharedPostFields({
      post,
      accountId: account._id,
      platform: nextPlatform,
      content: nextContent,
      imageUrls: nextImages,
      videoUrl: nextVideoUrl,
    });

    if (status === "draft" || status === "saved") {
      await releaseAvailabilitySlot({
        userId,
        scheduledDate: post.scheduledDate,
        scheduledSlot: post.scheduledSlot,
      });

      post.status = status;
      post.scheduledDate = null;
      post.scheduledSlot = null;
      post.scheduledTime = null;
    }

    if (status === "scheduled") {
      const nextScheduledTime = buildScheduledTime(scheduledDate, scheduledSlot);

      if (nextScheduledTime < new Date()) {
        return res.status(400).json({ error: "Future time required" });
      }

      try {
        await reserveAvailabilitySlot({
          userId,
          scheduledDate,
          scheduledSlot,
          previousSlot:
            post.scheduledDate && post.scheduledSlot
              ? {
                  scheduledDate: post.scheduledDate,
                  scheduledSlot: post.scheduledSlot,
                }
              : null,
        });
      } catch (slotError) {
        return res.status(400).json({ error: slotError.message });
      }

      post.status = "scheduled";
      post.scheduledDate = scheduledDate;
      post.scheduledSlot = scheduledSlot;
      post.scheduledTime = nextScheduledTime;
    }

    if (status === "posted") {
      await releaseAvailabilitySlot({
        userId,
        scheduledDate: post.scheduledDate,
        scheduledSlot: post.scheduledSlot,
      });

      const publishResult = await publishSocialPost({
        platform: nextPlatform,
        account,
        post,
      });

      post.status = "posted";
      post.linkedInUrl = publishResult.linkedInUrl || "";
      post.publishedUrl = publishResult.publishedUrl || "";
      post.scheduledDate = null;
      post.scheduledSlot = null;
      post.scheduledTime = null;
    }

    await post.save();

    res.json({ success: true, post });
  } catch (err) {
    const statusCode =
      BAD_REQUEST_MESSAGES.includes(err.message) ||
      err.message.includes("images allowed") ||
      err.message.includes("does not support video publishing")
        ? 400
        : 500;
    res.status(statusCode).json({ error: err.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, accountId, platform } = req.query;

    const filter = { userId };

    if (accountId) filter.accountId = accountId;
    if (status) filter.status = status;
    if (platform) filter.platform = normalizePlatform(platform);

    const posts = await Post.find(filter).sort({ createdAt: -1 });
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

export const deletePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const post = await Post.findOneAndDelete({ _id: id, userId });

    if (!post) return res.status(404).json({ error: "Not found" });

    await releaseAvailabilitySlot({
      userId,
      scheduledDate: post.scheduledDate,
      scheduledSlot: post.scheduledSlot,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
