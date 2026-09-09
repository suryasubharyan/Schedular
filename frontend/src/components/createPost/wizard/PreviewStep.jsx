import PostPreview from "../PostPreview";
import { PLATFORM_ORDER, getPlatformMeta } from "../../../lib/platforms";
import { PLATFORM_ICONS, WIZARD_WIDTH } from "./constants";

export default function PreviewStep({
  isEditing,
  activePreviewPlatform,
  selectPreviewPlatform,
  isConnected,
  previewPost,
  profile,
}) {
  return (
    <div className={`mx-auto ${WIZARD_WIDTH} pb-10`}>
      <p className="mb-3 text-center text-sm font-bold text-slate-700 dark:text-slate-200">
        {isEditing ? "Choose which platform this post is for" : "Tap a platform to preview how it'll look"}
      </p>

      <div className="mx-auto flex w-fit flex-wrap justify-center gap-1.5 rounded-2xl bg-slate-100 p-1.5 dark:bg-night-800">
        {PLATFORM_ORDER.map((platform) => {
          const meta = getPlatformMeta(platform);
          const Icon = PLATFORM_ICONS[platform];
          const connected = isConnected(platform);
          const activePreview = activePreviewPlatform === platform;

          return (
            <button
              key={platform}
              type="button"
              onClick={() => selectPreviewPlatform(platform)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200
                ${
                  activePreview
                    ? "bg-white text-slate-900 shadow-sm dark:bg-night-950 dark:text-white"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
            >
              <Icon className="h-5 w-5 rounded-md" />
              {meta.label}
              <span
                title={connected ? "Connected" : "Not connected"}
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  connected ? "bg-emerald-500" : "bg-slate-300 dark:bg-night-600"
                }`}
              />
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
        {getPlatformMeta(activePreviewPlatform).label} feed preview
      </p>

      <div className="mx-auto mt-3 max-w-xl">
        <PostPreview post={previewPost} profile={profile} platform={activePreviewPlatform} />
      </div>

      <p className="mt-5 text-xs leading-relaxed text-slate-400">
        {isEditing
          ? "Changes are saved to this post only — scheduled posts are picked up automatically at the selected time."
          : "Scheduled posts are picked up automatically at the selected time — you don't need to keep this tab open. This publishes one post per selected platform, all with the content you wrote."}
      </p>
    </div>
  );
}
