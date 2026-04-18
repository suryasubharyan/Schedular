// PostEditor.jsx
import { useCallback } from "react";

export default function PostEditor({
  content,
  setContent,
  imageUrls,
  setImageUrls,
  profile,
}) {
  const handleImageSelect = useCallback(
    async (event) => {
      const files = Array.from(event.target.files || []);
      if (!files.length) return;

      const allowedFiles = files.slice(0, 10 - (imageUrls?.length || 0));
      if (!allowedFiles.length) return;

      const previews = await Promise.all(
        allowedFiles.map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(file);
            })
        )
      );

      setImageUrls([...(imageUrls || []), ...previews].slice(0, 10));
      event.target.value = null;
    },
    [imageUrls, setImageUrls]
  );

  const handleRemoveImage = (index) => {
    setImageUrls((current) => current.filter((_, idx) => idx !== index));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src={profile?.profilePicture} style={styles.avatar} />
        <div>
          <div style={styles.name}>{profile?.name}</div>
          <div style={styles.subText}>Post to LinkedIn</div>
        </div>
      </div>

      <textarea
        placeholder="Start writing your post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={styles.textarea}
      />

      <div style={styles.imageSection}>
        <label style={styles.imageLabel}>
          + Add Images ({imageUrls?.length || 0}/10)
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            style={styles.fileInput}
          />
        </label>

        <div style={styles.previewGrid}>
          {imageUrls?.map((src, index) => (
            <div key={index} style={styles.previewItem}>
              <img src={src} alt={`preview-${index}`} style={styles.previewImage} />
              <button
                type="button"
                style={styles.removeBtn}
                onClick={() => handleRemoveImage(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#fff",
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid #e5e7eb",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  header: { display: "flex", gap: "10px", marginBottom: "10px" },
  avatar: { width: "40px", height: "40px", borderRadius: "50%" },
  name: { fontWeight: "600", color: "#111" },
  subText: { fontSize: "12px", color: "#6b7280" },
  textarea: {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: "16px",
    minHeight: "250px",
    resize: "vertical",
    flex: 1,
    overflowY: "auto",
    marginBottom: "16px",
  },
  imageSection: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  imageLabel: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 16px",
    borderRadius: "14px",
    border: "1px dashed #cbd5e1",
    background: "#f8fafc",
    color: "#334155",
    cursor: "pointer",
    fontWeight: "600",
    width: "fit-content",
  },
  fileInput: {
    display: "none",
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: "12px",
  },
  previewItem: {
    position: "relative",
    borderRadius: "14px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    minHeight: "100px",
    background: "#f8fafc",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  removeBtn: {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "rgba(0,0,0,0.65)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    cursor: "pointer",
    fontSize: "16px",
    lineHeight: "1",
  },
};