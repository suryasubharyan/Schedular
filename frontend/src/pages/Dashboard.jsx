import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import {
  createPostAPI,
  deletePostAPI,
  updatePostAPI,
} from "../api/post.api";
import api from "../api/axios";
import ConnectPlatforms from "../components/ConnectPlatforms";
import CreatePostLayout from "../components/createPost/CreatePostLayout";
import { getLinkedInAccount } from "../api/linkedin.api";
import useAuth from "../hooks/useAuth";
import { useNotification } from "../context/NotificationContext";
import profileIcon from "../assets/profile-icon.svg";
export default function Dashboard() {
  const { user } = useAuth();
  const { showError, showSuccess, showWarning } = useNotification();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("draft");
  const [selectedPost, setSelectedPost] = useState(null);

  const [currentView, setCurrentView] = useState("dashboard");
  const [modalMode, setModalMode] = useState("scheduled");
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState(
    new Date(Date.now() + 10 * 60000) 
  );

  const [isConnected, setIsConnected] = useState(false);
  const [profile, setProfile] = useState(null);
  
const date = selectedDateTime
  ? selectedDateTime.toLocaleDateString("en-CA")
  : null;

const time = selectedDateTime
  ? selectedDateTime.toTimeString().slice(0, 5)
  : null;

  const resetComposer = () => {
    setContent("");
    setImageUrls([]);
    setSelectedDateTime(null);
  };

  const handleDisconnect = async () => {
  try {
    await api.post("/api/linkedin/disconnect");

    setIsConnected(false);
    setProfile(null);
    setPosts([]);

    showSuccess("LinkedIn disconnected");
  } catch {
    showError("Failed to disconnect");
  }
};

const filteredPosts = posts.filter((p) => p.status === activeTab);

const renderPostList = () => {
  if (!filteredPosts.length) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
        No {activeTab} posts found
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {filteredPosts.map((post) => (
        <div
          key={post._id}
          onClick={() => syncSelectedPost(post)}
          style={{
            padding: "16px",
            borderRadius: "16px",
            background: "#fff",
            border: "1px solid #e2e8f0",
            cursor: "pointer",
            position: "relative",
          }}
        >
          {/* content */}
          <div style={{ fontSize: "14px", fontWeight: "500" }}>
            {post.content.slice(0, 100)}...
          </div>

          {/* status badge */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "10px",
              fontWeight: "700",
              padding: "4px 8px",
              borderRadius: "999px",
              background: "#e2e8f0",
            }}
          >
            {post.status.toUpperCase()}
          </div>

          {/* scheduled info */}
          {post.status === "scheduled" && (
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#2563eb" }}>
              ⏰ {post.scheduledDate} • {post.scheduledSlot}
            </div>
          )}

          {/* posted info */}
          {post.status === "posted" && (
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#16a34a" }}>
              🚀 Published
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

  const syncSelectedPost = (post) => {
    setSelectedPost(post || null);
    setContent(post?.content || "");
    setImageUrls(
      Array.isArray(post?.imageUrls)
        ? post.imageUrls
        : post?.imageUrl
        ? [post.imageUrl]
        : []
    );
    setSelectedDateTime(
      post?.scheduledDate && post?.scheduledSlot
        ? new Date(`${post.scheduledDate}T${post.scheduledSlot}`)
        : null
    );
  };

  const loadPosts = async () => {
    if (!isConnected) {
      setPosts([]);
      return [];
    }

    try {
      const res = await api.get("/api/posts");
      const nextPosts = Array.isArray(res.data) ? res.data : [];
      setPosts(nextPosts);
      return nextPosts;
    } catch {
      setPosts([]);
      return [];
    }
  };

  useEffect(() => {
    const fetchLinkedIn = async () => {
      try {
        const res = await getLinkedInAccount();

        if (res.data.connected) {
          setIsConnected(true);
          setProfile(res.data.profile);
        } else {
          setIsConnected(false);
          setProfile(null);
        }
      } catch {
        setIsConnected(false);
        setProfile(null);
      }
    };

    fetchLinkedIn();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!isConnected) {
        setPosts([]);
        return;
      }

      try {
        const res = await api.get("/api/posts");
        const nextPosts = Array.isArray(res.data) ? res.data : [];
        setPosts(nextPosts);
      } catch {
        setPosts([]);
      }
    };

    fetchPosts();
  }, [isConnected]);

  const handleSavePost = async (forceStatus = null) => {
    if (!isConnected) {
      showWarning("Please connect LinkedIn first");
      return;
    }

    if (forceStatus !== "deleted" && !content.trim()) {
      showWarning("Write something first");
      return;
    }

    const finalStatus = forceStatus || modalMode;

   if (finalStatus === "scheduled" && !selectedDateTime) {
  showWarning("Select date and time to schedule");
  return;
}

    try {
      if (finalStatus === "deleted") {
        if (!selectedPost?._id) return;

        await deletePostAPI(selectedPost._id);
        const nextPosts = await loadPosts();

        setCurrentView("dashboard");
        setSelectedPost(null);
        resetComposer();

        if (!nextPosts.some((post) => post.status === activeTab)) {
          const fallbackTab = ["draft", "saved", "scheduled", "posted"].find(
            (tab) => nextPosts.some((post) => post.status === tab)
          );

          if (fallbackTab) {
            setActiveTab(fallbackTab);
          }
        }

        showSuccess("Post deleted successfully");
        return;
      }

      const payload = {
        content: content.trim(),
        platform: "linkedin",
        imageUrls,
        scheduledDate: finalStatus === "scheduled" ? date : null,
        scheduledSlot: finalStatus === "scheduled" ? time : null,
        status: finalStatus,
      };

      const response = selectedPost?._id
        ? await updatePostAPI(selectedPost._id, payload)
        : await createPostAPI(payload);

      const savedPost = response.data?.post;
      const nextPosts = await loadPosts();
      const nextStatus = savedPost?.status || finalStatus;
      const nextSelectedPost = savedPost?._id
        ? nextPosts.find((post) => post._id === savedPost._id) || null
        : null;

      setActiveTab(nextStatus);
      setCurrentView("dashboard");

      if (nextSelectedPost) {
        syncSelectedPost(nextSelectedPost);
      } else {
        setSelectedPost(null);
        resetComposer();
      }

      showSuccess(`Post ${nextStatus} successfully`);
    } catch (err) {
      showError(err.response?.data?.error || "Something went wrong");
    }
  };

  const openCreateView = (mode = "scheduled") => {
    if (!isConnected) {
      showWarning("Please connect LinkedIn first");
      return;
    }
    setCurrentView("create");
    setModalMode(mode);
    setActiveTab(mode);
    setSelectedPost(null);
    resetComposer();
  };

  const getCount = (status) => posts.filter((p) => p.status === status).length;
  const items = ["draft", "saved", "scheduled", "posted"];

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogoSection}>
          <div style={styles.sidebarLogo}>⚡</div>
          <div>
            <h2 style={styles.sidebarTitle}>Schedular</h2>
            <p style={styles.sidebarSubtitle}>Plan, schedule and publish smarter</p>
          </div>
        </div>

        <button type="button" style={styles.sidebarCreateButton} onClick={() => openCreateView("draft")}> 
          <span style={styles.createIcon}>+</span>
          Create Post
        </button>

        <div style={styles.sidebarSectionTitle}>POSTS</div>

        <nav style={styles.sidebarNav}>
          {items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setActiveTab(item);
                setCurrentView("dashboard");
                setSelectedPost(null);
              }}
              style={{
                ...styles.sidebarNavItem,
                background: activeTab === item ? "#eff6ff" : "transparent",
                color: activeTab === item ? "#1d4ed8" : "#334155",
                borderColor: activeTab === item ? "#bfdbfe" : "transparent",
              }}
            >
              <span style={styles.navItemText}>
                {item === "draft" && "Draft"}
                {item === "saved" && "Saved"}
                {item === "scheduled" && "Scheduled"}
                {item === "posted" && "Posted"}
              </span>
              <span style={styles.navItemCount}>{getCount(item)}</span>
            </button>
          ))}
        </nav>

        {/* <div style={styles.sidebarCard}>
          <div style={styles.sidebarCardHeader}>POSTS IN DRAFT</div>
          <div style={styles.sidebarCardBody}>
            {getCount("draft") === 0 ? (
              <>
                <div style={styles.sidebarCardEmptyIcon}>✍️</div>
                <p style={styles.sidebarCardEmptyText}>No items in draft</p>
              </>
            ) : (
              <p style={styles.sidebarCardInfo}>{getCount("draft")} draft post(s)</p>
            )}
          </div>
        </div> */}

        <div style={styles.sidebarFooter}>
          <button style={styles.sidebarFooterButton}>Settings</button>
          <button style={styles.sidebarFooterButton}>Help & Support</button>
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.topBar}>
          <div style={styles.searchWrapper}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search posts, accounts..."
              style={styles.searchInput}
            />
          </div>
          <div style={styles.topBarRight}>
              {isConnected && (
    <div style={styles.linkedinBox}>
      <img
        src={profile?.profilePicture || "https://via.placeholder.com/40"}
        alt="LinkedIn"
        style={styles.linkedinAvatar}
      />
      
      <div>
        <div style={styles.linkedinName}>
          {profile?.name || "LinkedIn User"}
        </div>
        <div style={styles.linkedinStatus}>Connected</div>
      </div>

      <button
        style={styles.disconnectBtn}
        onClick={handleDisconnect}
      >
        Disconnect
      </button>
    </div>
  )}
            <button type="button" style={styles.notificationButton}>🔔</button>
            <div style={styles.profileInfo} onClick={() => navigate("/profile")}> 
              <span>{user?.name || "User"}</span>
              <img
                src={user?.profilePicture || profileIcon}
                alt="User"
                style={styles.profileAvatar}
              />
            </div>
          </div>
        </div>
        
        
        <div style={styles.pageContent}>
  {!isConnected && (
    <div style={styles.connectCard}>
      <div style={styles.connectCardContent}>
        <div>
          <p style={styles.heroLabel}>Schedular</p>
          <h1 style={styles.heroTitle}>Connect Your Accounts</h1>
          <p style={styles.heroDescription}>
            Start by connecting a platform
          </p>
        </div>
        <ConnectPlatforms />
      </div>
    </div>
  )}

         
          {isConnected && (
            <div style={styles.connectedArea}>
              {currentView === "dashboard" && (
                <div style={styles.connectedContent}>
                  {selectedPost ? (
                    <CreatePostLayout
                      content={content}
                      setContent={setContent}
                      imageUrls={imageUrls}
                      setImageUrls={setImageUrls}
                      profile={profile}
                      selectedDateTime={selectedDateTime}
                      setSelectedDateTime={setSelectedDateTime}
                      onSave={handleSavePost}
                      onBack={() => {
                        setSelectedPost(null);
                        setCurrentView("dashboard");
                      }}
                      activeTab={activeTab}
                      selectedPost={selectedPost}
                    />
                  ) : (
                    <div style={styles.mainPlaceholder}>
                      {activeTab === "draft" && (
                        <>
                          <h2 style={styles.sectionTitle}>Draft Posts</h2>
                          <p style={styles.sectionDescription}>
                            Start creating content and save it as drafts to work on later.
                          </p>
                          <button
                            style={styles.createMainBtn}
                            onClick={() => openCreateView("draft")}
                          >
                            Create New Draft
                          </button>
                        </>
                      )}

                      {activeTab === "saved" && (
                        <>
                          <h2 style={styles.sectionTitle}>Saved Ideas</h2>
                          <p style={styles.sectionDescription}>
                            Store your brilliant ideas and templates for future use.
                          </p>
                          <button
                            style={styles.createMainBtn}
                            onClick={() => openCreateView("saved")}
                          >
                            Save New Idea
                          </button>
                        </>
                      )}

                      {activeTab === "scheduled" && (
                        <>
                          <h2 style={styles.sectionTitle}>Scheduled Posts</h2>
                          <p style={styles.sectionDescription}>
                            Plan and schedule your content for optimal engagement.
                          </p>
                          <button
                            style={styles.createMainBtn}
                            onClick={() => openCreateView("scheduled")}
                          >
                            Schedule New Post
                          </button>
                        </>
                      )}

                      {activeTab === "posted" && (
                        <>
                          <h2 style={styles.sectionTitle}>Posted Content</h2>
                          <p style={styles.sectionDescription}>
                            View your published posts and track performance metrics.
                          </p>
                        </>
                      )}

                    </div>
                    
                  )}
                  {filteredPosts.length > 0 && renderPostList()}
                </div>
              )}

              {currentView === "create" && (
                <CreatePostLayout
                  content={content}
                  setContent={setContent}
                  imageUrls={imageUrls}
                  setImageUrls={setImageUrls}
                  profile={profile}
                  selectedDateTime={selectedDateTime}
                  setSelectedDateTime={setSelectedDateTime}
                  onSave={handleSavePost}
                  onBack={() => setCurrentView("dashboard")}
                  activeTab={activeTab}
                  selectedPost={selectedPost}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#eef2ff",
    color: "#0f172a",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  sidebar: {
    width: "280px",
    background: "#ffffff",
    borderRight: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    padding: "28px 24px",
    gap: "28px",
  },
  sidebarLogoSection: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  sidebarLogo: {
    width: "48px",
    height: "48px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #0369a1, #60a5fa)",
    display: "grid",
    placeItems: "center",
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: 800,
  },
  sidebarTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  sidebarSubtitle: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },
  sidebarNav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  sidebarCreateButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    borderRadius: "18px",
    border: "none",
    padding: "14px 18px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 16px 40px rgba(37, 99, 235, 0.18)",
  },
  createIcon: {
    width: "26px",
    height: "26px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.18)",
    fontSize: "18px",
  },
  sidebarSectionTitle: {
    marginTop: "22px",
    marginBottom: "10px",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  },
  sidebarNavItem: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 18px",
    borderRadius: "18px",
    border: "1px solid transparent",
    background: "transparent",
    color: "#0f172a",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 600,
    transition: "all 0.2s ease",
    textAlign: "left",
  },
  navItemText: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
  },
  navItemCount: {
    minWidth: "28px",
    height: "28px",
    borderRadius: "999px",
    background: "#e0f2fe",
    color: "#0369a1",
    display: "grid",
    placeItems: "center",
    fontSize: "12px",
    fontWeight: 700,
  },
  sidebarCard: {
    marginTop: "22px",
    borderRadius: "22px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    padding: "20px",
  },
  sidebarCardHeader: {
    margin: 0,
    marginBottom: "16px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#334155",
  },
  sidebarCardBody: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    padding: "18px 8px",
    minHeight: "120px",
    background: "#f8fafc",
    borderRadius: "18px",
  },
  sidebarCardEmptyIcon: {
    fontSize: "32px",
  },
  sidebarCardEmptyText: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  sidebarCardInfo: {
    margin: 0,
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: 700,
  },
  sidebarFooter: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  sidebarFooterButton: {
    width: "100%",
    textAlign: "left",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    color: "#0f172a",
    cursor: "pointer",
    fontWeight: 600,
    transition: "background 0.2s ease",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "32px",
    gap: "28px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
  },
  breadcrumb: {
    margin: 0,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    fontSize: "12px",
    fontWeight: 700,
  },
  pageTitle: {
    margin: "8px 0 0",
    fontSize: "36px",
    lineHeight: 1.05,
    fontWeight: 800,
    color: "#0f172a",
  },
  topBarRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "520px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "8px 16px",
    gap: "10px",
    boxShadow: "0 5px 20px rgba(15, 23, 42, 0.06)",
  },
  searchIcon: {
    fontSize: "18px",
    color: "#94a3b8",
  },
  searchInput: {
    width: "100%",
    padding: "14px 0",
    border: "none",
    background: "transparent",
    color: "#0f172a",
    fontSize: "14px",
    outline: "none",
  },
  notificationButton: {
    width: "48px",
    height: "48px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#334155",
    cursor: "pointer",
    fontSize: "18px",
    display: "grid",
    placeItems: "center",
  },
  profileInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "16px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    fontWeight: 600,
    color: "#0f172a",
  },
  profileAvatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #60a5fa",
  },
  pageContent: {
    display: "grid",
    gap: "24px",
  },
  heroCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "24px",
    padding: "32px",
    background: "#ffffff",
    borderRadius: "28px",
    boxShadow: "0 30px 80px rgba(15, 23, 42, 0.08)",
  },
  heroText: {
    maxWidth: "720px",
  },
  heroLabel: {
    margin: 0,
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    marginBottom: "12px",
  },
  heroTitle: {
    margin: 0,
    fontSize: "42px",
    lineHeight: 1.05,
    fontWeight: 800,
    color: "#0f172a",
  },
  heroDescription: {
    margin: "18px 0 0",
    color: "#475569",
    fontSize: "16px",
    lineHeight: 1.7,
    maxWidth: "640px",
  },
  quickActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  actionButton: {
    padding: "14px 24px",
    borderRadius: "16px",
    border: "none",
    background: "#0369a1",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(3, 105, 161, 0.16)",
  },
  connectCard: {
    background: "#ffffff",
    borderRadius: "32px",
    padding: "32px",
    boxShadow: "0 30px 80px rgba(15, 23, 42, 0.08)",
  },
  connectCardContent: {
    display: "grid",
    gap: "32px",
  },
  connectSection: {
    padding: "28px",
    borderRadius: "28px",
    background: "#ffffff",
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
  },
  connectedArea: {
    display: "grid",
    gap: "24px",
  },
  connectedContent: {
    background: "#ffffff",
    borderRadius: "28px",
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
    padding: "28px",
  },
  mainPlaceholder: {
    textAlign: "center",
    margin: "24px auto",
    color: "#475569",
    maxWidth: "620px",
  },
  sectionTitle: {
    margin: "0 0 16px",
    fontSize: "28px",
    fontWeight: 700,
    color: "#0f172a",
  },
  sectionDescription: {
    margin: "0 0 24px",
    color: "#64748b",
    fontSize: "16px",
    lineHeight: 1.8,
  },
  createMainBtn: {
    marginTop: "20px",
    background: "#0077b5",
    padding: "14px 24px",
    borderRadius: "16px",
    border: "none",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "15px",
    boxShadow: "0 14px 32px rgba(0, 119, 181, 0.18)",
  },
  linkedinBox: {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  background: "#f0f9ff",
  border: "1px solid #bae6fd",
  padding: "8px 14px",
  borderRadius: "14px",
},

linkedinAvatar: {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
},

linkedinName: {
  fontSize: "14px",
  fontWeight: "600",
},

linkedinStatus: {
  fontSize: "12px",
  color: "#16a34a",
  fontWeight: "600",
},

disconnectBtn: {
  marginLeft: "10px",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
},
};
