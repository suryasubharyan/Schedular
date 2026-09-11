import express from "express";
import rateLimit from "express-rate-limit";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { generateCaption, generateImage } from "../controllers/ai.controller.js";

const router = express.Router();

const aiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    message: "Too many AI generation requests, please slow down.",
    standardHeaders: true,
    legacyHeaders: false,
});

router.post("/caption", verifyJWT, aiLimiter, generateCaption);
router.post("/image", verifyJWT, aiLimiter, generateImage);

export default router;