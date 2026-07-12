import PostPreview from "./PostPreview";
import Button from "../ui/Button";
import { getPlatformMeta, getPostExternalUrl } from "../../lib/platforms";

export default function CreatePostLayout({ profile, platform, selectedPost, onBack }) {
  const platformMeta = getPlatformMeta(platform);

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex flex-1 flex-col gap-4 lg:flex-3">
        <button
          onClick={onBack}
          className="mb-1 w-fit rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700
            transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:border-night-700 dark:bg-night-800 dark:text-slate-200 dark:hover:bg-night-700"
        >
          ← Back
        </button>

        <PostPreview post={selectedPost} profile={profile} platform={platform} />
      </div>

      <div className="flex flex-col gap-4 lg:min-w-80" style={{ flex: "1.2 1 0%" }}>
        <div
          style={{ background: platformMeta.surface, borderColor: platformMeta.border }}
          className="flex items-center gap-3 rounded-2xl border p-4"
        >
          <div style={{ background: platformMeta.accent }} className="h-3.5 w-3.5 rounded-full" />
          <div>
            <div className="font-bold text-slate-900">{platformMeta.label} post</div>
            <div className="text-[13px] text-slate-500">Published</div>
          </div>
        </div>

        <Button
          style={{ background: platformMeta.accent }}
          onClick={() => {
            const url = getPostExternalUrl(selectedPost);
            if (url) window.open(url);
          }}
        >
          {platformMeta.buttonText}
        </Button>
      </div>
    </div>
  );
}
