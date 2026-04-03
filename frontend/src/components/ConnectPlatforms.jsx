import {
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
} from "./Icons";

const ENV = import.meta.env.VITE_ENV;

const BASE_URL =
  ENV === "local"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PROD;

export default function ConnectPlatforms() {
  return (
    <div style={styles.container}>
      <h2>Connect Your Accounts</h2>

      <p style={{ color: "#94a3b8" }}>
        Start by connecting a platform
      </p>

      <div style={styles.grid}>

        {/* LINKEDIN */}
        <a
          href={`${BASE_URL}/api/linkedin/connect`}
          style={styles.card}
        >
          <LinkedInIcon />
          <span>LinkedIn</span>
        </a>

        {/* FACEBOOK */}
        <div style={styles.disabled}>
          <FacebookIcon />
          <span>Facebook</span>
        </div>

        {/* INSTAGRAM */}
        <div style={styles.disabled}>
          <InstagramIcon />
          <span>Instagram</span>
        </div>

        {/* TWITTER */}
        <div style={styles.disabled}>
          <TwitterIcon />
          <span>Twitter</span>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  grid: {
    marginTop: "30px",
    display: "grid",
    gridTemplateColumns: "repeat(2, 180px)",
    gap: "20px",
  },

  card: {
    background: "#020617",
    border: "1px solid #1e293b",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    textDecoration: "none",
    color: "#fff",
  },

  disabled: {
    background: "#020617",
    border: "1px dashed #334155",
    padding: "20px",
    borderRadius: "12px",
    opacity: 0.5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
};