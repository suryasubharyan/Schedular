import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars -- used via JSX member tags (<motion.div>), which core no-unused-vars doesn't track without eslint-plugin-react
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="relative z-10 mx-auto max-w-4xl px-6 pb-24 sm:px-10 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-700 via-accent-600 to-accent-500 px-8 py-14 text-center text-white shadow-glow"
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
          className="relative mt-7 inline-block rounded-2xl bg-white px-7 py-4 text-base font-bold text-accent-700 transition-all
            duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          Start scheduling
        </Link>
      </motion.div>
    </section>
  );
}
