
function getTimeAgo(dateString) {
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
export default function PostPreview({ post, profile }) {
  if (!post) return null;

  return (
    <div style={styles.card}>
      
      {/* HEADER */}
      <div style={styles.top}>
        <img
          src={profile?.profilePicture || "https://via.placeholder.com/40"}
          style={styles.avatar}
        />

        <div style={styles.userInfo}>
          <div style={styles.nameRow}>
            <span style={styles.name}>
              {profile?.name || "User Name"}
            </span>
          </div>

          <div style={styles.headline}>
            {profile?.profileHeadline || "Headline"}
          </div>

          <div style={styles.meta}>
            {getTimeAgo(post.createdAt)} • 🌍
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        {post.content}
      </div>

      {(post.linkedInUrl) && (
        <div style={styles.linkRow}>
          <button
            type="button"
            onClick={() => window.open(post.linkedInUrl, "_blank")}
            style={styles.externalLink}
          >
            View on LinkedIn
          </button>
        </div>
      )}

      {/* IMAGES */}
      {(post.imageUrls?.length || post.imageUrl) && (
        <div style={styles.imagesWrap}>
          {(post.imageUrls?.length ? post.imageUrls : [post.imageUrl]).map(
            (src, index) =>
              src && (
                <img key={index} src={src} style={styles.image} alt={`post-${index}`} />
              )
          )}
        </div>
      )}

    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid #e5e7eb",
    maxWidth: "600px"
  },

  top: {
    display: "flex",
    gap: "10px"
  },

  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%"
  },

  userInfo: {
    display: "flex",
    flexDirection: "column"
  },

  nameRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },

  name: {
    fontWeight: "600",
    fontSize: "14px"
  },

  headline: {
    fontSize: "13px",
    color: "#6b7280"
  },

  meta: {
    fontSize: "12px",
    color: "#6b7280"
  },

  content: {
    marginTop: "12px",
    fontSize: "15px",
    whiteSpace: "pre-wrap"
  },

  linkRow: {
    marginTop: "16px",
  },

  externalLink: {
    display: "inline-block",
    padding: "10px 16px",
    borderRadius: "999px",
    background: "#0a66c2",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "600",
  },

  imagesWrap: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "12px",
    marginTop: "12px",
  },

  image: {
    width: "100%",
    borderRadius: "10px"
  }
};