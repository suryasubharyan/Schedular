import { IoChevronForward } from "react-icons/io5";
import { getPostExternalUrl } from "../../../lib/platforms";

export function Caption({ content }) {
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

export function ExternalLinkButton({ post, accent, label }) {
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

export function CarouselArrow() {
  return (
    <div className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-700 shadow">
      <IoChevronForward className="h-4 w-4" />
    </div>
  );
}
