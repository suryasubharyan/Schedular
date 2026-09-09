// eslint-disable-next-line no-unused-vars -- used via JSX member tags (<motion.div>), which core no-unused-vars doesn't track without eslint-plugin-react
import { motion } from "framer-motion";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { SCHEDULE_ROWS } from "./landingContent";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const HIGHLIGHTED_DAY_INDEX = 17;

// Purely decorative calendar + schedule-rows cards floating on the right side
// of the hero.
export default function SchedulePreviewCluster() {
  return (
    <div className="absolute top-20 right-4 z-10 hidden w-56 lg:block xl:right-10">
      <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-accent-600 dark:text-accent-300">
        Schedule Timeline
      </p>

      <motion.div
        initial={{ opacity: 0, x: 20, rotate: 6 }}
        animate={{ opacity: 1, x: 0, rotate: 4 }}
        transition={{ duration: 0.7, delay: 0.35 }}
      >
        <motion.div
          animate={{ y: [0, -9, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          whileHover={{ scale: 1.035 }}
          className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/60 p-4 shadow-soft backdrop-blur-xl ring-1 ring-inset ring-white/50 transition-shadow duration-300 hover:shadow-[0_25px_60px_-15px_rgba(45,212,191,0.5)] dark:border-white/10 dark:bg-slate-800/40 dark:shadow-soft-dark dark:ring-white/10"
        >
          <div className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

          <div className="relative flex items-center justify-between gap-1">
            <IoChevronBack className="h-3 w-3 shrink-0 cursor-pointer text-slate-400 transition-transform duration-150 hover:scale-125 hover:text-accent-500 dark:text-slate-500" />
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
              June 2026, Week 24
            </p>
            <IoChevronForward className="h-3 w-3 shrink-0 cursor-pointer text-slate-400 transition-transform duration-150 hover:scale-125 hover:text-accent-500 dark:text-slate-500" />
          </div>
          <div className="relative mt-3 grid grid-cols-7 gap-y-1.5 text-center text-[9px] text-slate-400 dark:text-slate-500">
            {WEEKDAY_LABELS.map((d, i) => (
              <span key={`${d}-${i}`} className="pb-1 font-semibold">
                {d}
              </span>
            ))}
            {Array.from({ length: 21 }).map((_, i) =>
              i === HIGHLIGHTED_DAY_INDEX ? (
                <span key={i} className="grid place-items-center py-1">
                  <span className="relative grid place-items-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-accent-400/60" />
                    <span className="relative rounded-full bg-linear-to-br from-brand-600 to-accent-600 px-1.25 font-bold text-white">
                      {i + 1}
                    </span>
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
          whileHover={{ scale: 1.035 }}
          className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/60 p-4 shadow-soft backdrop-blur-xl ring-1 ring-inset ring-white/50 transition-shadow duration-300 hover:shadow-[0_25px_60px_-15px_rgba(45,212,191,0.5)] dark:border-white/10 dark:bg-slate-800/40 dark:shadow-soft-dark dark:ring-white/10"
        >
          <div className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

          <p className="relative text-xs font-bold text-slate-500 dark:text-slate-400">
            Thu, June 18
          </p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
            }}
            className="relative mt-3 space-y-2.5"
          >
            <div className="absolute bottom-4 left-4 top-4 w-0.5 rounded-full bg-linear-to-b from-accent-500 via-accent-400/70 to-accent-400/30 dark:from-accent-400 dark:via-accent-400/60 dark:to-accent-400/20" />
            {SCHEDULE_ROWS.map((row) => {
              const Icon = row.Icon;
              const isLive = row.status === "live";
              return (
                <motion.div
                  key={row.time}
                  variants={{
                    hidden: { opacity: 0, x: 10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  whileHover={{ x: 2 }}
                  className="relative flex items-center gap-2 rounded-lg p-1 text-xs transition-colors duration-150 hover:bg-white/50 dark:hover:bg-white/5"
                >
                  <Icon className="h-6 w-6 rounded-md" />
                  <div className="flex-1 leading-tight">
                    <p className="font-semibold text-slate-600 dark:text-slate-300">
                      {row.time}
                    </p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500">{row.label}</p>
                  </div>
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide ${
                      isLive
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-500 dark:bg-night-800 dark:text-slate-400"
                    }`}
                  >
                    {isLive ? (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </span>
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 opacity-70 dark:bg-slate-500" />
                    )}
                    {row.status}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
