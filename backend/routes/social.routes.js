import express from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import {
  connectSocialPlatformXHR,
  connectSocialPlatform,
  disconnectSocialPlatform,
  getSocialAccount,
  getSocialAccounts,
  socialOAuthCallback,
} from "../controllers/social.controller.js";

const router = express.Router();

router.get("/accounts", verifyJWT, getSocialAccounts);
router.get("/accounts/:platform", verifyJWT, getSocialAccount);
router.get("/accounts/:platform/authorize", verifyJWT, connectSocialPlatform);
router.get("/accounts/:platform/callback", socialOAuthCallback);
router.post("/accounts/:platform", verifyJWT, connectSocialPlatformXHR);
router.delete("/accounts/:platform", verifyJWT, disconnectSocialPlatform);

export default router;
