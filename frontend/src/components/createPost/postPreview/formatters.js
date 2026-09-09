export const LONG_CAPTION = 200;

// Compact "5m / 3h / 2d" time format used by the live social-platform
// previews — distinct from PostCard's "Updated 5m ago" dashboard format,
// since each mimics a different real UI convention.
export function getTimeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diff = Math.floor((now - past) / 1000);

  if (diff < 60) return "Just now";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  return `${days}d`;
}
