import PlatformStatus from "./ProfilePanel/PlatformStatus";

function Logo({ onClick }) {
  return (
    <div style={styles.logoWrapper} onClick={onClick}>
      <svg width="40" height="40" viewBox="0 0 64 64">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0077b5" />
            <stop offset="100%" stopColor="#42a5f5" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#grad)" />
        <path d="M30 10 L22 34 H30 L26 54 L42 26 H34 L38 10 Z" fill="white" />
      </svg>
      <div>
        <h1 style={styles.title}>Schedular</h1>
        <p style={styles.subtitle}>Plan, schedule and publish smarter</p>
      </div>
    </div>
  );
}

export default function Header({
  user,
  isConnected,
  onConnect,
  onDisconnect,
  onProfileClick,
  onScheduleClick,
  onLogout,
  isSidebarOpen,
}) {
  return (
    <div style={styles.header}>
      <Logo onClick={onProfileClick} />

      <div style={styles.headerRight}>
        <div
          
        >
          <img
            title="View profile"
            onClick={onProfileClick}
            src={user?.profilePicture || "https://via.placeholder.com/40"}
            alt="User"
            style={styles.profileImg}
          />
          
        </div>

        <PlatformStatus
          isConnected={isConnected}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
        />

        {/* <button
          style={styles.scheduleBtn}
          onClick={onScheduleClick}
          type="button"
        >
          Schedule Post
        </button> */}

        {/* <button
          style={styles.logoutBtn}
          onClick={onLogout}
          type="button"
        >
          Logout
        </button> */}
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    padding: "2px 0",
    borderBottom: "1px solid #e1e5e9",
  },
  logoWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    color: "#1a1a1a",
  },
  subtitle: {
    margin: 0,
    fontSize: "12px",
    color: "#64748b",
  },
  headerRight: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  profileBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    borderRadius: "14px",
    background: "#ffffff",
    border: "1px solid #e1e5e9",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
  },
  profileImg: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #0077b5",
  },
  profileName: {
    fontSize: "14px",
    color: "#1a1a1a",
    fontWeight: "600",
  },
  profileEmail: {
    fontSize: "12px",
    color: "#64748b",
  },
  scheduleBtn: {
    background: "#0077b5",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  logoutBtn: {
    background: "#dc2626",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
};
