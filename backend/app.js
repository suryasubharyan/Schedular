import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import linkedinRoutes from "./routes/linkedin.routes.js";
import postRoutes from "./routes/post.routes.js";

const app = express();
app.use(cors({ origin: "https://schedular-roan.vercel.app", credentials: true }));

app.use(express.json());

// 🔐 Auth routes
app.use("/api/auth", authRoutes);

// 🔗 LinkedIn & Posts routes
app.use("/api/linkedin", linkedinRoutes);
app.use("/api/posts", postRoutes);

export default app;