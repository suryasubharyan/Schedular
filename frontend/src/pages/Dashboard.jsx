import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { createPostAPI, updatePostAPI } from "../api/post.api";
import AppShell from "../components/layout/AppShell";
import CreatePostLayout from "../components/createPost/CreatePostLayout";
import CreatePostWizard from "../components/createPost/CreatePostWizard";
import { PlusIcon } from "../components/Icons";
import useAuth from "../hooks/useAuth";
import { useNotification } from "../hooks/useNotification";
import { useSocialData } from "../hooks/useSocialData";
import { getErrorMessage } from "../utils/getErrorMessage";
import profileIcon from "../assets/profile-icon.svg";
import { formatPlatformLabel } from "../lib/platforms";
import usePostComposer from "../hooks/usePostComposer";
import EmptyState from "../components/dashboard/EmptyState";
import PostList from "../components/dashboard/PostList";
import Pagination from "../components/Pagination";
import useDashboardRedirectEffects from "../hooks/useDashboardRedirectEffects";

const TABS = ["draft", "scheduled", "posted"];
const CHAR_LIMITS = { x: 280 };
const PAGE_SIZE = 6; // ~2 rows on the 3-column desktop grid

// Maps a post status to the verb used in the "Scheduled/Published/Saved" toast.
const getSuccessVerb = (status) => {
  if (status === "scheduled") return "Scheduled";
  if (status === "posted") return "Published";
  return "Saved";
};

export default function Dashboard() {
  const { user } = useAuth();
  const { showError, showSuccess, showWarning } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const { accounts, posts, connectedAccounts, hasConnectedAccounts, loadPosts } =
    useSocialData();

  const [activeTab, setActiveTab] = useState("draft");
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentView, setCurrentView] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
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
  } = usePostComposer();

  const selectedAccount =
    accounts.find((account) => account.platform === platform) || null;
  const profile = selectedAccount?.profile || {
    name: user?.name || "User",
    profilePicture: user?.profilePicture || user?.customProfilePicture || profileIcon,
    username: user?.email?.split("@")?.[0] || "creator",
    profileHeadline: user?.headline || "Content creator",
  };

  const openCreateView = (initialStatus = "draft") => {
    if (!hasConnectedAccounts) {
      showWarning("Please connect at least one platform first");
      return;
    }

    const firstConnected = connectedAccounts[0];
    setPlatform(firstConnected?.platform || "linkedin");
    setCurrentView("create");
    setActiveTab(initialStatus);
    setSelectedPost(null);
    resetComposer();
  };

  useDashboardRedirectEffects({
    location,
    navigate,
    openCreateView,
    showSuccess,
    showError,
  });

  useEffect(() => {
    const firstConnected = accounts.find((account) => account.connected);
    const currentPlatformIsConnected = accounts.find(
      (account) => account.platform === platform
    )?.connected;

    if (firstConnected && !currentPlatformIsConnected) {
      setPlatform(firstConnected.platform);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  const syncSelectedPost = (post) => {
    setSelectedPost(post || null);
    syncComposerFromPost(post, connectedAccounts[0]?.platform);
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
        showSuccess(`${getSuccessVerb(finalStatus)} successfully`);
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
      showSuccess(`${getSuccessVerb(finalStatus)} for ${succeeded.map(formatPlatformLabel).join(", ")}`);
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

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

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
      {!hasConnectedAccounts && <EmptyState />}
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

                  <PostList
                    posts={paginatedPosts}
                    activeTab={activeTab}
                    search={search}
                    onPostClick={handlePostClick}
                  />

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
