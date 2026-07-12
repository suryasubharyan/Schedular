import { useCallback } from "react";

export function useMediaUpload({ imageUrls, setImageUrls, setVideoUrl, maxImages }) {
  const handleImageSelect = useCallback(
    async (event) => {
      const files = Array.from(event.target.files || []);
      if (!files.length) return;

      const allowedFiles = files.slice(0, maxImages - (imageUrls?.length || 0));
      if (!allowedFiles.length) return;

      const previews = await Promise.all(
        allowedFiles.map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(file);
            })
        )
      );

      setImageUrls([...(imageUrls || []), ...previews].slice(0, maxImages));
      event.target.value = null;
    },
    [imageUrls, maxImages, setImageUrls]
  );

  const handleVideoSelect = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      setVideoUrl(preview);
      event.target.value = null;
    },
    [setVideoUrl]
  );

  const handleRemoveImage = useCallback(
    (index) => {
      setImageUrls((current) => current.filter((_, idx) => idx !== index));
    },
    [setImageUrls]
  );

  return { handleImageSelect, handleVideoSelect, handleRemoveImage };
}
