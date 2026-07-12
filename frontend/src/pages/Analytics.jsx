import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Card from "../components/ui/Card";
import { useSocialData } from "../context/SocialDataContext";
import { PLATFORM_ORDER, formatPlatformLabel, getPlatformMeta } from "../lib/platforms";
import {
  CalendarIcon,
  ChevronDownIcon,
  LightbulbIcon,
  PostsIcon,
  SendIcon,
  ShieldIcon,
  StarIcon,
} from "../components/Icons";

const STATUS_META = {
  draft: {
    label: "Drafts",
    icon: PostsIcon,
    empty: "No drafts yet",
    iconClass: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400",
  },
  saved: {
    label: "Saved ideas",
    icon: LightbulbIcon,
    empty: "Start saving ideas",
    iconClass: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400",
  },
  scheduled: {
    label: "Scheduled",
    icon: CalendarIcon,
    empty: "Nothing scheduled",
    iconClass: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  },
  posted: {
    label: "Published",
    icon: SendIcon,
    empty: "No posts published",
    iconClass: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  },
};

const RANGE_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "all", label: "All time" },
];

export default function Analytics() {
  const { posts, connectedAccounts } = useSocialData();
  const [range, setRange] = useState("7");
  const [now] = useState(() => Date.now());

  const statusCounts = useMemo(() => {
    return Object.keys(STATUS_META).reduce((acc, status) => {
      acc[status] = posts.filter((post) => post.status === status).length;
      return acc;
    }, {});
  }, [posts]);

  const rangedPosts = useMemo(() => {
    if (range === "all") return posts;
    const days = Number(range);
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    return posts.filter((post) => post.createdAt && new Date(post.createdAt).getTime() >= cutoff);
  }, [posts, range, now]);

  const platformCounts = useMemo(() => {
    return PLATFORM_ORDER.map((platform) => ({
      platform,
      total: rangedPosts.filter((post) => post.platform === platform).length,
      posted: rangedPosts.filter((post) => post.platform === platform && post.status === "posted").length,
    }));
  }, [rangedPosts]);

  const maxPlatformTotal = Math.max(1, ...platformCounts.map((p) => p.total));
  const totalRangedPosts = rangedPosts.length;

  const topPerformer = useMemo(() => {
    if (connectedAccounts.length === 0) return null;
    return connectedAccounts.reduce((best, account) => {
      const posted = statusCounts.posted
        ? posts.filter((post) => post.platform === account.platform && post.status === "posted").length
        : 0;
      if (!best || posted > best.posted) return { account, posted };
      return best;
    }, null);
  }, [connectedAccounts, posts, statusCounts.posted]);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Overview
          </p>
          <h1 className="font-display mt-1 text-3xl font-semibold text-slate-900 dark:text-white">Analytics</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            A snapshot of your content pipeline, computed from your posts. Engagement metrics
            (likes, comments, reach) require live platform APIs and aren't available yet outside LinkedIn.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(STATUS_META).map(([status, meta], index) => {
            const Icon = meta.icon;
            const count = statusCounts[status];
            return (
              <Card key={status} hover index={index} className="p-5">
                <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${meta.iconClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{meta.label}</p>
                <p className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white">{count}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {count === 0 ? meta.empty : `${count} total`}
                </p>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="p-6 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Posts by platform</h2>
              <div className="relative">
                <select
                  value={range}
                  onChange={(event) => setRange(event.target.value)}
                  className="appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-600
                    outline-none transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  {RANGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {totalRangedPosts === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400">
                  <CalendarIcon className="h-8 w-8" />
                </div>
                <p className="text-base font-bold text-slate-800 dark:text-slate-100">No posts yet</p>
                <p className="mt-1 max-w-xs text-sm text-slate-400">
                  Create your first post to see analytics across platforms.
                </p>
                <Link
                  to="/dashboard"
                  state={{ openCreate: true }}
                  className="mt-5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-soft
                    transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg"
                >
                  + Create Post
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {platformCounts.map(({ platform, total, posted }) => {
                  const meta = getPlatformMeta(platform);
                  const width = totalRangedPosts ? Math.round((total / maxPlatformTotal) * 100) : 0;

                  return (
                    <div key={platform}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {formatPlatformLabel(platform)}
                        </span>
                        <span className="text-slate-400">
                          {total} total · {posted} published
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          style={{ width: `${width}%`, background: meta.accent }}
                          className="h-full rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-slate-100 pt-5 dark:border-slate-800">
              {PLATFORM_ORDER.map((platform) => {
                const meta = getPlatformMeta(platform);
                return (
                  <span key={platform} className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span className="h-2 w-2 rounded-full" style={{ background: meta.accent }} />
                    {formatPlatformLabel(platform)}
                  </span>
                );
              })}
            </div>
          </Card>

          <Card className="h-fit p-6 sm:p-7">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Connected reach</h2>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              {connectedAccounts.length} platform{connectedAccounts.length === 1 ? "" : "s"} connected.
            </p>

            {connectedAccounts.length === 0 ? (
              <p className="text-sm text-slate-400">
                <Link to="/platforms" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
                  Connect a platform
                </Link>{" "}
                to get started.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {connectedAccounts.map((account) => {
                  const meta = getPlatformMeta(account.platform);
                  return (
                    <div
                      key={account.platform}
                      className="rounded-xl border border-slate-100 px-3.5 py-3 dark:border-slate-800"
                    >
                      <div className="flex items-center justify-between">
                        <span style={{ color: meta.accent }} className="text-sm font-bold">
                          {meta.label}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {account.profile?.name || account.profile?.username || "Connected"}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-lg font-extrabold text-slate-900 dark:text-white">0</p>
                          <p className="text-[11px] text-slate-400">Total followers</p>
                        </div>
                        <div>
                          <p className="text-lg font-extrabold text-slate-900 dark:text-white">0</p>
                          <p className="text-[11px] text-slate-400">Total reach</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {topPerformer && (
              <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
                <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Top performing platform
                </p>
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 px-3.5 py-3 dark:border-slate-800">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-500/10">
                    <StarIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                      {formatPlatformLabel(topPerformer.account.platform)}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {topPerformer.account.profile?.name || topPerformer.account.profile?.username || "Connected"}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-slate-400">
                    {topPerformer.posted > 0 ? `${topPerformer.posted} published` : "No engagement data yet"}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50 px-5 py-4 text-sm text-brand-700 dark:border-brand-900/40 dark:bg-brand-500/10 dark:text-brand-300">
          <ShieldIcon className="h-4 w-4 shrink-0" />
          Analytics are updated as data becomes available from connected platforms.
        </div>
      </div>
    </AppShell>
  );
}
