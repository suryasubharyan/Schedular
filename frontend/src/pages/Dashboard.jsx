import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars -- used via JSX member tags (<motion.div>), which core no-unused-vars doesn't track without eslint-plugin-react
import { motion } from "framer-motion";
import { IoCreateOutline, IoEyeOutline, IoSearchOutline } from "react-icons/io5";
import { createPostAPI, updatePostAPI } from "../api/post.api";
import AppShell from "../components/layout/AppShell";
import CreatePostLayout from "../components/createPost/CreatePostLayout";
import CreatePostWizard from "../components/createPost/CreatePostWizard";
import { PlatformsIcon, PlusIcon } from "../components/Icons";
import useAuth from "../hooks/useAuth";
import { useNotification } from "../context/NotificationContext";
import { useSocialData } from "../context/SocialDataContext";
import { getErrorMessage } from "../utils/getErrorMessage";
import profileIcon from "../assets/profile-icon.svg";
import {
  formatPlatformLabel,
  getPlatformMeta,
  getPostExternalUrl,
} from "../lib/platforms";

const TABS = ["draft", "scheduled", "posted"];
const CHAR_LIMITS = { x: 280 };
const POSTS_PER_PAGE = 6; // ~2 rows on the 3-column desktop grid
const createDefaultScheduleDate = () => new Date(Date.now() + 10 * 60000);

const getTimeAgo = (dateString) => {
  if (!dateString) return "";
  const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);

  if (diff < 60) return "Just now";
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `Updated ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `Updated ${days}d ago`;
};

export default function Dashboard() {
  const { user } = useAuth();
  const { showError, showSuccess, showWarning } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    accounts,
    posts,
    connectedAccounts,
    hasConnectedAccounts,
    loadPosts,
  } = useSocialData();

  const [activeTab, setActiveTab] = useState("draft");
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentView, setCurrentView] = useState("dashboard");
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [platform, setPlatform] = useState("linkedin");
  const [selectedDateTime, setSelectedDateTime] = useState(createDefaultScheduleDate);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const selectedAccount =
    accounts.find((account) => account.platform === platform) || null;
  const profile = selectedAccount?.profile || {
    name: user?.name || "User",
    profilePicture: user?.profilePicture || user?.customProfilePicture || profileIcon,
    username: user?.email?.split("@")?.[0] || "creator",
    profileHeadline: user?.headline || "Content creator",
  };

  const openCreateView = (mode = "draft") => {
    if (!hasConnectedAccounts) {
      showWarning("Please connect at least one platform first");
      return;
    }

    const firstConnected = connectedAccounts[0];
    setPlatform(firstConnected?.platform || "linkedin");
    setCurrentView("create");
    setActiveTab(mode);
    setSelectedPost(null);
    resetComposer();
  };

  useEffect(() => {
    if (location.state?.openCreate) {
      openCreateView("draft");
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const connected = params.get("connected");
    const error = params.get("error");
    const mode = params.get("mode");

    if (connected) {
      showSuccess(
        mode === "demo"
          ? `${formatPlatformLabel(connected)} connected in demo mode`
          : `${formatPlatformLabel(connected)} connected successfully`
      );
      navigate(location.pathname, { replace: true });
    } else if (error) {
      const platformFromError = error.replace("_connect_failed", "");
      showError(`Couldn't connect ${formatPlatformLabel(platformFromError)}. Please try again.`);
      navigate(location.pathname, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    const firstConnected = accounts.find((account) => account.connected);
    if (firstConnected && !accounts.find((account) => account.platform === platform)?.connected) {
      setPlatform(firstConnected.platform);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  const resetComposer = () => {
    setContent("");
    setImageUrls([]);
    setVideoUrl("");
    setSelectedDateTime(createDefaultScheduleDate());
  };

  const syncSelectedPost = (post) => {
    setSelectedPost(post || null);
    setContent(post?.content || "");
    setImageUrls(Array.isArray(post?.imageUrls) ? post.imageUrls : []);
    setVideoUrl(post?.videoUrl || "");
    setPlatform(post?.platform || connectedAccounts[0]?.platform || "linkedin");
    setSelectedDateTime(
      post?.scheduledDate && post?.scheduledSlot
        ? new Date(`${post.scheduledDate}T${post.scheduledSlot}`)
        : createDefaultScheduleDate()
    );
  };

  const handlePostClick = (post) => {
    syncSelectedPost(post);
    if (post.status === "draft" || post.status === "scheduled") {
      setCurrentView("create");
    }
  };

  const handleWizardSave = async (finalStatus, platforms) => {
    if (!platforms.length) {
      showWarning("Select at least one platform");
      return;
    }

    if (!content.trim()) {
      showWarning("Write something first");
      return;
    }

    if (platforms.includes("x") && content.trim().length > CHAR_LIMITS.x) {
      showWarning(`X posts must be ${CHAR_LIMITS.x} characters or fewer. Shorten your post or deselect X.`);
      return;
    }

    if (finalStatus === "scheduled" && !selectedDateTime) {
      showWarning("Select date and time to schedule");
      return;
    }

    const dateToUse = selectedDateTime?.toLocaleDateString("en-CA");
    const timeToUse = selectedDateTime?.toTimeString().slice(0, 5);

    if (selectedPost?._id) {
      try {
        await updatePostAPI(selectedPost._id, {
          content: content.trim(),
          platform: platforms[0],
          imageUrls,
          videoUrl,
          scheduledDate: finalStatus === "scheduled" ? dateToUse : null,
          scheduledSlot: finalStatus === "scheduled" ? timeToUse : null,
          status: finalStatus,
        });

        await loadPosts();
        setCurrentView("dashboard");
        setSelectedPost(null);
        resetComposer();
        setActiveTab(finalStatus);

        const verb = finalStatus === "scheduled" ? "Scheduled" : finalStatus === "posted" ? "Published" : "Saved";
        showSuccess(`${verb} successfully`);
      } catch (err) {
        showError(getErrorMessage(err));
      }
      return;
    }

    const results = await Promise.allSettled(
      platforms.map((targetPlatform) =>
        createPostAPI({
          content: content.trim(),
          platform: targetPlatform,
          imageUrls,
          videoUrl,
          scheduledDate: finalStatus === "scheduled" ? dateToUse : null,
          scheduledSlot: finalStatus === "scheduled" ? timeToUse : null,
          status: finalStatus,
        })
      )
    );

    const succeeded = platforms.filter((_, index) => results[index].status === "fulfilled");
    const failed = platforms
      .map((targetPlatform, index) => ({ platform: targetPlatform, result: results[index] }))
      .filter((entry) => entry.result.status === "rejected");

    await loadPosts();
    setCurrentView("dashboard");
    setSelectedPost(null);
    resetComposer();

    if (succeeded.length) {
      setActiveTab(finalStatus);
      const verb = finalStatus === "scheduled" ? "Scheduled" : finalStatus === "posted" ? "Published" : "Saved";
      showSuccess(`${verb} for ${succeeded.map(formatPlatformLabel).join(", ")}`);
    }

    if (failed.length) {
      showError(
        `Failed for ${failed.map((entry) => formatPlatformLabel(entry.platform)).join(", ")}: ${getErrorMessage(
          failed[0].result.reason
        )}`
      );
    }
  };

  const tabFilteredPosts = posts.filter((post) => post.status === activeTab);
  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return tabFilteredPosts;

    return tabFilteredPosts.filter(
      (post) =>
        post.content?.toLowerCase().includes(query) ||
        formatPlatformLabel(post.platform).toLowerCase().includes(query)
    );
  }, [tabFilteredPosts, search]);

  const getCount = (status) => posts.filter((post) => post.status === status).length;

  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE);
  }, [activeTab, search]);

  const renderPostList = () => {
    if (!filteredPosts.length) {
      return (
        <div className="py-10 text-center text-slate-500 dark:text-slate-400">
          No {activeTab} posts found{search ? " for your search" : ""}
        </div>
      );
    }

    const visiblePosts = filteredPosts.slice(0, visibleCount);

    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post, index) => {
            const meta = getPlatformMeta(post.platform);
            const isEditable = post.status === "draft" || post.status === "scheduled";

            return (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04 }}
                whileHover={{ y: -3 }}
                onClick={() => handlePostClick(post)}
                style={{ borderColor: meta.border }}
                className="relative flex cursor-pointer flex-col gap-3 rounded-2xl border bg-white p-4 transition-shadow duration-200
                  hover:shadow-md dark:bg-night-800"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    style={{ background: meta.surface, color: meta.accent }}
                    className="rounded-full px-2.5 py-1 text-[10px] font-bold"
                  >
                    {formatPlatformLabel(post.platform)}
                  </span>

                  <span
                    title={isEditable ? "Edit post" : "View post"}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-400 transition-colors duration-200
                      hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-night-700 dark:hover:text-slate-200"
                  >
                    {isEditable ? <IoCreateOutline className="h-4 w-4" /> : <IoEyeOutline className="h-4 w-4" />}
                  </span>
                </div>

                <p className="line-clamp-3 text-sm font-medium text-slate-800 dark:text-slate-100">
                  {post.content}
                </p>

                <div className="mt-auto text-xs text-slate-400">
                  {post.status === "scheduled" && (
                    <span className="font-semibold text-brand-600 dark:text-brand-400">
                      {post.scheduledDate} at {post.scheduledSlot}
                    </span>
                  )}
                  {post.status === "posted" && (
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      Published {getPostExternalUrl(post) ? "and linked" : ""}
                    </span>
                  )}
                  {post.status === "draft" && getTimeAgo(post.updatedAt)}
                </div>
              </motion.div>
            );
          })}
        </div>

        {visibleCount < filteredPosts.length && (
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + POSTS_PER_PAGE)}
            className="mx-auto w-fit rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700
              transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:border-night-700 dark:bg-night-800
              dark:text-slate-200 dark:hover:bg-night-700"
          >
            Show more ({filteredPosts.length - visibleCount} left)
          </button>
        )}
      </div>
    );
  };

  if (currentView === "create") {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 transition-colors duration-300 dark:bg-night-950">
        <div className="w-full py-6">
          <CreatePostWizard
            content={content}
            setContent={setContent}
            imageUrls={imageUrls}
            setImageUrls={setImageUrls}
            videoUrl={videoUrl}
            setVideoUrl={setVideoUrl}
            profile={profile}
            accounts={accounts}
            connectedAccounts={connectedAccounts}
            selectedDateTime={selectedDateTime}
            setSelectedDateTime={setSelectedDateTime}
            editingPost={selectedPost}
            onBack={() => {
              setCurrentView("dashboard");
              setSelectedPost(null);
            }}
            onSubmit={handleWizardSave}
          />
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      {!hasConnectedAccounts && (
        <div className="rounded-3xl bg-white p-8 shadow-soft transition-colors duration-300 dark:bg-night-900">
          <div className="grid max-w-lg gap-5">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              <PlatformsIcon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-semibold leading-tight text-slate-900 dark:text-white">
                Connect a platform to get started
              </h1>
              <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Posts are tied to a connected account. Head to Platforms to connect LinkedIn,
                Instagram, Facebook or X — then come back here to start composing.
              </p>
            </div>
            <Link
              to="/platforms"
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-soft
                transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg"
            >
              Go to Platforms →
            </Link>
          </div>
        </div>
      )}

      {hasConnectedAccounts && (
        <div className="grid gap-6">
          <div className="flex items-center justify-between gap-3">
            <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Posts</h1>
            <button
              type="button"
              onClick={() => openCreateView("draft")}
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-soft
                transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg"
            >
              <PlusIcon className="h-4 w-4" />
              Create Post
            </button>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-soft transition-colors duration-300 dark:bg-night-900 sm:p-7">
            <div className="grid gap-6">
              {selectedPost ? (
                <CreatePostLayout
                  profile={profile}
                  platform={selectedPost.platform}
                  selectedPost={selectedPost}
                  onBack={() => setSelectedPost(null)}
                />
              ) : (
                <>
                  <div className="flex max-w-sm items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5
                    transition-shadow duration-200 focus-within:shadow-md dark:border-night-700 dark:bg-night-800">
                    <span className="text-slate-400">
                      <IoSearchOutline className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search posts, platforms..."
                      className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-night-800">
                    {TABS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setActiveTab(item);
                          setSelectedPost(null);
                        }}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200
                          ${
                            activeTab === item
                              ? "bg-white text-brand-700 shadow-sm dark:bg-night-950 dark:text-brand-400"
                              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                          }`}
                      >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                        <span
                          className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-xs font-bold
                            ${
                              activeTab === item
                                ? "bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300"
                                : "bg-slate-200 text-slate-600 dark:bg-night-700 dark:text-slate-300"
                            }`}
                        >
                          {getCount(item)}
                        </span>
                      </button>
                    ))}
                  </div>

                  <h2 className="font-display text-center text-2xl font-semibold text-slate-900 dark:text-white">
                    {activeTab === "draft" && "Draft Posts"}
                    {activeTab === "scheduled" && "Scheduled Posts"}
                    {activeTab === "posted" && "Posted Content"}
                  </h2>

                  {renderPostList()}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
