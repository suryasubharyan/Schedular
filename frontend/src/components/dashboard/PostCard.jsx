// eslint-disable-next-line no-unused-vars -- used via JSX member tags (<motion.div>), which core no-unused-vars doesn't track without eslint-plugin-react
import { motion } from "framer-motion";
import { IoCreateOutline, IoEyeOutline } from "react-icons/io5";
import { formatPlatformLabel, getPlatformMeta, getPostExternalUrl } from "../../lib/platforms";

const getTimeAgo = (dateString) => {
  if (!dateString) return "";
  const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);

  if (diff < 60) return "Just now";
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `Updated ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `Updated ${days}d ago`;
};

export default function PostCard({ post, index, onClick }) {
  const meta = getPlatformMeta(post.platform);
  const isEditable = post.status === "draft" || post.status === "scheduled";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04 }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      style={{ borderColor: meta.border }}
      className="relative flex cursor-pointer flex-col gap-3 rounded-2xl border bg-white p-4 transition-shadow duration-200
        hover:shadow-md dark:bg-night-800"
    >
      <div className="flex items-start justify-between gap-2">
        <span
          style={{ background: meta.surface, color: meta.accent }}
          className="rounded-full px-2.5 py-1 text-[10px] font-bold"
        >
          {formatPlatformLabel(post.platform)}
        </span>

        <span
          title={isEditable ? "Edit post" : "View post"}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-400 transition-colors duration-200
            hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-night-700 dark:hover:text-slate-200"
        >
          {isEditable ? <IoCreateOutline className="h-4 w-4" /> : <IoEyeOutline className="h-4 w-4" />}
        </span>
      </div>

      <p className="line-clamp-3 text-sm font-medium text-slate-800 dark:text-slate-100">
        {post.content}
      </p>

      <div className="mt-auto text-xs text-slate-400">
        {post.status === "scheduled" && (
          <span className="font-semibold text-brand-600 dark:text-brand-400">
            {post.scheduledDate} at {post.scheduledSlot}
          </span>
        )}
        {post.status === "posted" && (
          <span className="font-semibold text-green-600 dark:text-green-400">
            Published {getPostExternalUrl(post) ? "and linked" : ""}
          </span>
        )}
        {post.status === "draft" && getTimeAgo(post.updatedAt)}
      </div>
    </motion.div>
  );
}
