import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars -- used via JSX member tags (<motion.div>), which core no-unused-vars doesn't track without eslint-plugin-react
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { MoonIcon, SunIcon, CalendarIcon, PostsIcon, ChartIcon } from "../components/Icons";
import { LinkedInIcon, FacebookIcon, InstagramIcon, TwitterIcon } from "../components/Icons";
import Logo from "../components/Logo";

const FEATURES = [
  {
    number: "01",
    kind: "compose",
    title: "Compose once, tailor per platform",
    description:
      "Write a post, then adapt image counts, captions and previews for LinkedIn, Instagram, Facebook and X without leaving the editor.",
  },
  {
    number: "02",
    kind: "schedule",
    title: "Real scheduling, not guesswork",
    description:
      "A background scheduler checks every minute for due posts and publishes them automatically, retrying if a platform hiccups.",
  },
  {
    number: "03",
    kind: "calendar",
    title: "Calendar & analytics built in",
    description:
      "See everything you have scheduled on a visual calendar and track drafts, scheduled and published counts per platform at a glance.",
  },
  {
    number: "04",
    kind: "linkedin",
    title: "LinkedIn publishing that actually works",
    description:
      "Connect your LinkedIn account and publish text, image and multi-image posts live — no copy-pasting into another tab.",
  },
];

const PLATFORMS = [
  { Icon: LinkedInIcon, label: "LinkedIn", live: true },
  { Icon: InstagramIcon, label: "Instagram", live: false },
  { Icon: FacebookIcon, label: "Facebook", live: false },
  { Icon: TwitterIcon, label: "X", live: false },
];

const SCHEDULE_ROWS = [
  { Icon: LinkedInIcon, time: "09:30 AM" },
  { Icon: InstagramIcon, time: "11:15 AM" },
  { Icon: FacebookIcon, time: "02:00 PM" },
  { Icon: TwitterIcon, time: "04:45 PM" },
];

const dotGridStyle = {
  backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const SparkleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.5c.3 3.6 1.2 6 2.9 7.7 1.7 1.7 4.1 2.6 7.6 2.9-3.5.3-5.9 1.2-7.6 2.9-1.7 1.7-2.6 4.1-2.9 7.6-.3-3.5-1.2-5.9-2.9-7.6-1.7-1.7-4.1-2.6-7.6-2.9 3.5-.3 5.9-1.2 7.6-2.9 1.7-1.7 2.6-4.1 2.9-7.7Z" />
  </svg>
);

const RocketIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const CompassIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="m14.5 9.5-1.7 5.2a1 1 0 0 1-.6.6l-5.2 1.7 1.7-5.2a1 1 0 0 1 .6-.6z" />
  </svg>
);

const ChevronIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export default function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {/* Ambient wash */}
      <div className="pointer-events-none fixed -left-32 -top-20 -z-10 h-[520px] w-[520px] rounded-full bg-brand-200/50 blur-[120px] dark:bg-brand-900/25" />
      <div className="pointer-events-none fixed -right-40 top-10 -z-10 h-[460px] w-[460px] rounded-full bg-accent-200/40 blur-[120px] dark:bg-accent-900/15" />
      <div className="pointer-events-none fixed bottom-0 left-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-brand-100/60 blur-[120px] dark:bg-brand-800/10" />
      <div
        style={dotGridStyle}
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px] text-brand-900/10 [mask-image:radial-gradient(ellipse_55%_60%_at_20%_0%,black,transparent)] dark:text-brand-100/10"
      />

      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
        <div className="flex items-center gap-3">
          <Logo className="h-11 w-11" />
          <span className="font-display text-xl font-semibold tracking-tight">Schedular</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white/80 text-slate-600 backdrop-blur-sm transition-all
              duration-200 hover:-translate-y-0.5 hover:bg-white dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
          <Link
            to="/login"
            className="rounded-xl bg-linear-to-r from-brand-600 to-accent-600 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-lg hover:brightness-110"
          >
            Sign in
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-10 sm:px-10 lg:px-16">
          {/* Left decorative composer card */}
          <motion.div
            initial={{ opacity: 0, x: -20, rotate: -6 }}
            animate={{ opacity: 1, x: 0, rotate: -4 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="absolute top-24 left-4 z-10 hidden w-52 lg:block xl:left-10"
          >
            <motion.div
              animate={{ y: [0, -9, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-soft backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95"
            >
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">New Post</p>
              <div className="mt-3 space-y-1.5">
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800" />
                <div className="h-1.5 w-4/5 rounded-full bg-slate-100 dark:bg-slate-800" />
              </div>
              <div className="relative mt-3 h-24 w-full overflow-hidden rounded-xl bg-linear-to-br from-brand-300 via-accent-300 to-brand-400">
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
                  className="absolute inset-y-0 w-1/3 -skew-x-12 bg-white/40 blur-md"
                />
                <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full text-white/70">
                  <circle cx="78" cy="14" r="6" fill="currentColor" />
                  <path d="M0 46 L28 24 L46 40 L64 20 L100 50 V60 H0 Z" fill="currentColor" opacity="0.9" />
                </svg>
                <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/25 px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
                  🚀 Product launch
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <LinkedInIcon className="h-8 w-8" />
                <InstagramIcon className="h-8 w-8" />
                <FacebookIcon className="h-8 w-8" />
                <TwitterIcon className="h-8 w-8" />
              </div>
              <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-brand-600 to-accent-600 py-2 text-xs font-bold text-white">
                <CalendarIcon className="h-3.5 w-3.5" />
                Schedule
              </div>
            </motion.div>
          </motion.div>

          {/* Right decorative calendar + schedule cards */}
          <div className="absolute top-24 right-4 z-10 hidden w-56 lg:block xl:right-10">
            <motion.div
              initial={{ opacity: 0, x: 20, rotate: 6 }}
              animate={{ opacity: 1, x: 0, rotate: 4 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <motion.div
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                className="w-48 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-soft backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">June 2026</p>
                  <ChevronIcon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                </div>
                <div className="mt-3 grid grid-cols-7 gap-y-1.5 text-center text-[9px] text-slate-400 dark:text-slate-500">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <span key={`${d}-${i}`} className="pb-1 font-semibold">
                      {d}
                    </span>
                  ))}
                  {Array.from({ length: 21 }).map((_, i) =>
                    i === 17 ? (
                      <span key={i} className="grid place-items-center py-1">
                        <span className="rounded-full bg-linear-to-br from-brand-600 to-accent-600 px-1.25 font-bold text-white">
                          {i + 1}
                        </span>
                      </span>
                    ) : (
                      <span key={i} className="rounded-full py-1 text-slate-500 dark:text-slate-400">
                        {i + 1}
                      </span>
                    )
                  )}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20, rotate: 3 }}
              animate={{ opacity: 1, x: 0, rotate: 2 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-4"
            >
              <motion.div
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="w-56 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-soft backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95"
              >
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Thursday, June 18</p>
                <div className="mt-3 space-y-2.5">
                  {SCHEDULE_ROWS.map((row) => {
                    const Icon = row.Icon;
                    return (
                      <div key={row.time} className="flex items-center gap-2 text-xs">
                        <Icon className="h-6 w-6 rounded-md" />
                        <span className="flex-1 font-semibold text-slate-600 dark:text-slate-300">{row.time}</span>
                        <span className="grid h-4 w-4 place-items-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                          <svg
                            viewBox="0 0 16 16"
                            className="h-2.5 w-2.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 8.5 6.3 12 13 4" />
                          </svg>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-1.5 text-xs font-bold
                uppercase tracking-widest text-brand-700 backdrop-blur-sm dark:border-brand-700/40 dark:bg-brand-500/10 dark:text-brand-300"
            >
              <SparkleIcon className="h-3.5 w-3.5 text-accent-500" />
              Social scheduling, simplified
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-white"
            >
              Plan once.
              <br />
              <span className="relative inline-block bg-linear-to-r from-brand-600 via-brand-500 to-accent-500 bg-clip-text italic text-transparent dark:from-brand-400 dark:via-brand-300 dark:to-accent-400">
                Publish everywhere.
               
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300"
            >
              Compose, preview and schedule content for every platform from one calm dashboard.
              Live publishing on LinkedIn today, with Instagram, Facebook and X previews ready to go.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-brand-600 to-accent-600 px-7 py-4 text-base font-bold text-white shadow-soft transition-all duration-200
                  hover:-translate-y-1 hover:shadow-lg hover:brightness-110"
              >
                <RocketIcon className="h-4.5 w-4.5" />
                Get started free
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-bold text-slate-700
                  transition-all duration-200 hover:-translate-y-1 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <CompassIcon className="h-4.5 w-4.5" />
                See what's inside
              </a>
            </motion.div>

            <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
              {PLATFORMS.map((platform) => {
                const Icon = platform.Icon;
                return (
                  <div
                    key={platform.label}
                    className="flex flex-col items-center gap-2 opacity-90 transition-opacity duration-200 hover:opacity-100"
                  >
                    <Icon />
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {platform.label} {platform.live ? "· live" : "· preview"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:px-10 sm:pt-24 lg:px-16">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          What you get
        </p>
        <h2 className="mb-10 max-w-xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Built around the way you actually post.
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-soft transition-all
                duration-300 hover:border-brand-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700/50"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-100/0 blur-2xl transition-all duration-300 group-hover:bg-brand-100/70 dark:group-hover:bg-brand-500/10" />

              <div className="relative flex items-center justify-between">
                {feature.kind === "linkedin" ? (
                  <LinkedInIcon className="h-11 w-11" />
                ) : (
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                    {feature.kind === "compose" && <PostsIcon className="h-5 w-5" />}
                    {feature.kind === "schedule" && <ChartIcon className="h-5 w-5" />}
                    {feature.kind === "calendar" && <CalendarIcon className="h-5 w-5" />}
                  </div>
                )}
                <span className="font-display text-3xl font-bold text-slate-100 dark:text-slate-800">
                  {feature.number}
                </span>
              </div>

              <h3 className="relative mt-5 text-lg font-bold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-700 via-brand-600 to-accent-600 px-8 py-14 text-center text-white shadow-soft"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative font-display text-3xl font-semibold sm:text-4xl">
            Ready to plan your next post?
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-white/80">
            Create an account and connect LinkedIn in under a minute.
          </p>
          <Link
            to="/login"
            className="relative mt-7 inline-block rounded-2xl bg-white px-7 py-4 text-base font-bold text-brand-700 transition-all
              duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            Start scheduling
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-slate-200 px-6 py-8 text-center text-sm text-slate-400 dark:border-slate-800">
        © {new Date().getFullYear()} Schedular. Built for creators and teams.
      </footer>
    </div>
  );
}
