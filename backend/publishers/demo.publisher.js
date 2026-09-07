import { formatPlatformLabel } from "../services/social-account.service.js";

const buildDemoPublishedUrl = (platform, postId) =>
  `https://app.schedular.local/${platform}/posts/${postId}`;

export const demoPublisher = {
  publish: async ({ account, post }) => ({
    publishedUrl: buildDemoPublishedUrl(account.platform, post._id),
    linkedInUrl: "",
    metadata: {
      note: `${formatPlatformLabel(account.platform)} publish is using local demo delivery.`,
    },
  }),
};
