import { MdVerified } from "react-icons/md";
import { IoChatbubbleOutline, IoEarthOutline, IoPaperPlaneOutline } from "react-icons/io5";
import { FaRetweet, FaThumbsUp } from "react-icons/fa";
import profileIcon from "../../../assets/profile-icon.svg";
import { LONG_CAPTION, getTimeAgo } from "./formatters";
import { Caption, ExternalLinkButton, CarouselArrow } from "./shared";

const ACTIONS = [
  { icon: FaThumbsUp, label: "Like" },
  { icon: IoChatbubbleOutline, label: "Comment" },
  { icon: FaRetweet, label: "Repost" },
  { icon: IoPaperPlaneOutline, label: "Send" },
];

export default function LinkedInCard({ post, profile }) {
  const images = post.imageUrls?.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : [];
  const isLong = post.content.length > LONG_CAPTION;

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-soft">
      <div className="flex items-start gap-2.5 p-4 pb-2">
        <img
          src={profile?.profilePicture || profileIcon}
          className="h-12 w-12 shrink-0 rounded-full object-cover"
          alt={profile?.name}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1">
              <span className="truncate text-sm font-semibold">{profile?.name || "User Name"}</span>
              <MdVerified className="h-3.5 w-3.5 shrink-0 text-[#0a66c2]" />
            </div>
            <button type="button" className="shrink-0 text-sm font-bold text-[#0a66c2]">
              + Follow
            </button>
          </div>
          <div className="truncate text-xs text-slate-500">
            {profile?.profileHeadline || "Professional headline"}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            {getTimeAgo(post.createdAt)}
            <IoEarthOutline className="h-3 w-3" />
          </div>
        </div>
      </div>

      <div className="px-4 pb-2 text-sm leading-relaxed">
        <p className={isLong ? "line-clamp-3 whitespace-pre-wrap" : "whitespace-pre-wrap"}>
          <Caption content={post.content} />
        </p>
        {isLong && <span className="text-sm font-semibold text-slate-500">...more</span>}
      </div>

      {post.videoUrl && (
        <div className="overflow-hidden bg-black">
          <video src={post.videoUrl} controls className="block max-h-105 w-full" />
        </div>
      )}

      {!post.videoUrl && images.length > 0 && (
        <div className="relative bg-slate-100">
          <img src={images[0]} className="block max-h-105 w-full object-cover" alt="post" />
          {images.length > 1 && <CarouselArrow />}
        </div>
      )}

      <div className="px-4 pt-2.5 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="grid h-4 w-4 place-items-center rounded-full bg-[#0a66c2] text-white">
            <FaThumbsUp className="h-2 w-2" />
          </span>
          0 · 0 comments · 0 reposts
        </div>
      </div>

      <div className="mt-1 grid grid-cols-4 gap-1 border-t border-slate-100 px-2 py-1.5">
        {/* eslint-disable-next-line no-unused-vars -- used via JSX member tag (<Icon />), which core no-unused-vars doesn't track without eslint-plugin-react */}
        {ACTIONS.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-slate-500"
          >
            <Icon className="h-4 w-4" />
            {label}
          </div>
        ))}
      </div>

      <div className="px-4 pb-4">
        <ExternalLinkButton post={post} accent="#0a66c2" label="View on LinkedIn" />
      </div>
    </div>
  );
}
