import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 📧 Local Auth
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Only for local auth

    // 🔵 Google Auth
    googleId: { type: String },
    profilePicture: { type: String },

    // 🔗 LinkedIn
    linkedinId: { type: String },
    accessToken: { type: String },

    // 👤 Profile
    name: { type: String },
    headline: { type: String },
    profilePicture: { type: String },
    authProvider: {
      type: String,
      enum: ["local", "google", "linkedin"],
      default: "local",
    },

    // 📅 Tracking
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);