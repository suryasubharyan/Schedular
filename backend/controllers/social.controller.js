import User from "../models/User.js";
import SocialAccount from "../models/SocialAccount.js";
import {
  createDemoSocialAccount,
  getSocialAccountsSummary,
  getSocialAccountForUser,
  normalizePlatform,
  upsertSocialAccount,
} from "../services/social-account.service.js";
import config from "../config/env.js";
import {
  buildPlatformAuthorizationUrl,
  getSocialProviderConfig,
  hasOAuthCredentials,
  resolvePlatformOAuthAccount,
  verifyPlatformOAuthState,
} from "../services/social-provider.service.js";

export const getSocialAccounts = async (req, res) => {
  try {
    const accounts = await getSocialAccountsSummary(req.user.userId);
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const connectSocialPlatform = async (req, res) => {
  try {
    const platform = normalizePlatform(req.params.platform);
    const provider = getSocialProviderConfig(platform);
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (provider.connectMode === "oauth" && hasOAuthCredentials(platform)) {
      const authUrl = await buildPlatformAuthorizationUrl({
        platform,
        userId: req.user.userId,
      });

      return res.redirect(authUrl);
    }

    const account = await createDemoSocialAccount({ user, platform });
    res.redirect(`${config.frontendUrl}/dashboard?connected=${platform}&mode=demo`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const connectSocialPlatformXHR = async (req, res) => {
  try {
    const platform = normalizePlatform(req.params.platform);
    const provider = getSocialProviderConfig(platform);
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (provider.connectMode === "oauth" && hasOAuthCredentials(platform)) {
      const authUrl = await buildPlatformAuthorizationUrl({
        platform,
        userId: req.user.userId,
      });

      return res.json({ success: true, mode: "oauth", authUrl });
    }

    const account = await createDemoSocialAccount({ user, platform });
    res.json({ success: true, mode: "demo", account });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const socialOAuthCallback = async (req, res) => {
  const platform = normalizePlatform(req.params.platform);

  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.redirect(`${config.frontendUrl}/dashboard?error=${platform}_connect_failed`);
    }

    const oauthState = await verifyPlatformOAuthState(state);
    const oauthAccount = await resolvePlatformOAuthAccount({ platform, code });
    await upsertSocialAccount({
      userId: oauthState.userId,
      platform,
      platformUserId: oauthAccount.platformUserId,
      accessToken: oauthAccount.accessToken,
      refreshToken: oauthAccount.refreshToken,
      tokenType: oauthAccount.tokenType,
      scopes: oauthAccount.scopes,
      tokenExpiresAt: oauthAccount.tokenExpiresAt,
      profile: oauthAccount.profile,
      metadata: oauthAccount.metadata,
    });

    res.redirect(`${config.frontendUrl}/dashboard?connected=${platform}&mode=oauth`);
  } catch (error) {
    console.error(`${platform} OAuth error:`, error.response?.data || error.message);
    res.redirect(`${config.frontendUrl}/dashboard?error=${platform}_connect_failed`);
  }
};

export const getSocialAccount = async (req, res) => {
  try {
    const platform = normalizePlatform(req.params.platform);
    const account = await getSocialAccountForUser(req.user.userId, platform);

    if (!account) {
      return res.json({
        platform,
        label: getSocialProviderConfig(platform).label,
        connected: false,
        accountId: null,
        connectionMode: getSocialProviderConfig(platform).connectMode,
        profile: null,
      });
    }

    res.json({
      platform,
      label: getSocialProviderConfig(platform).label,
      connected: true,
      accountId: account._id,
      connectionMode: getSocialProviderConfig(platform).connectMode,
      profile: {
        name: account.name,
        email: account.email,
        username: account.username,
        bio: account.bio,
        profilePicture: account.profilePicture,
        profileHeadline: account.profileHeadline,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const disconnectSocialPlatform = async (req, res) => {
  try {
    const platform = normalizePlatform(req.params.platform);

    await SocialAccount.updateMany(
      { userId: req.user.userId, platform },
      { connected: false, accessToken: "" }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
