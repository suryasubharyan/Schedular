import express from "express";
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
router.post("/login", login);

/**
 * 🔵 POST /api/auth/google-login
 * Login with Google OAuth token
 * Body: { googleToken }
 */
router.post("/google-login", googleLogin);

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
router.post("/logout", logout);

export default router;
