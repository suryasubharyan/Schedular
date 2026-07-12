export default function Logo({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 44 44" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoRing" x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
      </defs>

      {/* sparkle accents */}
      <path d="M8 4.5c.25 1.4.85 2.35 2.3 2.6-1.45.25-2.05 1.2-2.3 2.6-.25-1.4-.85-2.35-2.3-2.6 1.45-.25 2.05-1.2 2.3-2.6Z" fill="#5eead4" />
      <path d="M36 30.5c.2 1.1.68 1.85 1.8 2.05-1.12.2-1.6.95-1.8 2.05-.2-1.1-.68-1.85-1.8-2.05 1.12-.2 1.6-.95 1.8-2.05Z" fill="#5eead4" />

      {/* open ring */}
      <circle
        cx="21"
        cy="22"
        r="15.5"
        stroke="url(#logoRing)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeDasharray="76 100"
        transform="rotate(-114 21 22)"
      />

      {/* letter S backdrop */}
      <circle cx="21" cy="22" r="11.5" fill="#ecfdf5" />
      <text
        x="21"
        y="28"
        textAnchor="middle"
        fontFamily="Fraunces, ui-serif, Georgia, serif"
        fontSize="17"
        fontWeight="700"
        fill="#047857"
      >
        S
      </text>

      {/* calendar badge */}
      <g transform="translate(26 4)">
        <rect x="0" y="1.5" width="11" height="10" rx="2.2" fill="#059669" stroke="#ecfdf5" strokeWidth="1" />
        <rect x="0" y="1.5" width="11" height="3.4" rx="1.8" fill="#0d9488" />
        <circle cx="3" cy="1.5" r="0.9" fill="#ecfdf5" />
        <circle cx="8" cy="1.5" r="0.9" fill="#ecfdf5" />
      </g>

      {/* clock badge */}
      <g transform="translate(28 26)">
        <circle cx="6" cy="6" r="7" fill="#065f46" stroke="#ecfdf5" strokeWidth="1.2" />
        <path d="M6 2.6V6l2.6 1.6" stroke="#ecfdf5" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
