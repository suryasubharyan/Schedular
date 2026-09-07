import { socialOAuthCallback } from "./social.controller.js";

export const linkedinCallback = (req, res) => {
  req.params.platform = "linkedin";
  return socialOAuthCallback(req, res);
};
