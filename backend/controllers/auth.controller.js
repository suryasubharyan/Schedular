import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-in-env"
);

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * 📝 Register - Create new user with email/password
 */
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name: name || email.split("@")[0],
      authProvider: "local",
    });

    // Generate JWT
    const token = await new SignJWT({ userId: user._id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🔐 Login - Authenticate with email/password
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email, authProvider: "local" });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT
    const token = await new SignJWT({ userId: user._id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🔵 Google Login - Authenticate with Google OAuth token
 */
export const googleLogin = async (req, res) => {
  try {
    const { googleToken } = req.body;

    if (!googleToken) {
      return res.status(400).json({ error: "Google token is required" });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;

    // Find or create user
    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (!user) {
      // Create new user from Google info
      user = await User.create({
        googleId,
        email,
        name,
        authProvider: "google",
        profilePicture: payload.picture,
      });
    } else {
      // Update existing user with Google info if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
      }
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT
    const token = await new SignJWT({ userId: user._id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    res.json({
      success: true,
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res
      .status(401)
      .json({ error: "Google authentication failed", details: error.message });
  }
};

/**
 * ✅ Verify Token - Check if JWT is valid
 */
export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Token is required" });
    }

    const verified = await jwtVerify(token, JWT_SECRET);
    const userId = verified.payload.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        linkedinId: user.linkedinId,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

/**
 * 🚪 Logout - Clear token (frontend will handle)
 */
export const logout = (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};
