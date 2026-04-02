import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 40px",
        background: "#020617",
        borderBottom: "1px solid #1e293b",
      }}
    >
      <h2 style={{ color: "#38bdf8" }}>Schedular</h2>

      <div style={{ display: "flex", gap: "25px" }}>
        <Link style={{ color: "#fff" }} to="/">Dashboard</Link>
        <Link style={{ color: "#fff" }} to="/create">Create Post</Link>
        <Link style={{ color: "#fff" }} to="/login">Login</Link>
      </div>
    </div>
  );
}