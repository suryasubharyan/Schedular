import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import UserAvatar from "../UserAvatar";
import {
  CalendarIcon,
  ChartIcon,
  ChevronDownIcon,
  HelpIcon,
  MenuIcon,
  MoonIcon,
  PlatformsIcon,
  PlusIcon,
  PostsIcon,
  SettingsIcon,
  SunIcon,
  XIcon,
} from "../Icons";
import Logo from "../Logo";

const NAV_ITEMS = [
  { to: "/analytics", label: "Analytics", icon: ChartIcon },
  { to: "/dashboard", label: "Posts", icon: PostsIcon },
  { to: "/calendar", label: "Calendar", icon: CalendarIcon },
  { to: "/platforms", label: "Platforms", icon: PlatformsIcon },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

const navLinkClass = ({ isActive }) =>
  `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200
   ${
     isActive
       ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
       : "text-slate-600 hover:bg-slate-100 hover:translate-x-0.5 dark:text-slate-300 dark:hover:bg-slate-800"
   }`;

function SidebarContent({ onNavigate }) {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col gap-7 px-6 py-7">
      <div className="flex items-center gap-3">
        <Logo className="h-12 w-12" />
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Schedular
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Plan, schedule, publish
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          navigate("/dashboard", { state: { openCreate: true } });
          onNavigate?.();
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white
          shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:bg-brand-700"
      >
        <PlusIcon className="h-4 w-4" />
        Create Post
      </button>

      <nav className="flex flex-1 flex-col gap-1.5">
        <p className="px-4 pb-1 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Workspace
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} className={navLinkClass} onClick={onNavigate}>
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <a
        href="mailto:support@schedular.app"
        className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600
          transition-all duration-200 hover:bg-slate-50 hover:-translate-y-0.5 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <HelpIcon className="h-4 w-4" />
        Help & Support
      </a>
    </div>
  );
}

export default function AppShell({ children }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:block">
        <SidebarContent />
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 animate-fade-up bg-white shadow-2xl dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <XIcon className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              title="Toggle theme"
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition-all duration-200
                hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full border border-slate-200 py-1.5 pl-1.5 pr-3 font-semibold text-slate-700
                  transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <UserAvatar user={user} className="h-8 w-8 border-2 border-brand-400" />
                <span className="hidden text-sm sm:inline">{user?.name || "User"}</span>
                <ChevronDownIcon className="hidden h-4 w-4 text-slate-400 sm:inline" />
              </button>

              {profileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                  <div
                    className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl
                      dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} className="h-11 w-11" textClassName="text-sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                          {user?.name || "User"}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
