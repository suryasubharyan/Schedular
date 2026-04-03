import { jwtVerify } from "jose";
console.log("🔥 verifyJWT middleware HIT");
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-in-env"
);

export const verifyJWT = async (req, res, next) => {
  try {
    console.log("TOKEN FROM HEADER:", req.headers.authorization);
console.log("TOKEN FROM COOKIE:", req.cookies?.token);
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const verified = await jwtVerify(token, JWT_SECRET);

    req.user = verified.payload; // 🔥 { userId, email }

    next();
  } catch (error) {
    console.error("JWT error:", error.message);

    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};

export default verifyJWT;