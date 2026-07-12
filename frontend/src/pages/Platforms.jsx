import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars -- used via JSX member tags (<motion.div>), which core no-unused-vars doesn't track without eslint-plugin-react
import { motion } from "framer-motion";
import AppShell from "../components/layout/AppShell";
import Logo from "../components/Logo";
import { useSocialData } from "../context/SocialDataContext";
import { LinkedInIcon, InstagramIcon, FacebookIcon, TwitterIcon } from "../components/Icons";
import { PLATFORM_ORDER, getPlatformMeta } from "../lib/platforms";
import {
  IoGridOutline as GridIcon,
  IoLockClosedOutline as LockIcon,
  IoPeopleOutline as UsersIcon,
  IoSettingsOutline as GearIcon,
  IoTimeOutline as ClockIcon,
} from "react-icons/io5";

const PLATFORM_ICONS = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  x: TwitterIcon,
};

const PLATFORM_SUBTITLE = {
  linkedin: "Professional profile",
  instagram: "Business account",
  facebook: "Page",
  x: "Account",
};

const formatConnectedAt = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  if (date.toDateString() === now.toDateString()) return `Today, ${time}`;

  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;

  return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`;
};

export default function Platforms() {
  const { accounts, posts, handleConnect, handleDisconnect } = useSocialData();
  const [confirmingPlatform, setConfirmingPlatform] = useState(null);

  const connectedCount = accounts.filter((account) => account.connected).length;
  const totalPlatforms = PLATFORM_ORDER.length;

  const lastConnected = useMemo(() => {
    const withDates = accounts.filter((account) => account.connected && account.connectedAt);
    if (!withDates.length) return null;
    return withDates.reduce((latest, current) =>
      new Date(current.connectedAt) > new Date(latest.connectedAt) ? current : latest
    );
  }, [accounts]);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Connections
            </p>
            <h1 className="font-display mt-1 text-3xl font-semibold text-slate-900 dark:text-white">Platforms</h1>
            <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              Connect the social accounts you want to publish to. Disconnect anytime — your posts stay saved.
            </p>
          </div>

          <div className="relative hidden h-36 w-60 shrink-0 lg:block">
            <div className="absolute inset-0 rounded-3xl bg-brand-100/50 blur-2xl dark:bg-brand-500/10" />
            <svg className="absolute inset-0 h-full w-full text-brand-300 dark:text-brand-700/60" viewBox="0 0 240 144" fill="none">
              <path d="M120 72 55 28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M120 72 185 24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M120 72 205 78" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M120 72 175 122" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            </svg>
            <span className="absolute left-4 top-2 text-brand-400">✦</span>
            <span className="absolute right-6 bottom-4 text-brand-400">✦</span>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Logo className="h-14 w-14 drop-shadow-lg" />
            </motion.div>
            <LinkedInIcon className="absolute left-8 top-2 h-9 w-9 shadow-soft" />
            <InstagramIcon className="absolute right-6 top-0 h-9 w-9 shadow-soft" />
            <FacebookIcon className="absolute right-0 top-16 h-9 w-9 shadow-soft" />
            <TwitterIcon className="absolute right-10 bottom-0 h-9 w-9 shadow-soft" />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-night-800 dark:border-night-800 dark:bg-night-900">
          <div className="flex items-center gap-3 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              <UsersIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Connected accounts</p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                {connectedCount} / {totalPlatforms}
              </p>
              <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                {connectedCount === 0
                  ? "None connected yet"
                  : `${connectedCount} platform${connectedCount === 1 ? "" : "s"} connected`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              <GridIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Total platforms</p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">{totalPlatforms}</p>
              <p className="text-xs text-slate-400">Available to connect</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              <ClockIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Last connected</p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                {lastConnected ? getPlatformMeta(lastConnected.platform).label : "—"}
              </p>
              <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                {lastConnected ? formatConnectedAt(lastConnected.connectedAt) : "No connections yet"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {PLATFORM_ORDER.map((platform, index) => {
            const account = accounts.find((entry) => entry.platform === platform);
            const connected = Boolean(account?.connected);
            const Icon = PLATFORM_ICONS[platform];
            const meta = getPlatformMeta(platform);
            const totalPosts = posts.filter((post) => post.platform === platform).length;
            const publishedPosts = posts.filter(
              (post) => post.platform === platform && post.status === "posted"
            ).length;

            return (
              <motion.div
                key={platform}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className={`relative rounded-2xl border bg-white p-5 transition-all duration-200 dark:bg-night-900 ${
                  connected
                    ? "border-brand-400 ring-1 ring-brand-100 dark:border-brand-600 dark:ring-brand-900/40"
                    : "border-slate-200 dark:border-night-800"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Icon className="h-11 w-11" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{meta.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{PLATFORM_SUBTITLE[platform]}</p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      connected
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                        : "bg-slate-100 text-slate-500 dark:bg-night-800 dark:text-slate-400"
                    }`}
                  >
                    {connected ? "● Connected" : "Not Connected"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-night-800">
                  <div>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {connected ? totalPosts : "–"}
                    </p>
                    <p className="text-[11px] text-slate-400">Posts</p>
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {connected ? publishedPosts : "–"}
                    </p>
                    <p className="text-[11px] text-slate-400">Published</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2.5">
                  {connected && confirmingPlatform === platform ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setConfirmingPlatform(null)}
                        className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700
                          transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:border-night-700 dark:text-slate-200 dark:hover:bg-night-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleDisconnect(platform);
                          setConfirmingPlatform(null);
                        }}
                        className="flex-1 rounded-xl bg-red-500 px-3 py-2.5 text-xs font-bold text-white
                          transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-600"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : connected ? (
                    <>
                      <Link
                        to="/analytics"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700
                          transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:border-night-700 dark:text-slate-200 dark:hover:bg-night-800"
                      >
                        View Analytics
                      </Link>
                      <button
                        type="button"
                        onClick={() => setConfirmingPlatform(platform)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2.5 text-xs font-bold text-white
                          transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700"
                      >
                        <GearIcon className="h-3.5 w-3.5" />
                        Manage
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleConnect(platform)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700
                        transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:border-night-700 dark:text-slate-200 dark:hover:bg-night-800"
                    >
                      <Icon className="h-4 w-4" />
                      Connect {meta.label}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <LockIcon className="h-3.5 w-3.5" />
          Your connections are secure and encrypted. We never post without your permission.
        </div>
      </div>
    </AppShell>
  );
}
