import { useEffect, useState } from "react";
import { IoImageOutline, IoInformationCircleOutline, IoPencilOutline, IoVideocamOutline } from "react-icons/io5";
import PostPreview from "./PostPreview";
import GeneratingOverlay from "./GeneratingOverlay";
import EditPostDrawer from "./EditPostDrawer";
import Button from "../ui/Button";
import { useMediaUpload } from "./useMediaUpload";
import { FacebookIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from "../Icons";
import { PLATFORM_ORDER, getPlatformMeta } from "../../lib/platforms";
import profileIcon from "../../assets/profile-icon.svg";

const PLATFORM_ICONS = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  x: TwitterIcon,
};

const CHAR_LIMITS = { x: 280 };
const WIZARD_MAX_IMAGES = 10;
const LOADING_STEPS = ["Reading your content", "Matching each platform's style", "Building your previews"];
const LOADING_STEP_DURATION = 1500;
const LOADING_DELAY = LOADING_STEPS.length * LOADING_STEP_DURATION;

const PHASE_COPY = {
  compose: "Write your content",
  preview: "Preview & choose where to publish",
};

const WIZARD_WIDTH = "w-4/5";

export default function CreatePostWizard({
  content,
  setContent,
  imageUrls,
  setImageUrls,
  videoUrl,
  setVideoUrl,
  profile,
  accounts = [],
  connectedAccounts = [],
  selectedDateTime,
  setSelectedDateTime,
  onBack,
  onSubmit,
}) {
  const [phase, setPhase] = useState("compose"); // compose | loading | preview
  const [loadingStep, setLoadingStep] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState(() =>
    connectedAccounts.map((account) => account.platform)
  );
  const [activePreviewPlatform, setActivePreviewPlatform] = useState(
    () => connectedAccounts[0]?.platform || "linkedin"
  );
  const [editOpen, setEditOpen] = useState(false);

  const { handleImageSelect, handleVideoSelect, handleRemoveImage } = useMediaUpload({
    imageUrls,
    setImageUrls,
    setVideoUrl,
    maxImages: WIZARD_MAX_IMAGES,
  });

  useEffect(() => {
    if (phase !== "loading") return undefined;

    const stepTimers = LOADING_STEPS.slice(1).map((_, index) =>
      setTimeout(() => setLoadingStep(index + 1), (index + 1) * LOADING_STEP_DURATION)
    );
    const doneTimer = setTimeout(() => setPhase("preview"), LOADING_DELAY);

    return () => {
      stepTimers.forEach(clearTimeout);
      clearTimeout(doneTimer);
    };
  }, [phase]);

  const isConnected = (platform) => accounts.find((account) => account.platform === platform)?.connected;

  const togglePlatform = (platform) => {
    setSelectedPlatforms((current) =>
      current.includes(platform) ? current.filter((item) => item !== platform) : [...current, platform]
    );
  };

  const previewPost = {
    content,
    imageUrls,
    videoUrl,
    createdAt: new Date().toISOString(),
  };

  const overXLimit = selectedPlatforms.includes("x") && content.trim().length > CHAR_LIMITS.x;
  const disconnectedSelected = selectedPlatforms.filter((platform) => !isConnected(platform));
  const canSubmit = selectedPlatforms.length > 0 && !overXLimit && disconnectedSelected.length === 0;

  const handlePostNowClick = () => {
    if (!canSubmit) {
      setEditOpen(true);
      return;
    }
    onSubmit("posted", selectedPlatforms);
  };

  return (
    <div>
      {phase !== "loading" && (
        <div className={`mx-auto mb-6 flex flex-wrap items-start justify-between gap-3 ${WIZARD_WIDTH}`}>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Create Post</h1>
            <p className="mt-1 text-sm text-slate-400">{PHASE_COPY[phase]}</p>
          </div>

          {phase === "preview" && (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold
                  text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700
                  dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <IoPencilOutline className="h-4 w-4" />
                Edit
              </button>
              <Button className="bg-brand-600 hover:bg-brand-700" onClick={handlePostNowClick}>
                Post Now
              </Button>
            </div>
          )}
        </div>
      )}

      {phase === "compose" && (
        <div className={`mx-auto ${WIZARD_WIDTH} pb-28`}>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
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
                  hover:bg-brand-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              >
                <IoImageOutline className="h-4 w-4" />
                Add Images ({imageUrls?.length || 0}/{WIZARD_MAX_IMAGES})
                <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
              </label>

              <label
                className="flex w-fit cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300
                  bg-white px-4 py-3 font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400
                  hover:bg-brand-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
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
      )}

      {phase === "loading" && (
        <GeneratingOverlay
          steps={LOADING_STEPS}
          activeStep={loadingStep}
          onSkip={() => setPhase("preview")}
        />
      )}

      {phase === "preview" && (
        <div className={`mx-auto ${WIZARD_WIDTH} pb-10`}>
          <p className="mb-3 text-center text-sm font-bold text-slate-700 dark:text-slate-200">
            Tap a platform to preview how it'll look
          </p>

          <div className="mx-auto flex w-fit flex-wrap justify-center gap-1.5 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800">
            {PLATFORM_ORDER.map((platform) => {
              const meta = getPlatformMeta(platform);
              const Icon = PLATFORM_ICONS[platform];
              const connected = isConnected(platform);
              const activePreview = activePreviewPlatform === platform;

              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => setActivePreviewPlatform(platform)}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200
                    ${
                      activePreview
                        ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                >
                  <Icon className="h-5 w-5 rounded-md" />
                  {meta.label}
                  <span
                    title={connected ? "Connected" : "Not connected"}
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      connected ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
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
            Scheduled posts are picked up automatically at the selected time — you don't need to keep this
            tab open. This publishes one post per selected platform, all with the content you wrote.
          </p>
        </div>
      )}

      {phase === "compose" && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-md
            dark:border-slate-800 dark:bg-slate-950/95 sm:px-6 lg:px-8"
        >
          <div className={`mx-auto flex items-center justify-between gap-3 ${WIZARD_WIDTH}`}>
            <button
              onClick={onBack}
              className="w-fit rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700
                transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              ← Back
            </button>

            <Button
              onClick={() => {
                setLoadingStep(0);
                setPhase("loading");
              }}
              disabled={!content.trim()}
            >
              Continue →
            </Button>
          </div>
        </div>
      )}

      <EditPostDrawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        content={content}
        setContent={setContent}
        imageUrls={imageUrls}
        handleImageSelect={handleImageSelect}
        handleRemoveImage={handleRemoveImage}
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        handleVideoSelect={handleVideoSelect}
        selectedPlatforms={selectedPlatforms}
        togglePlatform={togglePlatform}
        isConnected={isConnected}
        disconnectedSelected={disconnectedSelected}
        overXLimit={overXLimit}
        canSubmit={canSubmit}
        selectedDateTime={selectedDateTime}
        setSelectedDateTime={setSelectedDateTime}
        onSubmit={onSubmit}
      />
    </div>
  );
}
