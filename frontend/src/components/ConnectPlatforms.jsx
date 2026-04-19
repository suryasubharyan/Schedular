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
      <div style={styles.grid}>
        <a
          href={`${BASE_URL}/api/linkedin/connect`}
          style={{ ...styles.card, ...styles.cardSelected }}
        >
          <LinkedInIcon />
          <span>LinkedIn</span>
        </a>

        <div style={styles.card}>
          <FacebookIcon />
          <span>Facebook</span>
        </div>

        <div style={styles.card}>
          <InstagramIcon />
          <span>Instagram</span>
        </div>

        <div style={styles.card}>
          <TwitterIcon />
          <span>Twitter</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: "18px",
  },

  grid: {
    marginTop: "28px",
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "18px",
    width: "100%",
  },

  card: {
    minHeight: "160px",
    borderRadius: "24px",
    padding: "26px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    cursor: "pointer",
    textDecoration: "none",
    color: "#0f172a",
    background: "#f8fafc",
    border: "1px solid #cbd5e1",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  cardSelected: {
    borderColor: "#2563eb",
    boxShadow: "0 16px 40px rgba(37, 99, 235, 0.16)",
  },
};