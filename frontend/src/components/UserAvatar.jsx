const getInitials = (name, email) => {
  const source = (name || email || "U").trim();
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
};

export default function UserAvatar({ user, className = "h-8 w-8", textClassName = "text-xs" }) {
  if (user?.profilePicture) {
    return (
      <img
        src={user.profilePicture}
        alt={user?.name || "User"}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 font-bold
        text-white ${textClassName} ${className}`}
    >
      {getInitials(user?.name, user?.email)}
    </div>
  );
}
