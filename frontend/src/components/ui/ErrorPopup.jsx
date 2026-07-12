import { useEffect } from "react";
// eslint-disable-next-line no-unused-vars -- used via JSX member tags (<motion.div>), which core no-unused-vars doesn't track without eslint-plugin-react
import { AnimatePresence, motion } from "framer-motion";

export default function ErrorPopup({ message, onClose, duration = 6000 }) {
  useEffect(() => {
    if (!message || duration <= 0) return;

    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="relative mb-5 flex items-start gap-3 overflow-hidden rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-100 text-xs font-bold text-red-600 dark:bg-red-500/20 dark:text-red-400">
              !
            </span>
            <span className="flex-1 leading-snug">{message}</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Dismiss"
              className="shrink-0 text-lg leading-none text-current opacity-60 transition-opacity duration-150 hover:opacity-100"
            >
              ×
            </button>
            {duration > 0 && (
              <motion.div
                key={message}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className="absolute bottom-0 left-0 h-0.75 bg-current opacity-30"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
