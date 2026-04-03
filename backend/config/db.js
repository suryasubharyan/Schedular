import mongoose from "mongoose";
import config from "./env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log(`✅ MongoDB Connected (${process.env.ENV})`);
  } catch (error) {
    console.log("❌ DB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;