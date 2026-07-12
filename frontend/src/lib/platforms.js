export const PLATFORM_META = {
  linkedin: {
    label: "LinkedIn",
    shortLabel: "in",
    accent: "#0a66c2",
    surface: "#f4f8fb",
    border: "#cfe0f2",
    buttonText: "View on LinkedIn",
    composerHint: "Share a professional update",
    maxImages: 10,
  },
  instagram: {
    label: "Instagram",
    shortLabel: "IG",
    accent: "#e1306c",
    surface: "#fff7fb",
    border: "#f6c1d4",
    buttonText: "View on Instagram",
    composerHint: "Write a caption that feels visual",
    maxImages: 10,
  },
  facebook: {
    label: "Facebook",
    shortLabel: "f",
    accent: "#1877f2",
    surface: "#f5f8ff",
    border: "#d7e6ff",
    buttonText: "View on Facebook",
    composerHint: "Start a conversation with your audience",
    maxImages: 10,
  },
  x: {
    label: "X",
    shortLabel: "X",
    accent: "#111111",
    surface: "#f4f4f5",
    border: "#d4d4d8",
    buttonText: "View on X",
    composerHint: "Keep it sharp and scroll-stopping",
    maxImages: 4,
  },
};

export const PLATFORM_ORDER = ["linkedin", "instagram", "facebook", "x"];

export const getPlatformMeta = (platform = "linkedin") =>
  PLATFORM_META[platform] || PLATFORM_META.linkedin;

export const getPostExternalUrl = (post) =>
  post?.publishedUrl || post?.linkedInUrl || "";

export const formatPlatformLabel = (platform = "linkedin") =>
  getPlatformMeta(platform).label;
