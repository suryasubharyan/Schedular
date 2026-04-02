export default function Input({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        padding: "10px",
        margin: "10px 0",
        width: "100%",
      }}
    />
  );
}