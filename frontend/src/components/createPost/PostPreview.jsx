import { MdVerified } from "react-icons/md";
import {
  IoBookmarkOutline,
  IoChatbubbleOutline,
  IoChevronDown,
  IoChevronForward,
  IoEarthOutline,
  IoEllipsisHorizontal,
  IoHeartOutline,
  IoPaperPlaneOutline,
  IoShareOutline,
  IoStatsChartOutline,
} from "react-icons/io5";
import { FaRetweet, FaThumbsUp } from "react-icons/fa";
import { getPostExternalUrl } from "../../lib/platforms";
import profileIcon from "../../assets/profile-icon.svg";

function getTimeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diff = Math.floor((now - past) / 1000);

  if (diff < 60) return "Just now";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  return `${days}d`;
}

const LONG_CAPTION = 200;

function Caption({ content }) {
  const parts = content.split(/(#[^\s#]+)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("#") ? (
          <span key={index} className="text-sky-600">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

function ExternalLinkButton({ post, accent, label }) {
  const externalUrl = getPostExternalUrl(post);
  if (!externalUrl) return null;

  return (
    <button
      type="button"
      onClick={() => window.open(externalUrl, "_blank")}
      style={{ background: accent }}
      className="mt-3 inline-block cursor-pointer rounded-full border-none px-4 py-2 text-sm font-semibold text-white
        transition-transform duration-200 hover:-translate-y-0.5"
    >
      {label}
    </button>
  );
}

function CarouselArrow() {
  return (
    <div className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-700 shadow">
      <IoChevronForward className="h-4 w-4" />
    </div>
  );
}

function LinkedInCard({ post, profile }) {
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
          <div className="truncate text-xs text-slate-500">{profile?.profileHeadline || "Professional headline"}</div>
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
        {[
          { icon: FaThumbsUp, label: "Like" },
          { icon: IoChatbubbleOutline, label: "Comment" },
          { icon: FaRetweet, label: "Repost" },
          { icon: IoPaperPlaneOutline, label: "Send" },
          // eslint-disable-next-line no-unused-vars -- used via JSX member tag (<Icon />), which core no-unused-vars doesn't track without eslint-plugin-react
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-slate-500">
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

function InstagramCard({ post, profile }) {
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

function FacebookCard({ post, profile }) {
  const images = post.imageUrls?.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : [];
  const isLong = post.content.length > LONG_CAPTION;

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-soft">
      <div className="flex items-start gap-2.5 p-4 pb-2">
        <img
          src={profile?.profilePicture || profileIcon}
          className="h-11 w-11 shrink-0 rounded-full object-cover"
          alt={profile?.name}
        />
        <div className="min-w-0 flex-1">
          <span className="text-sm font-semibold">{profile?.name || "Facebook User"}</span>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            {getTimeAgo(post.createdAt)} · <IoEarthOutline className="h-3 w-3" />
            <IoChevronDown className="h-3 w-3" />
          </div>
        </div>
        <IoEllipsisHorizontal className="h-4 w-4 shrink-0 text-slate-500" />
      </div>

      <div className="px-4 pb-2 text-sm leading-relaxed">
        <p className={isLong ? "line-clamp-3 whitespace-pre-wrap" : "whitespace-pre-wrap"}>
          <Caption content={post.content} />
        </p>
        {isLong && <span className="text-sm font-semibold text-slate-500">... See more</span>}
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

      <div className="flex items-center justify-between px-4 pt-2.5 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="grid h-4 w-4 place-items-center rounded-full bg-[#1877f2] text-white">
            <FaThumbsUp className="h-2 w-2" />
          </span>
          0
        </div>
        <div>0 comments · 0 shares</div>
      </div>

      <div className="mt-1 grid grid-cols-3 gap-1 border-t border-slate-100 px-2 py-1.5">
        {[
          { icon: FaThumbsUp, label: "Like" },
          { icon: IoChatbubbleOutline, label: "Comment" },
          { icon: IoShareOutline, label: "Share" },
          // eslint-disable-next-line no-unused-vars -- used via JSX member tag (<Icon />), which core no-unused-vars doesn't track without eslint-plugin-react
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-slate-500">
            <Icon className="h-4 w-4" />
            {label}
          </div>
        ))}
      </div>

      <div className="px-4 pb-4">
        <ExternalLinkButton post={post} accent="#1877f2" label="View on Facebook" />
      </div>
    </div>
  );
}

function XCard({ post, profile }) {
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

const PLATFORM_CARDS = {
  linkedin: LinkedInCard,
  instagram: InstagramCard,
  facebook: FacebookCard,
  x: XCard,
};

export default function PostPreview({ post, profile, platform = "linkedin" }) {
  if (!post) return null;

  const Card = PLATFORM_CARDS[platform] || LinkedInCard;
  return <Card post={post} profile={profile} />;
}
