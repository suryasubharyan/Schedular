import cron from "node-cron";
import Post from "../models/Post.js";
import LinkedInAccount from "../models/LinkedInAccount.js";
import { createLinkedInPost } from "./linkedin.service.js";

const startScheduler = () => {
  cron.schedule("* * * * *", async () => {
    console.log("⏰ Checking scheduled posts...");

    try {
      const now = new Date();

      const posts = await Post.find({
        scheduledTime: { $lte: now },
        status: "scheduled",
      }).limit(10);

      if (!posts.length) {
        console.log("📭 No posts to publish");
        return;
      }

      await Promise.all(
        posts.map(async (post) => {
          try {
            // 🔒 Lock
            const locked = await Post.findOneAndUpdate(
              {
                _id: post._id,
                status: "scheduled",
              },
              { status: "processing" },
              { new: true }
            );

            if (!locked) return;

            // ✅ FIX: LinkedInAccount use karo
            const account = await LinkedInAccount.findOne({
              userId: post.userId,
            });

            if (!account || !account.accessToken) {
              await Post.findByIdAndUpdate(post._id, {
                status: "failed",
              });
              return;
            }

            // 🚀 LinkedIn Post
            if (post.platform === "linkedin") {
              const linkedInUrl = await createLinkedInPost({
                accessToken: account.accessToken,
                linkedinId: account.linkedinId,
                content: post.content,
                imageUrls: post.imageUrls || (post.imageUrl ? [post.imageUrl] : []),
              });

              await Post.findByIdAndUpdate(post._id, {
                status: "posted",
                linkedInUrl: linkedInUrl || post.linkedInUrl,
              });
            } else {
              await Post.findByIdAndUpdate(post._id, {
                status: "posted",
              });
            }

            console.log(`✅ Posted: ${post._id}`);
          } catch (error) {
            console.log(`❌ Failed: ${post._id}`, error.message);

            if (!post.retryCount) post.retryCount = 0;

            if (post.retryCount < 1) {
              await Post.findByIdAndUpdate(post._id, {
                status: "scheduled",
                retryCount: post.retryCount + 1,
              });
            } else {
              await Post.findByIdAndUpdate(post._id, {
                status: "failed",
              });
            }
          }
        })
      );
    } catch (err) {
      console.log("🚨 Scheduler Error:", err.message);
    }
  });
};

export default startScheduler;