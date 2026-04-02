import { useState } from "react";

export default function ProfilePanel({ connections, setConnections }) {
  const [open, setOpen] = useState(false);

  const isConnected = connections.linkedin;

  return (
    <>
      {/* PROFILE SVG */}
      <div onClick={() => setOpen(true)} style={styles.profile}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="#64748b">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      </div>

      {/* DRAWER */}
      <div
        style={{
          ...styles.drawer,
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <h3>Profile</h3>

        <p>Status: {isConnected ? "Connected" : "Not Connected"}</p>

        {isConnected ? (
          <button
            style={styles.disconnect}
            onClick={() => {
              localStorage.removeItem("userId");

              setConnections((prev) => ({
                ...prev,
                linkedin: false,
              }));

              window.location.reload();
            }}
          >
            ❌ Disconnect
          </button>
        ) : (
          <button
            style={styles.connect}
            onClick={() => alert("Connect logic")}
          >
            🔗 Connect
          </button>
        )}

        <button onClick={() => setOpen(false)} style={styles.close}>
          Close
        </button>
      </div>
    </>
  );
}

const styles = {
  profile: {
    cursor: "pointer",
  },

  drawer: {
    position: "fixed",
    top: 0,
    right: 0,
    width: "300px",
    height: "100%",
    background: "#020617",
    borderLeft: "1px solid #1e293b",
    padding: "20px",
    transition: "transform 0.3s ease", // ✅ smooth
    zIndex: 2000,
  },

  disconnect: {
    background: "#ef4444",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
  },

  connect: {
    background: "#22c55e",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
  },

  close: {
    marginTop: "20px",
  },
};