import express from "express";
import {
  connectLinkedIn,
  linkedinCallback,
} from "../controllers/linkedin.controller.js";

const router = express.Router();

router.get("/connect", connectLinkedIn);
router.get("/callback", linkedinCallback);


export default router;