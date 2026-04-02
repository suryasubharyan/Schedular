export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        background: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
      }}
    >
      {children}
    </button>
  );
}