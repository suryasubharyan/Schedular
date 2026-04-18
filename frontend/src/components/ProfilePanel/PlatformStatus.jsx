import { LinkedInIcon } from "../Icons";

export default function PlatformStatus({
  isConnected,
  onConnect,
  onDisconnect,
}) {
  return (
    <div style={styles.container}>
      <StatusItem
        icon={<LinkedInIcon />}
        active={isConnected}
        onClick={isConnected ? onDisconnect : onConnect}
      />
    </div>
  );
}

const StatusItem = ({ icon, active, onClick }) => (
  <div
    onClick={onClick}
    title={active ? "Disconnect LinkedIn" : "Connect LinkedIn"}
    style={{
      ...styles.item,
      border: active ? "4px solid #22c55e" : "4px solid #ef4444",
      boxShadow: active
        ? "0 0 8px rgba(34,197,94,0.6)"
        : "0 0 6px rgba(239,68,68,0.6)",
    }}
  >
    {icon}
  </div>
);

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  item: {
    padding: "6px",
    borderRadius: "10px",
    cursor: "pointer",
    background: "#020617",
    transition: "all 0.2s ease",
  },
};