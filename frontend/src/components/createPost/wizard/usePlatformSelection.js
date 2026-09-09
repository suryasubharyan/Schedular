import { useState } from "react";

// Tracks which platforms are selected to publish to, and which one is
// currently shown in the preview pane. Editing an existing post locks
// selection to a single platform; creating a new post allows multi-select.
export const usePlatformSelection = ({ isEditing, editingPost, accounts, connectedAccounts }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState(() =>
    isEditing ? [editingPost.platform] : connectedAccounts.map((account) => account.platform)
  );
  const [activePreviewPlatform, setActivePreviewPlatform] = useState(
    () => editingPost?.platform || connectedAccounts[0]?.platform || "linkedin"
  );

  const isConnected = (platform) => accounts.find((account) => account.platform === platform)?.connected;

  const selectPreviewPlatform = (platform) => {
    setActivePreviewPlatform(platform);
    if (isEditing) {
      setSelectedPlatforms([platform]);
    }
  };

  const togglePlatform = (platform) => {
    if (isEditing) {
      setActivePreviewPlatform(platform);
      setSelectedPlatforms([platform]);
      return;
    }

    setSelectedPlatforms((current) =>
      current.includes(platform) ? current.filter((item) => item !== platform) : [...current, platform]
    );
  };

  return {
    selectedPlatforms,
    activePreviewPlatform,
    isConnected,
    selectPreviewPlatform,
    togglePlatform,
  };
};

export default usePlatformSelection;
