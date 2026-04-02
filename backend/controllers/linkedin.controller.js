import axios from "axios";
import User from "../models/User.js";

export const connectLinkedIn = (req, res) => {
  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=openid%20profile%20email%20w_member_social`;

  res.redirect(url);
};

export const linkedinCallback = async (req, res) => {
  try {
    const code = req.query.code;

    // 🔑 Get Access Token
    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.REDIRECT_URI,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        },
      }
    );

    const accessToken = tokenRes.data.access_token;
    console.log("[LinkedIn callback] accessToken:", accessToken);
    console.log("[LinkedIn callback] tokenRes.data:", tokenRes.data);

    // 👤 Try OpenID userinfo (recommended for Sign In with LinkedIn using OpenID Connect)
    let userInfo;
    try {
      const userInfoRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      userInfo = userInfoRes.data;
    } catch (err) {
      console.warn("LinkedIn userinfo failed, falling back to /me endpoint", err.message);
      userInfo = null;
    }

    console.log("[LinkedIn callback] userInfo:", userInfo);

    // fallback /me for profile details
    let meRes;
    try {
      meRes = await axios.get(
        "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,headline,profilePicture(displayImage~:playableStreams))",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (err) {
      console.warn("LinkedIn /me fetch failed", err.message);
      meRes = null;
    }

    console.log("[LinkedIn callback] meRes:", meRes?.data);

    const linkedinId = userInfo?.sub || meRes?.data?.id;
    const firstName = userInfo?.given_name || meRes?.data?.localizedFirstName || "";
    const lastName = userInfo?.family_name || meRes?.data?.localizedLastName || "";
    const name = userInfo?.name || `${firstName} ${lastName}`.trim() || "";
    const headline =
      (meRes?.data?.headline && typeof meRes.data.headline === "string")
        ? meRes.data.headline
        : "";

    let profilePicture = userInfo?.picture || "";

    if (!profilePicture && meRes?.data?.profilePicture) {
      try {
        const elements = meRes.data.profilePicture?.['displayImage~']?.elements || [];
        if (elements.length) {
          const imageCandidates = elements
            .flatMap((item) => item.identifiers || [])
            .filter((id) => id.identifier);
          if (imageCandidates.length) {
            profilePicture = imageCandidates[imageCandidates.length - 1].identifier;
          }
        }
      } catch {
        profilePicture = "";
      }
    }

    const email = userInfo?.email || "";

    let user = await User.findOne({ linkedinId });

    if (!user) {
      user = await User.create({
        linkedinId,
        accessToken,
        name,
        email,
        headline,
        profilePicture,
        authProvider: "linkedin",
      });
    } else {
      user.accessToken = accessToken;
      user.name = name || user.name;
      user.email = email || user.email;
      user.headline = headline || user.headline;
      user.profilePicture = profilePicture || user.profilePicture;
      user.authProvider = "linkedin";
      await user.save();
    }

    const encodedName = encodeURIComponent(user.name || "");
    const encodedEmail = encodeURIComponent(user.email || "");
    const encodedHeadline = encodeURIComponent(user.headline || "");
    const encodedProfilePicture = encodeURIComponent(user.profilePicture || "");

    res.redirect(
      `http://localhost:5173/dashboard?userId=${user._id}&token=${accessToken}&name=${encodedName}&email=${encodedEmail}&headline=${encodedHeadline}&profilePicture=${encodedProfilePicture}`
    );
  } catch (error) {
    console.error("LinkedIn callback error", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    const message = error.response?.data?.error_description || error.message || "Unknown error";
    res.status(error.response?.status || 500).send(`❌ LinkedIn Auth Failed: ${message}`);
  }
};