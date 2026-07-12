import { createLinkedInPost } from "./linkedin.service.js";
import { formatPlatformLabel } from "./social-account.service.js";

const buildDemoPublishedUrl = (platform, postId) =>
  `https://app.schedular.local/${platform}/posts/${postId}`;

export const publishSocialPost = async ({ platform, account, post }) => {
  if (platform === "linkedin") {
    const publishedUrl = await createLinkedInPost({
      accessToken: account.accessToken,
      linkedinId: account.platformUserId || account.linkedinId,
      content: post.content,
      imageUrls: post.imageUrls || [],
      videoUrl: post.videoUrl,
    });

    return {
      publishedUrl,
      linkedInUrl: publishedUrl,
    };
  }

  return {
    publishedUrl: buildDemoPublishedUrl(platform, post._id),
    linkedInUrl: "",
    metadata: {
      note: `${formatPlatformLabel(platform)} publish is using local demo delivery.`,
    },
  };
};
