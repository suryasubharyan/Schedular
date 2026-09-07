import axios from "axios";
import { parseDataUrl } from "../utils/media.util.js";

const registerImageUpload = async (accessToken, linkedinId) => {
  const response = await axios.post(
    "https://api.linkedin.com/v2/assets?action=registerUpload",
    {
      registerUploadRequest: {
        owner: `urn:li:person:${linkedinId}`,
        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
        serviceRelationships: [
          {
            identifier: "urn:li:userGeneratedContent",
            relationshipType: "OWNER",
          },
        ],
        supportedUploadMechanism: ["SYNCHRONOUS_UPLOAD"],
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.value;
};

const uploadImageBuffer = async (uploadUrl, buffer, contentType, accessToken) => {
  await axios.put(uploadUrl, buffer, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": contentType,
    },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });
};

export const createLinkedInPost = async ({ accessToken, linkedinId, content, imageUrls = [] }) => {
  const normalizedImages = Array.isArray(imageUrls) ? imageUrls.slice(0, 10).filter(Boolean) : imageUrls ? [imageUrls] : [];

  const assets = [];

  for (const imageData of normalizedImages) {
    const { buffer, contentType } = parseDataUrl(imageData);
    const uploadMetadata = await registerImageUpload(accessToken, linkedinId);
    const uploadUrl = uploadMetadata.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;

    await uploadImageBuffer(uploadUrl, buffer, contentType, accessToken);
    assets.push(uploadMetadata.asset);
  }

  const postBody = {
    author: `urn:li:person:${linkedinId}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: content,
        },
        shareMediaCategory: assets.length ? "IMAGE" : "NONE",
        ...(assets.length && {
          media: assets.map((asset) => ({
            status: "READY",
            description: {
              text: "",
            },
            media: asset,
            title: {
              text: "",
            },
          })),
        }),
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  const response = await axios.post("https://api.linkedin.com/v2/ugcPosts", postBody, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Restli-Protocol-Version": "2.0.0",
      "Content-Type": "application/json",
    },
    timeout: 20000,
  });

  const postId = response.headers["x-restli-id"] || response.data?.id || response.data?.value?.id;

  if (!postId) {
    return null;
  }

  return `https://www.linkedin.com/feed/update/${encodeURIComponent(postId)}`;
};
