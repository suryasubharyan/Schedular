import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    platform: {
      type: String,
      enum: ["linkedin", "instagram", "facebook", "x"],
      default: "linkedin",
    },
    imageUrl: String,
    
    // Naye fields frontend ke hisab se
    scheduledDate: String, // e.g., "2024-10-28"
    scheduledSlot: String, // e.g., "14:30"
    scheduledTime: Date,   // Actual Date object (cron job ke liye)
    
    status: {
      type: String,
      // Naye UI states aur scheduler states add kiye hain
      enum: ["draft", "saved", "scheduled", "posted", "failed", "processing"],
      default: "draft",
    },
    
    retryCount: { type: Number, default: 0 } // Scheduler ki retry logic ke liye
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);