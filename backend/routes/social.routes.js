import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
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
router.get("/account/:platform", verifyJWT, getSocialAccount);
router.get("/connect/:platform", verifyJWT, connectSocialPlatform);
router.get("/callback/:platform", socialOAuthCallback);
router.post("/connect/:platform", verifyJWT, connectSocialPlatformXHR);
router.post("/disconnect/:platform", verifyJWT, disconnectSocialPlatform);

export default router;
