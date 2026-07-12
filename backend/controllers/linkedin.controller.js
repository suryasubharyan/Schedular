import {
  connectSocialPlatform,
  disconnectSocialPlatform,
  getSocialAccount,
  socialOAuthCallback,
} from "./social.controller.js";

export const connectLinkedIn = (req, res) => {
  req.params.platform = "linkedin";
  return connectSocialPlatform(req, res);
};

export const linkedinCallback = (req, res) => {
  req.params.platform = "linkedin";
  return socialOAuthCallback(req, res);
};

export const getLinkedInAccount = (req, res) => {
  req.params.platform = "linkedin";
  return getSocialAccount(req, res);
};

export const disconnectLinkedIn = (req, res) => {
  req.params.platform = "linkedin";
  return disconnectSocialPlatform(req, res);
};
