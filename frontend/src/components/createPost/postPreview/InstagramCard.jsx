import { MdVerified } from "react-icons/md";
import {
  IoBookmarkOutline,
  IoChatbubbleOutline,
  IoEllipsisHorizontal,
  IoHeartOutline,
  IoPaperPlaneOutline,
} from "react-icons/io5";
import profileIcon from "../../../assets/profile-icon.svg";
import { getTimeAgo } from "./formatters";
import { Caption, ExternalLinkButton, CarouselArrow } from "./shared";

export default function InstagramCard({ post, profile }) {
  const images = post.imageUrls?.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : [];
  const username = profile?.username || (profile?.name || "creator").toLowerCase().replace(/\s+/g, "");

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-soft">
      <div className="flex items-center gap-2.5 p-3">
        <div
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full p-[2px]"
          style={{ background: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af)" }}
        >
          <img
            src={profile?.profilePicture || profileIcon}
            className="h-full w-full rounded-full border-2 border-white object-cover"
            alt={profile?.name}
          />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1 text-sm">
          <span className="truncate font-semibold">{username}</span>
          <MdVerified className="h-3.5 w-3.5 shrink-0 text-sky-500" />
          <span className="text-slate-400">· {getTimeAgo(post.createdAt)}</span>
        </div>
        <IoEllipsisHorizontal className="h-4 w-4 shrink-0 text-slate-500" />
      </div>

      {post.videoUrl ? (
        <div className="bg-black">
          <video src={post.videoUrl} controls className="block max-h-105 w-full" />
        </div>
      ) : images.length > 0 ? (
        <div className="relative bg-slate-100">
          <img src={images[0]} className="block aspect-square w-full object-cover" alt="post" />
          {images.length > 1 && (
            <>
              <CarouselArrow />
              <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1">
                {images.slice(0, 5).map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full ${index === 0 ? "bg-sky-500" : "bg-white/70"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : null}

      <div className="flex items-center justify-between px-3 pt-2.5">
        <div className="flex items-center gap-3.5">
          <IoHeartOutline className="h-6 w-6" />
          <IoChatbubbleOutline className="h-6 w-6" />
          <IoPaperPlaneOutline className="h-6 w-6 -rotate-12" />
        </div>
        <IoBookmarkOutline className="h-6 w-6" />
      </div>

      <div className="px-3 pb-4 pt-2 text-sm">
        <p className="font-semibold">0 likes</p>
        <p className="mt-1 whitespace-pre-wrap">
          <span className="font-semibold">{username} </span>
          <Caption content={post.content} />
        </p>
        <ExternalLinkButton post={post} accent="#e1306c" label="View on Instagram" />
      </div>
    </div>
  );
}
