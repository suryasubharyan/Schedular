import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/env.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import linkedinRoutes from "./routes/linkedin.routes.js";
import postRoutes from "./routes/post.routes.js";
import availabilityRoutes from "./routes/availability.routes.js";
const app = express();

/**
 * 🌐 CORS CONFIG (VERY IMPORTANT for cookies + OAuth)
 */
app.use(
  cors({
    origin: true, // e.g. http://localhost:3000
    credentials: true, // 🔥 allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * 🍪 Middleware
 */
app.use(cookieParser());
app.use(express.json());

/**
 * 🧪 Health Check Route
 */
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

/**
 * 🔐 Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/linkedin", linkedinRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/availability", availabilityRoutes);

/**
 * ❌ 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

/**
 * 💥 Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

export default app;