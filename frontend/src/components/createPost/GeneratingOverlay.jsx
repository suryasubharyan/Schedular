// eslint-disable-next-line no-unused-vars -- used via JSX member tags (<motion.div>), which core no-unused-vars doesn't track without eslint-plugin-react
import { motion } from "framer-motion";
import { IoCheckmark, IoSparklesOutline } from "react-icons/io5";
import { FacebookIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from "../Icons";

const ORBIT_ICONS = [
  { Icon: LinkedInIcon, angle: 0 },
  { Icon: InstagramIcon, angle: 90 },
  { Icon: FacebookIcon, angle: 180 },
  { Icon: TwitterIcon, angle: 270 },
];

const BLOBS = [
  { top: "10%", left: "9%", size: 110, duration: 7 },
  { bottom: "16%", left: "16%", size: 70, duration: 6 },
  { top: "16%", right: "11%", size: 80, duration: 8 },
  { bottom: "12%", right: "9%", size: 130, duration: 6.5 },
  { top: "45%", left: "4%", size: 50, duration: 5.5 },
  { top: "40%", right: "5%", size: 60, duration: 7.5 },
];

export default function GeneratingOverlay({ steps, activeStep, onSkip }) {
  return (
    <div className="fixed inset-0 z-60 overflow-hidden bg-slate-50 dark:bg-night-950">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 38%, rgba(16,185,129,0.16), transparent 60%)",
        }}
      />

      {BLOBS.map((blob, index) => (
        <motion.div
          key={index}
          className="absolute rounded-4xl bg-brand-300/25 blur-2xl dark:bg-brand-500/15"
          style={{
            top: blob.top,
            left: blob.left,
            right: blob.right,
            bottom: blob.bottom,
            width: blob.size,
            height: blob.size,
          }}
          animate={{ y: [0, -22, 0], opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <div className="relative grid h-44 w-44 place-items-center">
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          >
            {/* eslint-disable-next-line no-unused-vars -- used via JSX member tag (<Icon />), which core no-unused-vars doesn't track without eslint-plugin-react */}
            {ORBIT_ICONS.map(({ Icon, angle }, index) => (
              <div
                key={index}
                className="absolute left-1/2 top-1/2 h-10 w-10"
                style={{ transform: `rotate(${angle}deg) translate(78px) rotate(-${angle}deg)` }}
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                  whileHover={{ scale: 1.25 }}
                  className="cursor-pointer"
                >
                  <Icon className="h-10 w-10 shadow-soft" />
                </motion.div>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="grid h-20 w-20 cursor-pointer place-items-center rounded-full bg-brand-600 text-white shadow-lg"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.92, rotate: 15 }}
          >
            <IoSparklesOutline className="h-9 w-9" />
          </motion.div>
        </div>

        <p className="mt-8 text-xl font-bold text-slate-900 dark:text-white">Generating your previews...</p>
        <p className="mt-1 text-sm text-slate-400">This usually takes a few seconds</p>

        <div className="mt-8 flex flex-col gap-3 text-left">
          {steps.map((label, index) => {
            const done = index < activeStep;
            const active = index === activeStep;

            return (
              <div key={label} className="flex items-center gap-3">
                {done ? (
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                    <IoCheckmark className="h-3.5 w-3.5" />
                  </span>
                ) : active ? (
                  <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
                ) : (
                  <span className="grid h-5 w-5 shrink-0 place-items-center">
                    <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-night-600" />
                  </span>
                )}
                <span
                  className={`text-sm ${
                    done || active
                      ? "font-semibold text-slate-800 dark:text-slate-100"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="mt-8 text-xs font-semibold text-slate-400 underline-offset-4 transition-colors duration-200
              hover:text-brand-600 hover:underline dark:text-slate-500 dark:hover:text-brand-400"
          >
            Skip and go to previews →
          </button>
        )}
      </div>
    </div>
  );
}
