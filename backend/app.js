import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/env.config.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import linkedinRoutes from "./routes/linkedin.routes.js";
import socialRoutes from "./routes/social.routes.js";
import postRoutes from "./routes/post.routes.js";
import availabilityRoutes from "./routes/availability.routes.js";
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL_LOCAL,
        process.env.FRONTEND_URL_LOCAL_ALT,
        process.env.FRONTEND_URL_PROD,
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
      ].filter(Boolean);

      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.length === 0) {
        return callback(null, true);
      }

      callback(new Error("CORS blocked by server"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/linkedin", linkedinRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/availability", availabilityRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

export default app;
