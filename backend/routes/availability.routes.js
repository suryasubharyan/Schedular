import express from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { getAvailability } from "../controllers/availability.controller.js";

const router = express.Router();

router.get("/:date", verifyJWT, getAvailability);

export default router;
