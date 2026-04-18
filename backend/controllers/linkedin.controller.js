import axios from "axios";
import LinkedInAccount from "../models/LinkedInAccount.js";
import config from "../config/env.js";
import User from "../models/User.js";

export const connectLinkedIn = (req, res) => {
  const state = Math.random().toString(36).substring(7);

  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${config.redirectUri}&state=${state}&scope=openid%20profile%20email%20w_member_social`;

  res.redirect(url);
};

export const linkedinCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const userIdFromJWT = req.user.userId;

    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri: config.redirectUri,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    const userInfoRes = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const userInfo = userInfoRes.data;
    const linkedinId = userInfo.sub;
    const email = userInfo.email;
    let user = await User.findById(userIdFromJWT);
    if (!user) {
      user = await User.findOne({ email });
    }
    if (!user) {
      user = await User.create({
        email,
        name: userInfo.name,
        authProvider: "linkedin",
      });
    } else {
      user.authProvider = "linkedin";
      await user.save();
    }

    await LinkedInAccount.findOneAndUpdate(
      { userId: user._id, linkedinId },
      {
        userId: user._id,
        linkedinId,
        accessToken,
        name: userInfo.name,
        email,
        profilePicture: userInfo.picture,
      },
      { upsert: true, returnDocument: "after" }
    );

    res.redirect(`${config.frontendUrl}/dashboard`);
  } catch (error) {
    console.error("LinkedIn error:", error.response?.data || error.message);

    res.redirect(`${config.frontendUrl}/dashboard?error=linkedin_failed`);
  }
};

export const getLinkedInAccount = async (req, res) => {
  try {
    const account = await LinkedInAccount.findOne({
      userId: req.user.userId,
    });

    if (!account) {
      return res.json({ connected: false });
    }
    res.json({
      connected: true,
      profile: {
        name: account.name,
        email: account.email,
        profilePicture: account.profilePicture,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch account" });
  }
};

export const disconnectLinkedIn = async (req, res) => {
  try {
    await LinkedInAccount.deleteOne({
      userId: req.user.userId,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Disconnect failed" });
  }
};