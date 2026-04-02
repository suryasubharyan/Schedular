import {
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
} from "../Icons";

export default function PlatformStatus({ connections }) {
  return (
    <div style={styles.container}>
      <StatusItem icon={<LinkedInIcon />} active={connections.linkedin} />
      <StatusItem icon={<FacebookIcon />} active={connections.facebook} />
      <StatusItem icon={<InstagramIcon />} active={connections.instagram} />
      <StatusItem icon={<TwitterIcon />} active={connections.twitter} />
    </div>
  );
}

const StatusItem = ({ icon, active }) => (
  <div style={styles.item}>
    {icon}
    <span
      style={{
        ...styles.dot,
        background: active ? "#22c55e" : "#ef4444",
      }}
    />
  </div>
);

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px",
    alignItems: "center",
  },
  item: {
    position: "relative",
  },
  dot: {
    position: "absolute",
    bottom: "-3px",
    right: "-3px",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    border: "2px solid #020617",
  },
};