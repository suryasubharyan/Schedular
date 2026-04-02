import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createPost } from "../api/post.api";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [time, setTime] = useState("");
  const [platform, setPlatform] = useState("linkedin");
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Connect LinkedIn first");
      return;
    }

    if (!content.trim() || !time) {
      alert("Please enter content and schedule time");
      return;
    }

    try {
      await createPost({
        content,
        scheduledTime: time,
        platform,
        imageUrl,
        userId,
      });

      alert("✅ Post Scheduled Successfully");
      setContent("");
      setTime("");
      setImageUrl("");
      navigate("/dashboard");
    } catch {
      alert("❌ Error scheduling post");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>🚀 Create & Schedule Post</h2>

        <textarea
          placeholder="Write your content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textarea}
        />

        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label>📅 Schedule Time</label>
            <input
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label>🌐 Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              style={styles.input}
            >
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="x">X</option>
            </select>
          </div>
        </div>

        <input
          type="text"
          placeholder="🖼️ Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSubmit} style={styles.button}>
          Schedule Post
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #020617, #0f172a)",
  },

  card: {
    width: "500px",
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
    color: "#fff",
  },

  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },

  textarea: {
    width: "100%",
    height: "120px",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#fff",
    resize: "none",
    marginBottom: "15px",
  },

  row: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },

  inputGroup: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#fff",
    marginBottom: "10px",
  },

  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #38bdf8, #6366f1)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
};