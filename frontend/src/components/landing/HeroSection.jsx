import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoCompassOutline, IoRocketOutline, IoSparkles } from "react-icons/io5";
import ComposerPreviewCard from "./ComposerPreviewCard";
import SchedulePreviewCluster from "./SchedulePreviewCluster";
import { DEPLOYMENT_STATIONS } from "./landingContent";

const MotionLink = motion.create(Link);

export default function HeroSection() {
  return (
    <section className="relative z-10 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-10 sm:px-10 lg:px-16">
        <ComposerPreviewCard />
        <SchedulePreviewCluster />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-1.5 text-xs font-bold
              uppercase tracking-widest text-brand-700 backdrop-blur-sm dark:border-accent-700/40 dark:bg-accent-500/10 dark:text-accent-300"
          >
            <IoSparkles className="h-3.5 w-3.5 text-accent-500" />
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
            <span className="relative inline-block bg-linear-to-r from-brand-600 via-accent-500 to-accent-400 bg-clip-text italic text-transparent dark:from-brand-400 dark:via-accent-300 dark:to-accent-200">
              Publish everywhere.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300"
          >
            Write your post once, see exactly how it'll look on LinkedIn, Instagram,
            Facebook and X, and schedule all of them from the same screen. LinkedIn
            goes out live today — the rest are ready for you to preview right now.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            <MotionLink
              to="/login"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95, y: -1 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
              className="group inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-brand-600 to-accent-600 px-7 py-4 text-base font-bold text-white shadow-soft
                transition-shadow duration-200 hover:shadow-glow hover:brightness-110"
            >
              <IoRocketOutline className="h-4.5 w-4.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-1 group-hover:rotate-45" />
              Get Started for Free
            </MotionLink>
            <motion.a
              href="#features"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95, y: -1 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
              className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-7 py-4 text-base font-bold text-slate-700 backdrop-blur-sm
                transition-colors duration-200 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:backdrop-blur-xl dark:hover:bg-white/10"
            >
              <IoCompassOutline className="h-4.5 w-4.5 transition-transform duration-500 ease-out group-hover:rotate-180" />
              See How It Works
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-2"
          >
            {DEPLOYMENT_STATIONS.map((station) => {
              const Icon = station.Icon;
              return (
                <div
                  key={station.id}
                  className="group flex flex-col items-center gap-2.5 rounded-2xl px-5 py-3 transition-all duration-300
                    hover:-translate-y-1 hover:bg-white hover:shadow-soft dark:hover:bg-white/5"
                >
                  <Icon className="h-11 w-11 shadow-[0_8px_18px_-6px_rgba(15,23,42,0.3)] transition-transform duration-300 group-hover:scale-105" />
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {station.label}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
