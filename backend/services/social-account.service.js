import LinkedInAccount from "../models/LinkedInAccount.js";
import SocialAccount from "../models/SocialAccount.js";
import { getSocialProviderConfig } from "./social-provider.service.js";

const PLATFORM_LABELS = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  x: "X",
};

export const PLATFORM_CONFIG = {
  linkedin: {
    label: "LinkedIn",
    maxImages: 10,
    supportsVideo: true,
    videoLimit: 1,
  },
  instagram: {
    label: "Instagram",
    maxImages: 10,
    supportsVideo: true,
    videoLimit: 1,
  },
  facebook: {
    label: "Facebook",
    maxImages: 10,
    supportsVideo: true,
    videoLimit: 1,
  },
  x: {
    label: "X",
    maxImages: 4,
    supportsVideo: true,
    videoLimit: 1,
  },
};

export const getPlatformConfig = (platform = "linkedin") =>
  PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.linkedin;

export const normalizePlatform = (platform = "linkedin") =>
  PLATFORM_CONFIG[platform] ? platform : "linkedin";

export const formatPlatformLabel = (platform = "linkedin") =>
  PLATFORM_LABELS[normalizePlatform(platform)] || "LinkedIn";

const buildDefaultUsername = ({ email, name, platform }) =>
  email?.split("@")?.[0] ||
  name?.replace(/\s+/g, "").toLowerCase() ||
  `${platform}-user`;

const buildAccountSummary = (platform, account) => ({
  platform,
  label: formatPlatformLabel(platform),
  connected: Boolean(account?.connected),
  accountId: account?._id || null,
  connectionMode: getSocialProviderConfig(platform).connectMode,
  connectedAt: account?.connected ? account?.updatedAt || account?.createdAt || null : null,
  profile: account
    ? {
        name: account.name,
        email: account.email,
        username: account.username,
        bio: account.bio,
        profilePicture: account.profilePicture,
        profileHeadline: account.profileHeadline,
      }
    : null,
});

export const upsertSocialAccount = async ({
  userId,
  platform,
  platformUserId,
  accessToken = "",
  refreshToken = "",
  tokenType = "Bearer",
  scopes = [],
  tokenExpiresAt = null,
  profile = {},
  metadata = {},
}) =>
  SocialAccount.findOneAndUpdate(
    {
      userId,
      platform,
      platformUserId,
    },
    {
      userId,
      platform,
      platformUserId,
      accessToken,
      refreshToken,
      tokenType,
      scopes,
      tokenExpiresAt,
      username: profile.username || buildDefaultUsername({
        email: profile.email,
        name: profile.name,
        platform,
      }),
      name: profile.name,
      email: profile.email,
      bio: profile.bio,
      profilePicture: profile.profilePicture,
      profileHeadline: profile.profileHeadline,
      connected: true,
      lastSyncedAt: new Date(),
      metadata,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

const buildLinkedInProfile = (account) => buildAccountSummary("linkedin", {
  _id: account?._id,
  connected: account?.connected,
  name: account?.name,
  email: account?.email,
  username: account?.email?.split("@")?.[0] || "linkedin-user",
  profilePicture: account?.profilePicture,
  profileHeadline: "Professional update",
});

export const ensureSocialAccountFromLinkedIn = async (linkedinAccount) => {
  if (!linkedinAccount?.connected) {
    return null;
  }

  return upsertSocialAccount({
    userId: linkedinAccount.userId,
    platform: "linkedin",
    platformUserId: linkedinAccount.linkedinId,
    accessToken: linkedinAccount.accessToken,
    profile: {
      username: buildDefaultUsername({
        email: linkedinAccount.email,
        name: linkedinAccount.name,
        platform: "linkedin",
      }),
      name: linkedinAccount.name,
      email: linkedinAccount.email,
      profilePicture: linkedinAccount.profilePicture,
      profileHeadline: "Professional update",
    },
    metadata: {
      source: "linkedin-oauth",
      legacyModel: "LinkedInAccount",
    },
  });
};

export const getSocialAccountForUser = async (userId, platform = "linkedin") => {
  const normalizedPlatform = normalizePlatform(platform);

  const socialAccount = await SocialAccount.findOne({
    userId,
    platform: normalizedPlatform,
    connected: true,
  }).sort({ createdAt: -1 });

  if (socialAccount) {
    return socialAccount;
  }

  if (normalizedPlatform !== "linkedin") {
    return null;
  }

  const legacyAccount = await LinkedInAccount.findOne({
    userId,
    connected: true,
  }).sort({ createdAt: -1 });

  if (!legacyAccount) {
    return null;
  }

  return ensureSocialAccountFromLinkedIn(legacyAccount);
};

export const getSocialAccountsSummary = async (userId) => {
  const socialAccounts = await SocialAccount.find({ userId }).sort({ createdAt: -1 });
  const latestByPlatform = new Map();

  for (const account of socialAccounts) {
    if (!latestByPlatform.has(account.platform)) {
      latestByPlatform.set(account.platform, account);
    }
  }

  if (!latestByPlatform.has("linkedin")) {
    const legacyLinkedIn = await LinkedInAccount.findOne({
      userId,
      connected: true,
    }).sort({ createdAt: -1 });

    if (legacyLinkedIn) {
      const migrated = await ensureSocialAccountFromLinkedIn(legacyLinkedIn);
      latestByPlatform.set("linkedin", migrated);
    }
  }

  return Object.keys(PLATFORM_CONFIG).map((platform) => {
    const account = latestByPlatform.get(platform) || null;
    return buildAccountSummary(platform, account);
  });
};

export const createDemoSocialAccount = async ({ user, platform }) => {
  const normalizedPlatform = normalizePlatform(platform);
  const account = await upsertSocialAccount({
    userId: user._id,
    platform: normalizedPlatform,
    platformUserId: `${normalizedPlatform}-${user._id}`,
    accessToken: `demo-token-${normalizedPlatform}`,
    profile: {
      username: buildDefaultUsername({
        email: user.email,
        name: user.name,
        platform: normalizedPlatform,
      }),
      name: user.name || `${PLATFORM_LABELS[normalizedPlatform]} Creator`,
      email: user.email,
      bio: `Publishing through ${PLATFORM_LABELS[normalizedPlatform]}.`,
      profilePicture: user.customProfilePicture || user.profilePicture || "",
      profileHeadline:
        normalizedPlatform === "linkedin"
          ? user.headline || "Content strategist"
          : undefined,
    },
    metadata: {
      source: normalizedPlatform === "linkedin" ? "oauth" : "demo-connect",
      demo: true,
    },
  });

  return buildAccountSummary(normalizedPlatform, account);
};

export const getLegacyLinkedInSummary = (account) => buildLinkedInProfile(account);
