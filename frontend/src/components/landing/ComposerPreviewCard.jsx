// eslint-disable-next-line no-unused-vars -- used via JSX member tags (<motion.div>), which core no-unused-vars doesn't track without eslint-plugin-react
import { motion } from "framer-motion";
import {
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  CalendarIcon,
} from "../Icons";

// Purely decorative "new post" card floating on the left side of the hero.
export default function ComposerPreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, rotate: -6 }}
      animate={{ opacity: 1, x: 0, rotate: -4 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="absolute top-20 left-4 z-10 hidden w-52 lg:block xl:left-10"
    >
      <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-accent-600 dark:text-accent-300">
        New Post Command
      </p>
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.035 }}
        className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/60 p-4 shadow-soft backdrop-blur-xl ring-1 ring-inset ring-white/50 transition-shadow duration-300 hover:shadow-[0_25px_60px_-15px_rgba(45,212,191,0.5)] dark:border-white/10 dark:bg-slate-800/40 dark:shadow-soft-dark dark:ring-white/10"
      >
        <div className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

        <p className="relative text-xs font-bold text-slate-500 dark:text-slate-400">
          New Post
        </p>
        <div className="relative mt-3 space-y-1.5">
          <div className="h-1.5 w-full animate-pulse rounded-full bg-slate-100 dark:bg-night-800" />
          <div className="h-1.5 w-4/5 animate-pulse rounded-full bg-slate-100 dark:bg-night-800" />
        </div>
        <div className="relative mt-3 h-24 w-full animate-gradient-shift overflow-hidden rounded-xl bg-[length:200%_200%] bg-linear-to-br from-brand-300 via-accent-400 to-brand-500">
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.6,
            }}
            className="absolute inset-y-0 w-1/3 -skew-x-12 bg-white/40 blur-md"
          />
          <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full text-white/70">
            <circle cx="78" cy="14" r="6" fill="currentColor" />
            <path
              d="M0 46 L28 24 L46 40 L64 20 L100 50 V60 H0 Z"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
          <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/25 px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
            🚀 Product launch
          </span>
        </div>
        <div className="relative mt-3 flex items-center gap-1.5">
          {[LinkedInIcon, InstagramIcon, FacebookIcon, TwitterIcon].map((PlatformIcon, i) => (
            <PlatformIcon
              key={i}
              className="h-8 w-8 cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:scale-110"
            />
          ))}
        </div>
        <div className="relative mt-3 flex items-center justify-center gap-1.5 overflow-hidden rounded-xl bg-linear-to-r from-brand-600 to-accent-600 py-2 text-xs font-bold text-white shadow-[0_8px_20px_-6px_rgba(20,184,166,0.6)] transition-transform duration-200 group-hover:brightness-110">
          <CalendarIcon className="h-3.5 w-3.5" />
          Schedule Deployment
        </div>
      </motion.div>
    </motion.div>
  );
}
