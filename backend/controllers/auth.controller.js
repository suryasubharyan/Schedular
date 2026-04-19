import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const serializeUser = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name || "",
  headline: user.headline || "",
  profilePicture: user.customProfilePicture || "",
  authProvider: user.authProvider,
});

const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/\d/.test(password)) {
    return "Password must contain at least one number";
  }
  return null; // valid
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      name: name?.trim() || normalizedEmail.split("@")[0],
      authProvider: "local",
      lastLogin: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const user = await User.findOne({ email: normalizedEmail, authProvider: "local" });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.ENV === "prod",
      sameSite: process.env.ENV === "prod" ? "none" : "lax",
    });

    res.json({
      success: true,
      message: "Login successful",
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
};

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
    if (!payload?.email) {
      return res.status(400).json({ error: "Google account email is missing" });
    }

    const normalizedEmail = payload.email.trim().toLowerCase();
    console.log("Email:", normalizedEmail);
    let user = await User.findOne({
      $or: [{ googleId: payload.sub }, { email: normalizedEmail }],
    });

    if (user) {
      // If user exists with this email but was registered locally, prevent Google login
      if (user.authProvider === "local" && !user.googleId) {
        return res.status(400).json({
          error: "An account with this email already exists. Please login with your password."
        });
      }

      // Update existing Google user or link Google to existing account
      if (!user.googleId) {
        user.googleId = payload.sub;
      }

      if (user.authProvider !== "local") {
        user.authProvider = "google";
      }

      user.name = payload.name || user.name;
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        googleId: payload.sub,
        email: normalizedEmail,
        name: payload.name,
        authProvider: "google",
        lastLogin: new Date(),
      });
    }

    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.ENV === "prod",
      sameSite: process.env.ENV === "prod" ? "none" : "lax",
    });

    res.json({
      success: true,
      message: "Google login successful",
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ error: "Google authentication failed" });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Token is required" });
    }

    const verified = await jwtVerify(token, JWT_SECRET);
    const user = await User.findById(verified.payload.userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user: serializeUser(user),
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user: serializeUser(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, headline, profilePicture } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const nextEmail = typeof email === "string" ? email.trim().toLowerCase() : null;
    if (nextEmail && nextEmail !== user.email) {
      const existingUser = await User.findOne({
        email: nextEmail,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email is already in use" });
      }

      user.email = nextEmail;
    }

    if (typeof name === "string") {
      user.name = name.trim();
    }

    if (typeof headline === "string") {
      user.headline = headline.trim();
    }

    if (typeof profilePicture === "string") {
      user.customProfilePicture = profilePicture.trim();
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: serializeUser(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};
