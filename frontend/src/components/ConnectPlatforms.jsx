// eslint-disable-next-line no-unused-vars -- used via JSX member tags (<motion.button>), which core no-unused-vars doesn't track without eslint-plugin-react
import { motion } from "framer-motion";
import {
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
} from "./Icons";
import { PLATFORM_ORDER, getPlatformMeta } from "../lib/platforms";

const iconMap = {
  linkedin: LinkedInIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  x: TwitterIcon,
};

export default function ConnectPlatforms({
  accounts = [],
  onConnect,
  onOpenLinkedInConnect,
}) {
  const accountMap = accounts.reduce((acc, account) => {
    acc[account.platform] = account;
    return acc;
  }, {});

  return (
    <div className="grid w-full grid-cols-2 gap-4">
      {PLATFORM_ORDER.map((platform, index) => {
        const Icon = iconMap[platform];
        const meta = getPlatformMeta(platform);
        const account = accountMap[platform];
        const connected = Boolean(account?.connected);

        return (
          <motion.button
            key={platform}
            type="button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              platform === "linkedin"
                ? onOpenLinkedInConnect?.()
                : onConnect?.(platform)
            }
            style={connected ? { borderColor: meta.accent, boxShadow: `0 18px 40px ${hexToShadow(meta.accent)}` } : undefined}
            className={`flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border p-6 text-center
              transition-shadow duration-200 hover:shadow-lg
              ${
                connected
                  ? "bg-slate-50 dark:bg-night-800/60"
                  : "border-slate-200 bg-slate-50 dark:border-night-700 dark:bg-night-800/40"
              }`}
          >
            <Icon />
            <span className="text-base font-bold text-slate-900 dark:text-white">{meta.label}</span>
            <span
              style={connected ? { color: meta.accent } : undefined}
              className={connected ? "text-sm font-semibold" : "text-sm font-semibold text-slate-500 dark:text-slate-400"}
            >
              {connected ? "Connected" : "Connect"}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

const hexToShadow = (hex) => {
  const sanitized = hex.replace("#", "");
  const value = sanitized.length === 3
    ? sanitized.split("").map((char) => char + char).join("")
    : sanitized;

  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, 0.18)`;
};
