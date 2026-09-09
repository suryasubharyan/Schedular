import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import Logo from "../Logo";

export default function Navbar({ theme, toggleTheme }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl transition-colors duration-300 dark:border-accent-500/10 dark:bg-night-950/50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
        <div className="flex items-center gap-3">
          <Logo className="h-11 w-11" />
          <span className="font-display text-xl font-semibold tracking-tight">
            Schedular
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <Link
            to="/login"
            className="rounded-xl bg-linear-to-r from-brand-600 to-accent-600 px-5 py-2.5 text-sm font-bold text-white shadow-glow transition-all duration-200
              hover:-translate-y-0.5 hover:brightness-110"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
