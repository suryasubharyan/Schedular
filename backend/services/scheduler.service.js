import cron from "node-cron";
import Post from "../models/Post.js";
import { getSocialAccountForUser } from "./social-account.service.js";
import { publishSocialPost } from "./social-publish.service.js";

const startScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date(new Date().toISOString());

      const posts = await Post.find({
        status: "scheduled",
        scheduledTime: { $lte: now },
      })
        .sort({ scheduledTime: 1 })
        .limit(10);

      if (!posts.length) {
        return;
      }

      console.log(`Scheduler: publishing ${posts.length} due post(s)...`);

      for (const post of posts) {
        try {
          const lockedPost = await Post.findOneAndUpdate(
            {
              _id: post._id,
              status: "scheduled",
            },
            {
              status: "processing",
            },
            { new: true }
          );

          if (!lockedPost) continue;

          const account = await getSocialAccountForUser(
            lockedPost.userId,
            lockedPost.platform
          );

          if (!account || !account.connected) {
            console.log(`No connected account for ${lockedPost.platform}`);
            await Post.findByIdAndUpdate(lockedPost._id, {
              status: "failed",
            });
            continue;
          }

          const publishResult = await publishSocialPost({
            platform: lockedPost.platform,
            account,
            post: lockedPost,
          });

          await Post.findByIdAndUpdate(lockedPost._id, {
            status: "posted",
            linkedInUrl: publishResult.linkedInUrl || "",
            publishedUrl: publishResult.publishedUrl || "",
            retryCount: 0,
          });

          console.log(`Posted: ${lockedPost._id}`);
        } catch (error) {
          console.log(`Failed: ${post._id}`, error.message);

          const retryPost = await Post.findById(post._id);

          if (!retryPost) continue;

          if (retryPost.retryCount < 3) {
            await Post.findByIdAndUpdate(post._id, {
              status: "scheduled",
              retryCount: retryPost.retryCount + 1,
            });
          } else {
            await Post.findByIdAndUpdate(post._id, {
              status: "failed",
            });
          }
        }
      }
    } catch (err) {
      console.error("Scheduler Error:", err.message);
    }
  });
};

export default startScheduler;
