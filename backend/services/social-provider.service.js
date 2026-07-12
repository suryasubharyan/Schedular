import axios from "axios";
import { SignJWT, jwtVerify } from "jose";
import config from "../config/env.js";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-in-env"
);

const OAUTH_STATE_TTL_SECONDS = 60 * 10;

export const SOCIAL_PROVIDER_CONFIG = {
  linkedin: {
    label: "LinkedIn",
    connectMode: "oauth",
    authorizeUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    scopes: ["openid", "profile", "email", "w_member_social"],
    clientIdEnv: "LINKEDIN_CLIENT_ID",
    clientSecretEnv: "LINKEDIN_CLIENT_SECRET",
  },
  instagram: {
    label: "Instagram",
    connectMode: "demo",
    scopes: [],
  },
  facebook: {
    label: "Facebook",
    connectMode: "demo",
    scopes: [],
  },
  x: {
    label: "X",
    connectMode: "demo",
    scopes: [],
  },
};

export const getSocialProviderConfig = (platform = "linkedin") =>
  SOCIAL_PROVIDER_CONFIG[platform] || SOCIAL_PROVIDER_CONFIG.linkedin;

export const getPlatformRedirectUri = (platform = "linkedin") => {
  const baseUrl = (config.backendUrl || "").replace(/\/$/, "");

  if (platform === "linkedin") {
    return `${baseUrl}/api/linkedin/callback`;
  }

  return `${baseUrl}/api/social/callback/${platform}`;
};

export const hasOAuthCredentials = (platform = "linkedin") => {
  const provider = getSocialProviderConfig(platform);

  if (provider.connectMode !== "oauth") {
    return false;
  }

  return Boolean(
    process.env[provider.clientIdEnv] && process.env[provider.clientSecretEnv]
  );
};

export const createPlatformOAuthState = async ({ platform, userId }) =>
  new SignJWT({ platform, userId: String(userId) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${OAUTH_STATE_TTL_SECONDS}s`)
    .sign(JWT_SECRET);

export const verifyPlatformOAuthState = async (state) => {
  const verified = await jwtVerify(state, JWT_SECRET);
  return verified.payload;
};

export const buildPlatformAuthorizationUrl = async ({ platform, userId }) => {
  const provider = getSocialProviderConfig(platform);

  if (provider.connectMode !== "oauth") {
    return null;
  }

  const clientId = process.env[provider.clientIdEnv];
  if (!clientId) {
    return null;
  }

  const state = await createPlatformOAuthState({ platform, userId });
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: getPlatformRedirectUri(platform),
    state,
    scope: provider.scopes.join(" "),
  });

  return `${provider.authorizeUrl}?${params.toString()}`;
};

const exchangeLinkedInCode = async ({ code, redirectUri }) => {
  const tokenRes = await axios.post(getSocialProviderConfig("linkedin").tokenUrl, null, {
    params: {
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    },
  });

  return tokenRes.data;
};

const fetchLinkedInProfile = async (accessToken) => {
  const userInfoRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const profile = userInfoRes.data;

  return {
    platformUserId: profile.sub,
    username:
      profile.email?.split("@")?.[0] ||
      profile.name?.replace(/\s+/g, "").toLowerCase() ||
      "linkedin-user",
    name: profile.name,
    email: profile.email,
    profilePicture: profile.picture,
    profileHeadline: "Professional update",
    providerProfile: profile,
  };
};

export const resolvePlatformOAuthAccount = async ({ platform, code }) => {
  if (platform !== "linkedin") {
    throw new Error(`${getSocialProviderConfig(platform).label} OAuth is not configured yet`);
  }

  const redirectUri = getPlatformRedirectUri(platform);
  const tokenPayload = await exchangeLinkedInCode({ code, redirectUri });
  const accessToken = tokenPayload.access_token;
  const expiresInSeconds = Number(tokenPayload.expires_in || 0);
  const profile = await fetchLinkedInProfile(accessToken);

  return {
    platformUserId: profile.platformUserId,
    accessToken,
    refreshToken: tokenPayload.refresh_token || "",
    tokenType: tokenPayload.token_type || "Bearer",
    scopes: getSocialProviderConfig(platform).scopes,
    tokenExpiresAt: expiresInSeconds
      ? new Date(Date.now() + expiresInSeconds * 1000)
      : null,
    profile,
    metadata: {
      source: `${platform}-oauth`,
      providerProfile: profile.providerProfile,
      tokenResponse: {
        expires_in: tokenPayload.expires_in || null,
      },
    },
  };
};
