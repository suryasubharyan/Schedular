import { MoonIcon, SunIcon } from "./Icons";

// Icon-only theme toggle used in the app topbar and landing navbar. Reuse this instead of
// re-declaring the button markup so both surfaces stay visually in sync.
export default function ThemeToggle({ theme, toggleTheme, className = "" }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title="Toggle theme"
      aria-label="Toggle theme"
      className={`group relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl border
        border-white/60 bg-white/60 shadow-[0_1px_1px_rgba(255,255,255,0.6)_inset,0_8px_20px_-8px_rgba(15,23,42,0.25)]
        backdrop-blur-xl transition-all duration-300 ease-out
        hover:-translate-y-0.5 hover:border-white/80 hover:shadow-[0_1px_1px_rgba(255,255,255,0.7)_inset,0_10px_26px_-6px_rgba(15,23,42,0.3)]
        active:translate-y-0 active:scale-95
        dark:border-white/10 dark:bg-white/[0.06]
        dark:shadow-[0_1px_1px_rgba(255,255,255,0.08)_inset,0_8px_20px_-8px_rgba(0,0,0,0.5)]
        dark:hover:border-white/20 dark:hover:bg-white/[0.1] ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/70 via-white/10 to-transparent
          opacity-80 dark:from-white/10 dark:via-transparent dark:to-transparent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-3 -top-3 h-8 w-8 rounded-full bg-amber-300/40 blur-md
          transition-opacity duration-300 dark:bg-accent-400/30"
        style={{ opacity: isDark ? 0 : 1 }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-3 -top-3 h-8 w-8 rounded-full bg-accent-400/30 blur-md
          transition-opacity duration-300"
        style={{ opacity: isDark ? 1 : 0 }}
      />

      {isDark ? (
        <SunIcon className="relative h-5 w-5 text-amber-400 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" />
      ) : (
        <MoonIcon className="relative h-5 w-5 text-slate-600 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
      )}
    </button>
  );
}
