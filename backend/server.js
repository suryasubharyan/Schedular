import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import startScheduler from "./services/scheduler.service.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  startScheduler(); // 🔥 important
});