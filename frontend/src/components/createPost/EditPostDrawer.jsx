// eslint-disable-next-line no-unused-vars -- used via JSX member tags (<motion.div>), which core no-unused-vars doesn't track without eslint-plugin-react
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IoClose, IoImageOutline, IoVideocamOutline } from "react-icons/io5";
import ScheduleBox from "./ScheduleBox";
import Button from "../ui/Button";
import { PLATFORM_ORDER, getPlatformMeta } from "../../lib/platforms";

const CHAR_LIMITS = { x: 280 };
const MAX_IMAGES = 10;

export default function EditPostDrawer({
  open,
  onClose,
  content,
  setContent,
  imageUrls,
  handleImageSelect,
  handleRemoveImage,
  videoUrl,
  setVideoUrl,
  handleVideoSelect,
  selectedPlatforms,
  togglePlatform,
  isConnected,
  disconnectedSelected,
  overXLimit,
  canSubmit,
  selectedDateTime,
  setSelectedDateTime,
  onSubmit,
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-70 bg-slate-900/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            key="panel"
            className="fixed right-0 top-0 z-70 flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-slate-900"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Edit post</h2>
              <button
                type="button"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition-colors duration-200
                  hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <IoClose className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="flex flex-col gap-6">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What do you want to share today?"
                    className="min-h-40 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900
                      outline-none placeholder:text-slate-400 focus:border-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Media
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    <label
                      className="flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300
                        bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-brand-400
                        hover:bg-brand-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <IoImageOutline className="h-4 w-4" />
                      Images ({imageUrls?.length || 0}/{MAX_IMAGES})
                      <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
                    </label>

                    <label
                      className="flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300
                        bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-brand-400
                        hover:bg-brand-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <IoVideocamOutline className="h-4 w-4" />
                      {videoUrl ? "Replace Video" : "Video"}
                      <input type="file" accept="video/*" onChange={handleVideoSelect} className="hidden" />
                    </label>

                    {videoUrl && (
                      <button
                        type="button"
                        onClick={() => setVideoUrl("")}
                        className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-semibold text-red-700
                          transition-all duration-200 hover:bg-red-100"
                      >
                        Remove Video
                      </button>
                    )}
                  </div>

                  {imageUrls?.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2.5">
                      {imageUrls.map((src, index) => (
                        <div
                          key={index}
                          className="relative min-h-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                        >
                          <img src={src} alt={`preview-${index}`} className="block h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-black/65 text-[10px]
                              text-white transition-transform duration-200 hover:scale-110"
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {videoUrl && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-black">
                      <video src={videoUrl} className="block max-h-56 w-full" controls />
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Publish to
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORM_ORDER.map((platform) => {
                      const meta = getPlatformMeta(platform);
                      const connected = isConnected(platform);
                      const active = selectedPlatforms.includes(platform);

                      return (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => togglePlatform(platform)}
                          style={
                            active
                              ? { background: meta.accent, borderColor: meta.border }
                              : { borderColor: meta.border }
                          }
                          className={`rounded-full border px-3 py-2 text-sm font-bold transition-all duration-200
                            ${active ? "text-white" : "bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
                        >
                          {active ? "✓ " : ""}
                          {meta.label}
                          {!connected && (
                            <span
                              className="ml-1.5 rounded-full bg-black/10 px-1.5 py-0.5 text-[10px] font-bold uppercase
                                text-slate-500 dark:bg-white/10 dark:text-slate-300"
                            >
                              Not connected
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {selectedPlatforms.length === 0 && (
                    <p className="mt-2.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      Select at least one platform to publish, schedule, or save this post.
                    </p>
                  )}

                  {disconnectedSelected.length > 0 && (
                    <p className="mt-2.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      Connect{" "}
                      {disconnectedSelected.map((platform, index) => (
                        <span key={platform}>
                          {index > 0 && ", "}
                          <Link to="/platforms" className="underline">
                            {getPlatformMeta(platform).label}
                          </Link>
                        </span>
                      ))}{" "}
                      before you can publish there, or tap {disconnectedSelected.length > 1 ? "them" : "it"} again to
                      deselect.
                    </p>
                  )}

                  {overXLimit && (
                    <p className="mt-2.5 text-xs font-semibold text-red-500">
                      X posts must be {CHAR_LIMITS.x} characters or fewer. Shorten your post or deselect X.
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Schedule
                  </label>
                  <ScheduleBox selectedDateTime={selectedDateTime} setSelectedDateTime={setSelectedDateTime} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 border-t border-slate-100 px-5 py-4 dark:border-slate-800">
              <Button variant="secondary" disabled={!canSubmit} onClick={() => onSubmit("draft", selectedPlatforms)}>
                Save Draft
              </Button>
              <Button
                className="bg-brand-600 hover:bg-brand-700"
                disabled={!canSubmit || !selectedDateTime}
                onClick={() => onSubmit("scheduled", selectedPlatforms)}
              >
                Schedule
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
