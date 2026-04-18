// models/Availability.js

import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    date: {
      type: String, // "2026-04-10"
      required: true
    },

    bookedSlots: [
      {
        type: String // "10:00 AM"
      }
    ]
  },
  { timestamps: true }
);

// 🔥 important (duplicate entry avoid karega)
availabilitySchema.index(
  { userId: 1, date: 1 },
  { unique: true }
);

export default mongoose.model("Availability", availabilitySchema);