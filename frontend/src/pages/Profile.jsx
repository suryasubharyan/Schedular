import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useNotification } from "../context/NotificationContext";

const emptyForm = {
  name: "",
  email: "",
  headline: "",
  profilePicture: "",
};

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      email: user.email || "",
      headline: user.headline || "",
      profilePicture: user.profilePicture || "",
    });
  }, [user]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showError("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        profilePicture: reader.result,
      }));
    };
    reader.readAsDataURL(file);
    event.target.value = null;
  };

  const clearImage = () => {
    setForm((prev) => ({
      ...prev,
      profilePicture: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const res = await updateUser(form);
      showSuccess(res.data.message || "Profile updated successfully");
    } catch (error) {
      showError(error.response?.data?.error || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.topbar}>
          <div>
            <p style={styles.eyebrow}>Account</p>
            <h1 style={styles.title}>Your profile</h1>
          </div>

          <div style={styles.topbarActions}>
            <Link to="/dashboard" style={styles.secondaryBtn}>
              Back to Dashboard
            </Link>
            <button type="button" onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.previewCard}>
            <img
              src={form.profilePicture || "https://via.placeholder.com/160?text=User"}
              alt="Profile"
              style={styles.avatar}
            />
            <h2 style={styles.previewName}>{form.name || "Your Name"}</h2>
            <p style={styles.previewEmail}>{form.email || "email@example.com"}</p>
            <p style={styles.previewHeadline}>
              {form.headline || "Add a short headline so your profile feels complete."}
            </p>
            <div style={styles.badge}>{user?.authProvider || "local"} account</div>
          </div>

          <form onSubmit={handleSubmit} style={styles.formCard}>
            <label style={styles.label}>
              Full name
              <input
                value={form.name}
                onChange={handleChange("name")}
                style={styles.input}
                placeholder="Your full name"
              />
            </label>

            <label style={styles.label}>
              Email
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                style={styles.input}
                placeholder="you@example.com"
              />
            </label>

            <label style={styles.label}>
              Headline
              <input
                value={form.headline}
                onChange={handleChange("headline")}
                style={styles.input}
                placeholder="Social media manager | Building thoughtful content"
              />
            </label>

            <div style={styles.profileInputRow}>
              <label style={styles.label}>
                Profile photo URL
                <input
                  value={form.profilePicture}
                  onChange={handleChange("profilePicture")}
                  style={styles.input}
                  placeholder="https://..."
                />
              </label>
              <label style={styles.uploadLabel}>
                Upload from device
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={styles.fileInput}
                />
              </label>
            </div>
            {form.profilePicture && (
              <button
                type="button"
                onClick={clearImage}
                style={styles.clearImageBtn}
              >
                Remove chosen image
              </button>
            )}

            <div style={styles.actions}>
              <button type="submit" disabled={saving} style={styles.primaryBtn}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(34, 197, 94, 0.18), transparent 28%), radial-gradient(circle at top right, rgba(14, 165, 233, 0.18), transparent 24%), #020617",
    color: "#e2e8f0",
    fontFamily: "Inter, sans-serif",
    padding: "40px 20px",
  },
  shell: {
    maxWidth: "1120px",
    margin: "0 auto",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },
  eyebrow: {
    margin: 0,
    fontSize: "13px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#38bdf8",
  },
  title: {
    margin: "8px 0 0 0",
    fontSize: "40px",
    color: "#f8fafc",
  },
  topbarActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(280px, 340px) minmax(0, 1fr)",
    gap: "24px",
  },
  previewCard: {
    background: "rgba(15, 23, 42, 0.9)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "24px",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  avatar: {
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid rgba(56, 189, 248, 0.55)",
    marginBottom: "20px",
  },
  previewName: {
    margin: 0,
    fontSize: "26px",
    color: "#f8fafc",
  },
  previewEmail: {
    margin: "8px 0 0 0",
    color: "#94a3b8",
  },
  previewHeadline: {
    margin: "18px 0 0 0",
    lineHeight: 1.6,
    color: "#cbd5e1",
  },
  badge: {
    marginTop: "22px",
    background: "rgba(14, 165, 233, 0.14)",
    border: "1px solid rgba(14, 165, 233, 0.35)",
    borderRadius: "999px",
    padding: "8px 14px",
    textTransform: "capitalize",
  },
  formCard: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "24px",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    color: "#cbd5e1",
    fontSize: "14px",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#f8fafc",
    outline: "none",
    fontSize: "15px",
  },
  profileInputRow: {
    display: "grid",
    gridTemplateColumns: "1fr 180px",
    gap: "16px",
    alignItems: "end",
  },
  uploadLabel: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "52px",
    padding: "14px 16px",
    borderRadius: "14px",
    background: "#0f172a",
    border: "1px solid #334155",
    color: "#f8fafc",
    cursor: "pointer",
    fontWeight: 600,
    textAlign: "center",
  },
  fileInput: {
    display: "none",
  },
  clearImageBtn: {
    alignSelf: "flex-start",
    border: "1px solid #334155",
    background: "transparent",
    color: "#f8fafc",
    borderRadius: "14px",
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 600,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "8px",
  },
  primaryBtn: {
    minWidth: "180px",
    border: "none",
    borderRadius: "14px",
    padding: "14px 18px",
    background: "linear-gradient(135deg, #0ea5e9, #22c55e)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  secondaryBtn: {
    textDecoration: "none",
    borderRadius: "14px",
    padding: "12px 16px",
    border: "1px solid #334155",
    color: "#e2e8f0",
  },
  logoutBtn: {
    border: "none",
    borderRadius: "14px",
    padding: "12px 16px",
    background: "#ef4444",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
};
