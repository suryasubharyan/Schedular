import {
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
} from "../Icons";

export const TINTS = {
  accent: {
    iconBg:
      "bg-linear-to-br from-accent-400 to-accent-600 text-white shadow-[0_10px_24px_-8px_rgba(45,212,191,0.65)]",
    cardBg:
      "bg-linear-to-br from-accent-50 via-white to-white dark:from-accent-500/15 dark:via-slate-800/60 dark:to-slate-900/60",
    border:
      "border-accent-200/80 hover:border-accent-400 dark:border-accent-500/25 dark:hover:border-accent-400/60",
    corner:
      "bg-accent-200/50 group-hover:bg-accent-300/70 dark:bg-accent-500/15 dark:group-hover:bg-accent-500/25",
    glow: "hover:shadow-[0_25px_60px_-20px_rgba(45,212,191,0.55)]",
    number: "text-accent-100 dark:text-accent-500/15",
  },
  brand: {
    iconBg:
      "bg-linear-to-br from-brand-400 to-brand-600 text-white shadow-[0_10px_24px_-8px_rgba(16,185,129,0.65)]",
    cardBg:
      "bg-linear-to-br from-brand-50 via-white to-white dark:from-brand-500/15 dark:via-slate-800/60 dark:to-slate-900/60",
    border:
      "border-brand-200/80 hover:border-brand-400 dark:border-brand-500/25 dark:hover:border-brand-400/60",
    corner:
      "bg-brand-200/50 group-hover:bg-brand-300/70 dark:bg-brand-500/15 dark:group-hover:bg-brand-500/25",
    glow: "hover:shadow-[0_25px_60px_-20px_rgba(16,185,129,0.55)]",
    number: "text-brand-100 dark:text-brand-500/15",
  },
  sky: {
    iconBg:
      "bg-linear-to-br from-sky-400 to-sky-600 text-white shadow-[0_10px_24px_-8px_rgba(14,165,233,0.65)]",
    cardBg:
      "bg-linear-to-br from-sky-50 via-white to-white dark:from-sky-500/15 dark:via-slate-800/60 dark:to-slate-900/60",
    border:
      "border-sky-200/80 hover:border-sky-400 dark:border-sky-500/25 dark:hover:border-sky-400/60",
    corner:
      "bg-sky-200/50 group-hover:bg-sky-300/70 dark:bg-sky-500/15 dark:group-hover:bg-sky-500/25",
    glow: "hover:shadow-[0_25px_60px_-20px_rgba(14,165,233,0.55)]",
    number: "text-sky-100 dark:text-sky-500/15",
  },
  linkedin: {
    iconBg: "",
    cardBg:
      "bg-linear-to-br from-sky-50 via-white to-white dark:from-sky-500/15 dark:via-slate-800/60 dark:to-slate-900/60",
    border:
      "border-sky-200/80 hover:border-sky-400 dark:border-sky-500/25 dark:hover:border-sky-400/60",
    corner:
      "bg-sky-200/40 group-hover:bg-sky-300/60 dark:bg-sky-500/10 dark:group-hover:bg-sky-500/20",
    glow: "hover:shadow-[0_25px_60px_-20px_rgba(10,102,194,0.55)]",
    number: "text-sky-100 dark:text-sky-500/15",
  },
};

export const FEATURES = [
  {
    number: "01",
    kind: "compose",
    tint: "accent",
    title: "Stop writing the same post four times",
    description:
      "You already said what you wanted to say — trimming it for X, reformatting it for LinkedIn, resizing images for Instagram is just busywork. Write it once here and we quietly handle the captions, image counts and previews for every platform.",
  },
  {
    number: "02",
    kind: "schedule",
    tint: "brand",
    title: "Set it and actually forget it",
    description:
      "No more opening five tabs at 9am hoping you don't miss the slot. Our scheduler checks every single minute, fires the post the second it's due, and quietly retries on its own if a platform has a hiccup.",
  },
  {
    number: "03",
    kind: "calendar",
    tint: "sky",
    title: "See your whole week before you live it",
    description:
      "One glance tells you what's drafted, what's queued, and what already went out — across every platform. No more scrolling back through apps trying to remember what you posted last Tuesday.",
  },
  {
    number: "04",
    kind: "linkedin",
    tint: "linkedin",
    title: "LinkedIn, without the copy-paste",
    description:
      "Connect your account once and publish text, image or multi-image posts straight from here, live on LinkedIn. No switching tabs, no re-uploading the same image by hand.",
  },
];

export const AI_FEATURE = {
  title: "For when you're just staring at a blank caption box",
  description:
    "Everyone's been there — post ready, no idea what to actually say. Ask for a caption, a hashtag set or a hook in your own voice, tweak it if it's not quite right, and schedule it before you lose the moment.",
  tags: ["Captions", "Hashtags", "Hook ideas"],
};

export const DEPLOYMENT_STATIONS = [
  { id: "linkedin", Icon: LinkedInIcon, label: "Live publishing" },
  { id: "instagram", Icon: InstagramIcon, label: "Preview ready" },
  { id: "facebook", Icon: FacebookIcon, label: "Preview ready" },
  { id: "x", Icon: TwitterIcon, label: "Preview ready" },
];

export const SCHEDULE_ROWS = [
  { Icon: LinkedInIcon, label: "LinkedIn", time: "09:30 AM", status: "live" },
  { Icon: InstagramIcon, label: "Instagram", time: "11:15 AM", status: "ready" },
  { Icon: FacebookIcon, label: "Facebook", time: "02:00 PM", status: "ready" },
  { Icon: TwitterIcon, label: "X", time: "04:45 PM", status: "ready" },
];
