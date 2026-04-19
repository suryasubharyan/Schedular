import cron from "node-cron";
import Post from "../models/Post.js";
import LinkedInAccount from "../models/LinkedInAccount.js";
import { createLinkedInPost } from "./linkedin.service.js";

const startScheduler = () => {
  cron.schedule("* * * * *", async () => {
    console.log("⏰ Checking scheduled posts...");

    try {
      const now = new Date();

      // 🔥 STEP 1: FETCH POSTS
      const posts = await Post.find({
        status: "scheduled",
        scheduledTime: { $lte: now },
      })
        .sort({ scheduledTime: 1 })
        .limit(10);

      if (!posts.length) {
        console.log("📭 No posts to publish");
        return;
      }

      // 🔥 STEP 2: PROCESS EACH POST
      for (const post of posts) {
        try {
          // 🔒 LOCK (avoid duplicate processing)
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

          // 🔥 STEP 3: GET LINKEDIN ACCOUNT (FIXED)
          const account = await LinkedInAccount.findById(
            lockedPost.accountId
          );

          if (!account || !account.accessToken) {
            console.log("❌ No LinkedIn account");
            await Post.findByIdAndUpdate(lockedPost._id, {
              status: "failed",
            });
            continue;
          }

          // 🚀 STEP 4: POST TO LINKEDIN
          let linkedInUrl = "";

          if (lockedPost.platform === "linkedin") {
            linkedInUrl = await createLinkedInPost({
              accessToken: account.accessToken,
              linkedinId: account.linkedinId,
              content: lockedPost.content,
              imageUrls:
                lockedPost.imageUrls?.length
                  ? lockedPost.imageUrls
                  : [],
            });
          }

          // ✅ STEP 5: MARK SUCCESS
          await Post.findByIdAndUpdate(lockedPost._id, {
            status: "posted",
            linkedInUrl: linkedInUrl || "",
            retryCount: 0,
          });

          console.log(`✅ Posted: ${lockedPost._id}`);

        } catch (error) {
          console.log(`❌ Failed: ${post._id}`, error.message);

          // 🔁 RETRY LOGIC
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
      console.error("🚨 Scheduler Error:", err.message);
    }
  });
};

export default startScheduler;