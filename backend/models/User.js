import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },

    googleId: { type: String },

    name: { type: String },
    headline: { type: String },
    profilePicture: { type: String },
    authProvider: {
      type: String,
      enum: ["local", "google", "linkedin"],
      default: "local",
    },

    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);