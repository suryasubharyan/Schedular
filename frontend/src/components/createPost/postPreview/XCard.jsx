import { MdVerified } from "react-icons/md";
import {
  IoBookmarkOutline,
  IoChatbubbleOutline,
  IoHeartOutline,
  IoShareOutline,
  IoStatsChartOutline,
} from "react-icons/io5";
import { FaRetweet } from "react-icons/fa";
import profileIcon from "../../../assets/profile-icon.svg";
import { getTimeAgo } from "./formatters";
import { Caption, ExternalLinkButton } from "./shared";

export default function XCard({ post, profile }) {
  const images = post.imageUrls?.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : [];
  const username = profile?.username || (profile?.name || "creator").toLowerCase().replace(/\s+/g, "");

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-soft">
      <div className="flex gap-2.5">
        <img
          src={profile?.profilePicture || profileIcon}
          className="h-11 w-11 shrink-0 rounded-full object-cover"
          alt={profile?.name}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1 text-sm">
            <span className="truncate font-bold">{profile?.name || "X User"}</span>
            <MdVerified className="h-3.5 w-3.5 shrink-0 text-sky-500" />
            <span className="text-slate-500">
              @{username} · {getTimeAgo(post.createdAt)}
            </span>
          </div>

          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
            <Caption content={post.content} />
          </p>

          {post.videoUrl ? (
            <div className="mt-3 overflow-hidden rounded-2xl bg-black">
              <video src={post.videoUrl} controls className="block max-h-105 w-full" />
            </div>
          ) : images.length > 0 ? (
            <div
              className={`mt-3 grid gap-0.5 overflow-hidden rounded-2xl border border-slate-200 ${
                images.length > 1 ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
              {images.slice(0, 4).map((src, index) => (
                <img key={index} src={src} className="block max-h-52 w-full object-cover" alt={`post-${index}`} />
              ))}
            </div>
          ) : null}

          <div className="mt-3 flex items-center justify-between text-slate-500">
            <span className="flex items-center gap-1.5 text-xs">
              <IoChatbubbleOutline className="h-4 w-4" />0
            </span>
            <span className="flex items-center gap-1.5 text-xs">
              <FaRetweet className="h-4 w-4" />0
            </span>
            <span className="flex items-center gap-1.5 text-xs">
              <IoHeartOutline className="h-4 w-4" />0
            </span>
            <span className="flex items-center gap-1.5 text-xs">
              <IoStatsChartOutline className="h-4 w-4" />0
            </span>
            <IoBookmarkOutline className="h-4 w-4" />
            <IoShareOutline className="h-4 w-4" />
          </div>

          <ExternalLinkButton post={post} accent="#111111" label="View on X" />
        </div>
      </div>
    </div>
  );
}
