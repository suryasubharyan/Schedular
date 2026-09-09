import { useState } from "react";
import GeneratingOverlay from "./GeneratingOverlay";
import EditPostDrawer from "./EditPostDrawer";
import { useMediaUpload } from "./useMediaUpload";
import WizardHeader from "./wizard/WizardHeader";
import ComposeStep from "./wizard/ComposeStep";
import PreviewStep from "./wizard/PreviewStep";
import ComposeFooter from "./wizard/ComposeFooter";
import usePlatformSelection from "./wizard/usePlatformSelection";
import useWizardLoadingSequence from "./wizard/useWizardLoadingSequence";
import { CHAR_LIMITS, WIZARD_MAX_IMAGES } from "./wizard/constants";

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
  editingPost = null,
  onBack,
  onSubmit,
}) {
  const isEditing = Boolean(editingPost);

  const [phase, setPhase] = useState(isEditing ? "preview" : "compose"); // compose | loading | preview
  const [editOpen, setEditOpen] = useState(false);

  const { steps, loadingStep, resetLoadingStep } = useWizardLoadingSequence(phase, setPhase);

  const { selectedPlatforms, activePreviewPlatform, isConnected, selectPreviewPlatform, togglePlatform } =
    usePlatformSelection({ isEditing, editingPost, accounts, connectedAccounts });

  const { handleImageSelect, handleVideoSelect, handleRemoveImage } = useMediaUpload({
    imageUrls,
    setImageUrls,
    setVideoUrl,
    maxImages: WIZARD_MAX_IMAGES,
  });

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
      <WizardHeader
        phase={phase}
        isEditing={isEditing}
        onBack={onBack}
        onEditClick={() => setEditOpen(true)}
        onPostNowClick={handlePostNowClick}
      />

      {phase === "compose" && (
        <ComposeStep
          content={content}
          setContent={setContent}
          profile={profile}
          imageUrls={imageUrls}
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          handleImageSelect={handleImageSelect}
          handleVideoSelect={handleVideoSelect}
          handleRemoveImage={handleRemoveImage}
        />
      )}

      {phase === "loading" && (
        <GeneratingOverlay steps={steps} activeStep={loadingStep} onSkip={() => setPhase("preview")} />
      )}

      {phase === "preview" && (
        <PreviewStep
          isEditing={isEditing}
          activePreviewPlatform={activePreviewPlatform}
          selectPreviewPlatform={selectPreviewPlatform}
          isConnected={isConnected}
          previewPost={previewPost}
          profile={profile}
        />
      )}

      {phase === "compose" && (
        <ComposeFooter
          onBack={onBack}
          onContinue={() => {
            resetLoadingStep();
            setPhase("loading");
          }}
          disabled={!content.trim()}
        />
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
