import express from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  login,
  googleLogin,
  verifyToken,
  getCurrentUser,
  updateProfile,
  logout,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 📝 POST /api/auth/register
 * Register with email and password
 * Body: { email, password, name? }
 */
router.post("/register", register);

/**
 * 🔐 POST /api/auth/login
 * Login with email and password
 * Body: { email, password }
 */
router.post("/login", authLimiter, login);

/**
 * 🔵 POST /api/auth/google-login
 * Login with Google OAuth token
 * Body: { googleToken }
 */
router.post("/google-login", authLimiter, googleLogin);

/**
 * ✅ GET /api/auth/verify
 * Verify JWT token validity
 * Headers: Authorization: Bearer <token>
 */
router.get("/verify", verifyToken);

router.get("/me", verifyJWT, getCurrentUser);

router.put("/me", verifyJWT, updateProfile);

/**
 * 🚪 POST /api/auth/logout
 * Logout user (frontend clears token)
 */
router.post("/logout", verifyJWT, logout);

export default router;
