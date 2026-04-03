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

    name: {
      type: String,
    },

    email: {
      type: String,
    },

    profilePicture: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

linkedInAccountSchema.index({ userId: 1, linkedinId: 1 }, { unique: true });

export default mongoose.model("LinkedInAccount", linkedInAccountSchema);