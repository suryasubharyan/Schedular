import { IoCallOutline, IoMailOutline } from "react-icons/io5";
import Logo from "../Logo";

const linkClasses =
  "text-slate-600 transition-colors duration-150 hover:text-brand-600 dark:text-slate-400 dark:hover:text-accent-300";

export default function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-slate-200 dark:border-night-800">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <Logo className="h-9 w-9" />
              <span className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                Schedular
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Write your post once, and let it go out on every platform without
              opening four tabs to do it.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Contact
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="tel:+916207015637" className={`flex items-center gap-2 ${linkClasses}`}>
                  <IoCallOutline className="h-4 w-4 shrink-0" />
                  +91 62070 15637
                </a>
              </li>
              <li>
                <a
                  href="mailto:suryasubharyan@gmail.com"
                  className={`flex items-center gap-2 ${linkClasses}`}
                >
                  <IoMailOutline className="h-4 w-4 shrink-0" />
                  suryasubharyan@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-slate-200 pt-6 text-xs text-slate-400 dark:border-night-800 dark:text-slate-500 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Schedular. Built for creators and teams.</span>
          <span>Made with care, one scheduled post at a time.</span>
        </div>
      </div>
    </footer>
  );
}
