import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-in-env"
);

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * 📝 Register
 */
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name: name || email.split("@")[0],
      authProvider: "local",
    });

    const token = await new SignJWT({ userId: user._id.toString(), email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    // 🔥 SET COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // production me true
      sameSite: "none",
    });

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
 * 🔐 Login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email, authProvider: "local" });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = await new SignJWT({ userId: user._id.toString(), email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    // 🔥 SET COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

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
 * 🔵 Google Login
 */
export const googleLogin = async (req, res) => {
  try {
    const { googleToken } = req.body;

    if (!googleToken) {
      return res.status(400).json({ error: "Google token is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    let user = await User.findOne({
      $or: [{ googleId: payload.sub }, { email: payload.email }],
    });

    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        profilePicture: payload.picture,
        authProvider: "google",
      });
    } else {
      if (!user.googleId) {
        user.googleId = payload.sub;
        user.authProvider = "google";
      }
      user.lastLogin = new Date();
      await user.save();
    }

    const token = await new SignJWT({ userId: user._id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    // 🔥 SET COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

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
    res.status(401).json({ error: "Google authentication failed" });
  }
};

/**
 * ✅ Verify Token
 */
export const verifyToken = async (req, res) => {
  console.log("🔥 verifyToken HIT");
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "");
    console.log("TOKEN FROM HEADER:", req.headers.authorization);
console.log("TOKEN FROM COOKIE:", req.cookies?.token);
    if (!token) {
      return res.status(401).json({ error: "Token is required" });
    }

    const verified = await jwtVerify(token, JWT_SECRET);
    const userId = verified.payload.userId;

    const user = await User.findById(userId);

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

/**
 * 🚪 Logout
 */
export const logout = (req, res) => {
  res.clearCookie("token");

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};