import express from "express";
import { linkedinCallback } from "../controllers/linkedin.controller.js";

const router = express.Router();

// Authorized Redirect URL in the LinkedIn Developer Console.
// Do not rename this route without updating it there first.
router.get("/callback", linkedinCallback);

export default router;
