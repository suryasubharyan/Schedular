import { IoImageOutline, IoInformationCircleOutline, IoVideocamOutline } from "react-icons/io5";
import profileIcon from "../../../assets/profile-icon.svg";
import { WIZARD_MAX_IMAGES, WIZARD_WIDTH } from "./constants";

export default function ComposeStep({
  content,
  setContent,
  profile,
  imageUrls,
  videoUrl,
  setVideoUrl,
  handleImageSelect,
  handleVideoSelect,
  handleRemoveImage,
}) {
  return (
    <div className={`mx-auto ${WIZARD_WIDTH} pb-28`}>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-night-700 dark:bg-night-800">
        <div className="mb-3 flex gap-2.5">
          <img
            src={profile?.profilePicture || profileIcon}
            className="h-10 w-10 rounded-full object-cover"
            alt={profile?.name}
          />
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">{profile?.name}</div>
            <div className="text-xs font-bold text-brand-600 dark:text-brand-400">Write your post</div>
          </div>
        </div>

        <textarea
          placeholder="What do you want to share today?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-62.5 w-full resize-y overflow-y-auto border-none bg-transparent text-base text-slate-900
            outline-none placeholder:text-slate-400 dark:text-white"
        />

        <div className="mt-2 flex flex-wrap gap-3">
          <label
            className="flex w-fit cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300
              bg-white px-4 py-3 font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400
              hover:bg-brand-50 dark:border-night-600 dark:bg-night-800 dark:text-slate-200"
          >
            <IoImageOutline className="h-4 w-4" />
            Add Images ({imageUrls?.length || 0}/{WIZARD_MAX_IMAGES})
            <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
          </label>

          <label
            className="flex w-fit cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300
              bg-white px-4 py-3 font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400
              hover:bg-brand-50 dark:border-night-600 dark:bg-night-800 dark:text-slate-200"
          >
            <IoVideocamOutline className="h-4 w-4" />
            {videoUrl ? "Replace Video" : "Add Video"}
            <input type="file" accept="video/*" onChange={handleVideoSelect} className="hidden" />
          </label>

          {videoUrl && (
            <button
              type="button"
              onClick={() => setVideoUrl("")}
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700
                transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-100"
            >
              Remove Video
            </button>
          )}
        </div>

        {imageUrls?.length > 0 && (
          <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
            {imageUrls.map((src, index) => (
              <div
                key={index}
                className="relative min-h-25 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              >
                <img src={src} alt={`preview-${index}`} className="block h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-black/65 text-xs
                    text-white transition-transform duration-200 hover:scale-110"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}

        {videoUrl && (
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-black">
            <video src={videoUrl} className="block max-h-80 w-full" controls />
          </div>
        )}

        <div className="mt-3 flex items-start gap-2 rounded-xl bg-brand-50 px-3 py-2.5 text-xs leading-relaxed
          text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
          <IoInformationCircleOutline className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            X keeps only the first 4 images and the first 280 characters — the rest apply as-is on
            LinkedIn, Instagram and Facebook.
          </span>
        </div>
      </div>
    </div>
  );
}
