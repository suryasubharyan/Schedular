import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-in-env"
);

/**
 * 🔐 JWT Verification Middleware
 * Verifies token from Authorization header and adds user to req
 */
export const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const verified = await jwtVerify(token, JWT_SECRET);
    req.user = verified.payload;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default verifyJWT;
