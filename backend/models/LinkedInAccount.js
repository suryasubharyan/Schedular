import mongoose from "mongoose";

const linkedInAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    linkedinId: {
      type: String,
      required: true,
    },

    accessToken: {
      type: String,
      required: true,
    },

   name: String,
   email: String,
   profilePicture: String,

   connected: { 
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

linkedInAccountSchema.index({ userId: 1, linkedinId: 1 }, { unique: true });

export default mongoose.model("LinkedInAccount", linkedInAccountSchema);