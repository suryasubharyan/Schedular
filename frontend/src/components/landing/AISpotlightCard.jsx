// eslint-disable-next-line no-unused-vars -- used via JSX member tags (<motion.div>), which core no-unused-vars doesn't track without eslint-plugin-react
import { motion } from "framer-motion";
import { IoSparkles } from "react-icons/io5";
import { AI_FEATURE } from "./landingContent";

export default function AISpotlightCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="sm:col-span-2"
    >
      <motion.div
        whileHover={{ y: -10, scale: 1.015 }}
        className="group relative rounded-3xl bg-linear-to-br from-violet-400 via-accent-400 to-brand-400 p-[1.5px] shadow-soft transition-shadow duration-300 hover:shadow-[0_25px_70px_-20px_rgba(139,92,246,0.55)]"
      >
        <div className="relative h-full overflow-hidden rounded-[calc(1.5rem-1.5px)] bg-white/95 p-7 backdrop-blur-xl dark:bg-night-900/95">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-200/60 blur-3xl transition-all duration-300 group-hover:bg-violet-200 dark:bg-violet-500/10 dark:group-hover:bg-violet-500/20" />

          <span className="relative inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-violet-500 to-accent-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
            <IoSparkles className="h-3 w-3" />
            New · AI
          </span>

          <div className="relative mt-5 flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-violet-500 to-accent-500 text-white shadow-[0_8px_20px_-6px_rgba(139,92,246,0.6)]">
              <IoSparkles className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                {AI_FEATURE.title}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {AI_FEATURE.description}
              </p>
            </div>
          </div>

          <div className="relative mt-5 flex flex-wrap gap-2">
            {AI_FEATURE.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-linear-to-br from-violet-500 to-accent-500" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
