import mongoose from "mongoose";

const socialAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    platform: {
      type: String,
      enum: ["linkedin", "instagram", "facebook", "x"],
      required: true,
    },
    platformUserId: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      default: "",
    },
    tokenType: {
      type: String,
      default: "Bearer",
    },
    scopes: {
      type: [String],
      default: [],
    },
    tokenExpiresAt: {
      type: Date,
      default: null,
    },
    username: String,
    name: String,
    email: String,
    bio: String,
    profilePicture: String,
    profileHeadline: String,
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
    connected: {
      type: Boolean,
      default: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

socialAccountSchema.index(
  { userId: 1, platform: 1, platformUserId: 1 },
  { unique: true }
);

export default mongoose.model("SocialAccount", socialAccountSchema);
