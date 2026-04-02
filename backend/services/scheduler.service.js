import cron from "node-cron";
import Post from "../models/Post.js";
import User from "../models/User.js";
import axios from "axios";

const startScheduler = () => {
  cron.schedule("* * * * *", async () => {
    console.log("⏰ Checking scheduled posts...");

    try {
      const now = new Date();

      // ✅ pick limited posts (avoid overload)
      const posts = await Post.find({
        scheduledTime: { $lte: now },
        status: "scheduled",
      }).limit(10);

      if (!posts.length) {
        console.log("📭 No posts to publish");
        return;
      }

      // ✅ parallel processing (faster)
      await Promise.all(
        posts.map(async (post) => {
          try {
            // 🔒 prevent duplicate execution
            const locked = await Post.findOneAndUpdate(
              {
                _id: post._id,
                status: "scheduled",
              },
              { status: "processing" },
              { new: true }
            );

            if (!locked) return; // already picked

            const user = await User.findById(post.userId);

            if (!user || !user.accessToken) {
              post.status = "failed";
              await post.save();
              return;
            }

            // 🚀 LinkedIn post
            if (post.platform === "linkedin") {
              await axios.post(
                "https://api.linkedin.com/v2/ugcPosts",
                {
                  author: `urn:li:person:${user.linkedinId}`,
                  lifecycleState: "PUBLISHED",
                  specificContent: {
                    "com.linkedin.ugc.ShareContent": {
                      shareCommentary: {
                        text: post.content,
                      },
                      shareMediaCategory: "NONE",
                    },
                  },
                  visibility: {
                    "com.linkedin.ugc.MemberNetworkVisibility":
                      "PUBLIC",
                  },
                },
                {
                  headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                    "X-Restli-Protocol-Version": "2.0.0",
                  },
                  timeout: 10000, // ⏱️ safety
                }
              );
            }

            // ✅ success
            await Post.findByIdAndUpdate(post._id, {
              status: "posted",
            });

            console.log(`✅ Posted: ${post._id}`);
          } catch (error) {
            console.log(`❌ Failed: ${post._id}`, error.message);

            // 🔁 retry logic (1 retry)
            if (!post.retryCount) post.retryCount = 0;

            if (post.retryCount < 1) {
              await Post.findByIdAndUpdate(post._id, {
                status: "scheduled",
                retryCount: post.retryCount + 1,
              });

              console.log("🔁 Retrying later...");
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