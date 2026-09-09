// eslint-disable-next-line no-unused-vars -- used via JSX member tags (<motion.div>), which core no-unused-vars doesn't track without eslint-plugin-react
import { motion } from "framer-motion";
import AISpotlightCard from "./AISpotlightCard";
import FeatureCard from "./FeatureCard";
import { FEATURES } from "./landingContent";

export default function FeaturesSection() {
  return (
    <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-16 sm:px-10 sm:pt-24 lg:px-16">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-2 text-xs font-bold uppercase tracking-widest text-accent-600 dark:text-accent-400"
      >
        Why this exists
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="max-w-xl font-display text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        Built around the way you{" "}
        <span className="bg-linear-to-r from-brand-600 via-accent-500 to-accent-400 bg-clip-text italic text-transparent dark:from-brand-400 dark:via-accent-300 dark:to-accent-200">
          actually post.
        </span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-10 mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300"
      >
        Every platform wants something slightly different, so posting the same thing everywhere
        usually means four tabs, four re-writes and one forgotten upload. This page exists to fix
        that one habit — write it once, and let it go out everywhere on its own.
      </motion.p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AISpotlightCard />
        {FEATURES.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
}
