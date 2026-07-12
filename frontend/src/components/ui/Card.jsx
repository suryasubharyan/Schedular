import { motion } from "framer-motion";

export default function Card({ className = "", hover = false, index = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.06 }}
      whileHover={hover ? { y: -4 } : undefined}
      className={`rounded-2xl border border-slate-200 bg-white shadow-soft transition-shadow duration-200
        dark:border-slate-800 dark:bg-slate-900 dark:shadow-soft-dark
        ${hover ? "hover:shadow-lg dark:hover:shadow-soft-dark cursor-pointer" : ""}
        ${className}`}
      {...props}
    />
  );
}
