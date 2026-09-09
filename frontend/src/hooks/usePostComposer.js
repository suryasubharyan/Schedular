import { useState } from "react";

const createDefaultScheduleDate = () => new Date(Date.now() + 10 * 60000);

export const usePostComposer = () => {
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [platform, setPlatform] = useState("linkedin");
  const [selectedDateTime, setSelectedDateTime] = useState(createDefaultScheduleDate);

  const resetComposer = () => {
    setContent("");
    setImageUrls([]);
    setVideoUrl("");
    setSelectedDateTime(createDefaultScheduleDate());
  };

  const syncComposerFromPost = (post, fallbackPlatform = "linkedin") => {
    setContent(post?.content || "");
    setImageUrls(Array.isArray(post?.imageUrls) ? post.imageUrls : []);
    setVideoUrl(post?.videoUrl || "");
    setPlatform(post?.platform || fallbackPlatform);
    setSelectedDateTime(
      post?.scheduledDate && post?.scheduledSlot
        ? new Date(`${post.scheduledDate}T${post.scheduledSlot}`)
        : createDefaultScheduleDate()
    );
  };

  return {
    content,
    setContent,
    imageUrls,
    setImageUrls,
    videoUrl,
    setVideoUrl,
    platform,
    setPlatform,
    selectedDateTime,
    setSelectedDateTime,
    resetComposer,
    syncComposerFromPost,
  };
};

export default usePostComposer;
