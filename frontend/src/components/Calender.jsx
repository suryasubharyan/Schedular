export default function Calendar({ value, onChange }) {
  return (
    <input
      type="datetime-local"
      value={value}
      onChange={onChange}
    />
  );
}