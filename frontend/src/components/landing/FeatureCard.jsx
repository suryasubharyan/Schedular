// eslint-disable-next-line no-unused-vars -- used via JSX member tags (<motion.div>), which core no-unused-vars doesn't track without eslint-plugin-react
import { motion } from "framer-motion";
import { LinkedInIcon, CalendarIcon, PostsIcon, ChartIcon } from "../Icons";
import { TINTS } from "./landingContent";

export default function FeatureCard({ feature, index }) {
  const tint = TINTS[feature.tint];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <motion.div
        whileHover={{ y: -10, scale: 1.02 }}
        className={`group relative overflow-hidden rounded-3xl border p-7 shadow-soft backdrop-blur-xl ring-1 ring-inset ring-white/60 transition-shadow
          duration-300 hover:shadow-lg dark:ring-white/5 ${tint.cardBg} ${tint.border} ${tint.glow}`}
      >
        <div className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        <div
          className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl transition-all duration-300 ${tint.corner}`}
        />

        <div className="relative flex items-center justify-between">
          {feature.kind === "linkedin" ? (
            <motion.div whileHover={{ rotate: -8, scale: 1.08 }} transition={{ duration: 0.2 }}>
              <LinkedInIcon className="h-11 w-11" />
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ rotate: -8, scale: 1.08 }}
              transition={{ duration: 0.2 }}
              className={`grid h-11 w-11 place-items-center rounded-2xl ${tint.iconBg}`}
            >
              {feature.kind === "compose" && <PostsIcon className="h-5 w-5" />}
              {feature.kind === "schedule" && <ChartIcon className="h-5 w-5" />}
              {feature.kind === "calendar" && <CalendarIcon className="h-5 w-5" />}
            </motion.div>
          )}
          <span className={`font-display text-3xl font-bold transition-colors duration-300 ${tint.number}`}>
            {feature.number}
          </span>
        </div>

        <h3 className="relative mt-5 font-display text-lg font-bold text-slate-900 dark:text-white">
          {feature.title}
        </h3>
        <p className="relative mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {feature.description}
        </p>
      </motion.div>
    </motion.div>
  );
}
