import express from "express";
import {
  connectLinkedIn,
  linkedinCallback,
  getLinkedInAccount,
  disconnectLinkedIn,
} from "../controllers/linkedin.controller.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/connect", verifyJWT, connectLinkedIn);
router.get("/callback", linkedinCallback);
router.get("/me", verifyJWT, getLinkedInAccount);
router.post("/disconnect", verifyJWT, disconnectLinkedIn);

export default router;