import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    accountId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LinkedInAccount",
      required: true,
    },

    content: { type: String, required: true },
    
    platform: {
      type: String,
      enum: ["linkedin", "instagram", "facebook", "x"],
      default: "linkedin",
    },

    imageUrl: String,

    imageUrls: {
      type: [String],
      default: [],
    },

    scheduledDate: String,
    scheduledSlot: String,
    scheduledTime: Date,
    
    status: {
      type: String,
      enum: ["draft", "saved", "scheduled", "posted", "failed", "processing"],
      default: "draft",
    },

    linkedInUrl: {
      type: String,
      default: "",
    },

    retryCount: { type: Number, default: 0 } // Scheduler ki retry logic ke liye
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);