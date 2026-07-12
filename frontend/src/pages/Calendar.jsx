import { useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import Card from "../components/ui/Card";
import { useSocialData } from "../context/SocialDataContext";
import { formatPlatformLabel, getPlatformMeta } from "../lib/platforms";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dateKey = (date) => date.toLocaleDateString("en-CA");

function buildMonthGrid(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}

export default function CalendarPage() {
  const { posts } = useSocialData();
  const [monthDate, setMonthDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()));

  const postsByDate = useMemo(() => {
    const map = {};

    posts.forEach((post) => {
      let key = null;
      if (post.status === "scheduled" && post.scheduledDate) {
        key = post.scheduledDate;
      } else if (post.status === "posted" && (post.updatedAt || post.createdAt)) {
        key = dateKey(new Date(post.updatedAt || post.createdAt));
      }

      if (!key) return;
      if (!map[key]) map[key] = [];
      map[key].push(post);
    });

    return map;
  }, [posts]);

  const historyItems = useMemo(() => {
    return posts
      .filter((post) => post.status === "posted" || post.status === "scheduled")
      .map((post) => {
        const sortDate =
          post.status === "scheduled" && post.scheduledDate
            ? new Date(`${post.scheduledDate}T${post.scheduledSlot || "00:00"}`)
            : new Date(post.updatedAt || post.createdAt);
        return { post, sortDate };
      })
      .sort((a, b) => b.sortDate - a.sortDate)
      .slice(0, 12);
  }, [posts]);

  const days = useMemo(() => buildMonthGrid(monthDate), [monthDate]);
  const monthLabel = monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const todayKey = dateKey(new Date());
  const selectedPosts = postsByDate[selectedDate] || [];

  const changeMonth = (delta) => {
    setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Schedule
            </p>
            <h1 className="font-display mt-1 text-3xl font-semibold text-slate-900 dark:text-white">Calendar</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="rounded-xl border border-slate-200 px-3.5 py-2.5 font-bold text-slate-600 transition-all duration-200
                hover:-translate-y-0.5 hover:bg-slate-100 dark:border-night-700 dark:text-slate-300 dark:hover:bg-night-800"
            >
              ←
            </button>
            <span className="min-w-40 text-center font-bold text-slate-800 dark:text-slate-100">{monthLabel}</span>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="rounded-xl border border-slate-200 px-3.5 py-2.5 font-bold text-slate-600 transition-all duration-200
                hover:-translate-y-0.5 hover:bg-slate-100 dark:border-night-700 dark:text-slate-300 dark:hover:bg-night-800"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="p-4 sm:p-6">
            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase tracking-wide text-slate-400">
              {WEEKDAYS.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {days.map((date) => {
                const key = dateKey(date);
                const isCurrentMonth = date.getMonth() === monthDate.getMonth();
                const dayPosts = postsByDate[key] || [];
                const isSelected = key === selectedDate;
                const isToday = key === todayKey;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDate(key)}
                    className={`flex min-h-20 flex-col items-start gap-1 rounded-xl border p-2 text-left transition-all duration-200
                      hover:-translate-y-0.5 hover:shadow-md
                      ${isSelected ? "border-brand-500 bg-brand-50 dark:bg-brand-900/30" : "border-slate-100 bg-slate-50 dark:border-night-800 dark:bg-night-800/40"}
                      ${!isCurrentMonth ? "opacity-40" : ""}`}
                  >
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold
                        ${isToday ? "bg-brand-600 text-white" : "text-slate-600 dark:text-slate-300"}`}
                    >
                      {date.getDate()}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {dayPosts.slice(0, 3).map((post) => {
                        const meta = getPlatformMeta(post.platform);
                        return (
                          <span
                            key={post._id}
                            style={{ background: meta.accent }}
                            className="h-1.5 w-1.5 rounded-full"
                          />
                        );
                      })}
                      {dayPosts.length > 3 && (
                        <span className="text-[10px] font-semibold text-slate-400">+{dayPosts.length - 3}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="h-fit p-5 sm:p-6">
            <h2 className="mb-1 font-bold text-slate-900 dark:text-white">
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              {selectedPosts.length} post{selectedPosts.length === 1 ? "" : "s"}
            </p>

            {selectedPosts.length === 0 ? (
              <p className="text-sm text-slate-400">Nothing scheduled or published on this day.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedPosts.map((post) => {
                  const meta = getPlatformMeta(post.platform);
                  return (
                    <div
                      key={post._id}
                      style={{ borderColor: meta.border }}
                      className="rounded-xl border p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span style={{ color: meta.accent }} className="text-xs font-bold">
                          {formatPlatformLabel(post.platform)}
                        </span>
                        <span className="text-[10px] font-semibold uppercase text-slate-400">{post.status}</span>
                      </div>
                      <p className="line-clamp-2 text-sm text-slate-700 dark:text-slate-200">{post.content}</p>
                      {post.scheduledSlot && (
                        <p className="mt-1 text-xs text-slate-400">at {post.scheduledSlot}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <Card className="mt-6 p-5 sm:p-6">
          <h2 className="mb-1 font-bold text-slate-900 dark:text-white">History</h2>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
            Your most recently scheduled and published posts, across every platform.
          </p>

          {historyItems.length === 0 ? (
            <p className="text-sm text-slate-400">No scheduled or published posts yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {historyItems.map(({ post, sortDate }) => {
                const meta = getPlatformMeta(post.platform);
                return (
                  <div
                    key={post._id}
                    style={{ borderColor: meta.border }}
                    className="rounded-xl border p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span style={{ color: meta.accent }} className="text-xs font-bold">
                        {formatPlatformLabel(post.platform)}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase ${
                          post.status === "posted"
                            ? "text-green-600 dark:text-green-400"
                            : "text-brand-600 dark:text-brand-400"
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm text-slate-700 dark:text-slate-200">{post.content}</p>
                    <p className="mt-1.5 text-xs text-slate-400">
                      {sortDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      {post.status === "scheduled" && post.scheduledSlot ? ` at ${post.scheduledSlot}` : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
