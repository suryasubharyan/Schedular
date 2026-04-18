import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createPostAPI,
  deletePostAPI,
  updatePostAPI,
} from "../api/post.api";
import api from "../api/axios";
import ConnectPlatforms from "../components/ConnectPlatforms";
import CreatePostLayout from "../components/createPost/CreatePostLayout";
import {
  getLinkedInAccount,
  disconnectLinkedIn,
  connectLinkedIn
} from "../api/linkedin.api";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import { useNotification } from "../context/NotificationContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { showError, showSuccess, showWarning } = useNotification();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("draft");
  const [selectedPost, setSelectedPost] = useState(null);

  const [currentView, setCurrentView] = useState("dashboard");
  const [modalMode, setModalMode] = useState("scheduled");
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const [isConnected, setIsConnected] = useState(false);
  const [profile, setProfile] = useState(null);

  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isResizing, setIsResizing] = useState(false);

  const resetComposer = () => {
    setContent("");
    setImageUrls([]);
    setSelectedDate("");
    setSelectedSlot("");
  };

const handleConnectLinkedIn = () => {
  connectLinkedIn(); // 🔥 direct use
};

const handleDisconnectLinkedIn = async () => {
  await disconnectLinkedIn();

  setIsConnected(false);
  setProfile(null);
  setPosts([]);
  setSelectedPost(null);
  resetComposer();
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
    setSelectedDate(post?.scheduledDate || "");
    setSelectedSlot(post?.scheduledSlot || "");
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
    } catch (err) {
      setPosts([]);
      return [];
    }
  };

  const loadLinkedIn = async () => {
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

  useEffect(() => {
    loadLinkedIn();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [isConnected]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      let newWidth = e.clientX;
      if (newWidth < 200) newWidth = 200;
      if (newWidth > 500) newWidth = 500;
      setSidebarWidth(newWidth);
    };

    const stopResize = () => setIsResizing(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing]);

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

    if (finalStatus === "scheduled" && (!selectedDate || !selectedSlot)) {
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
        scheduledDate: finalStatus === "scheduled" ? selectedDate : null,
        scheduledSlot: finalStatus === "scheduled" ? selectedSlot : null,
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

  const handlePostSelect = (post) => {
    syncSelectedPost(post);
    setCurrentView("dashboard");
    setActiveTab(post.status);
  };

  const getCount = (status) => posts.filter((p) => p.status === status).length;
  const filteredPosts = posts.filter((p) => p.status === activeTab);
  const items = ["draft", "saved", "scheduled", "posted"];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div style={styles.container}>
      {!isSidebarOpen && (
        <button onClick={toggleSidebar} style={styles.floatingToggle}>
          ☰
        </button>
      )}

      {isSidebarOpen && (
        <div style={{ ...styles.leftPanel, width: sidebarWidth }}>
          <div style={styles.sidebarHeader}>
            <button onClick={toggleSidebar} style={styles.menuBtn}>
              ☰
            </button>
            <h3
              style={{ margin: 0, cursor: "pointer" }}
              onClick={() => setCurrentView("dashboard")}
            >
              Posts
            </h3>
          </div>

          {items.map((item) => (
            <div
              key={item}
              onClick={() => {
                setActiveTab(item);
                setCurrentView("dashboard");
                setSelectedPost(null);
              }}
              style={{
                ...styles.card,
                background:
                  activeTab === item && currentView === "dashboard"
                    ? "#0077b5"
                    : "#ffffff",
                color:
                  activeTab === item && currentView === "dashboard"
                    ? "#ffffff"
                    : "#1a1a1a",
                border:
                  activeTab === item && currentView === "dashboard"
                    ? "1px solid #005885"
                    : "1px solid #e1e5e9",
              }}
              onMouseEnter={(e) => {
                if (!(activeTab === item && currentView === "dashboard")) {
                  e.target.style.background = "#f8fafc";
                  e.target.style.borderColor = "#0077b5";
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (!(activeTab === item && currentView === "dashboard")) {
                  e.target.style.background = "#ffffff";
                  e.target.style.borderColor = "#e1e5e9";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
                }
              }}
            >
              <span style={{ fontWeight: "bold" }}>{item.toUpperCase()}</span>
              <span style={styles.countBadge}>{getCount(item)}</span>
            </div>
          ))}

          <div style={styles.listContainer}>
            <h4 style={styles.listTitle}>Posts in {activeTab}</h4>
            <div style={styles.list}>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((p) => (
                  <div
                    key={p._id}
                    style={{
                      ...styles.listItem,
                      background: selectedPost?._id === p._id ? "#0077b5" : "#f8fafc",
                      color: selectedPost?._id === p._id ? "#ffffff" : "#1a1a1a",
                      borderLeft:
                        selectedPost?._id === p._id
                          ? "4px solid #005885"
                          : "4px solid transparent",
                    }}
                    onClick={() => handlePostSelect(p)}
                    onMouseEnter={(e) => {
                      if (selectedPost?._id !== p._id) {
                        e.target.style.background = "#0077b5";
                        e.target.style.color = "#ffffff";
                        const pElement = e.target.querySelector('p');
                        const spanElement = e.target.querySelector('span');
                        if (pElement) pElement.style.color = "#ffffff";
                        if (spanElement) spanElement.style.color = "#e1e5e9";
                        e.target.style.borderLeft = "4px solid #005885";
                        e.target.style.transform = "translateY(-1px)";
                        e.target.style.boxShadow = "0 2px 8px rgba(0, 119, 181, 0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedPost?._id !== p._id) {
                        e.target.style.background = "#f8fafc";
                        e.target.style.color = "#1a1a1a";
                        const pElement = e.target.querySelector('p');
                        const spanElement = e.target.querySelector('span');
                        if (pElement) pElement.style.color = "#1a1a1a";
                        if (spanElement) spanElement.style.color = "#666666";
                        e.target.style.borderLeft = "4px solid transparent";
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  >
                    <div style={styles.listItemContent}>
                      <p style={{
                        ...styles.listItemText,
                        color: selectedPost?._id === p._id ? "#ffffff" : "#1a1a1a"
                      }}>{p.content.slice(0, 50)}</p>
                      <span style={{
                        ...styles.listItemMeta,
                        color: selectedPost?._id === p._id ? "#e1e5e9" : "#666666"
                      }}>{p.status}</span>
                      {p.status === "posted" && p.linkedInUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(p.linkedInUrl, "_blank");
                          }}
                          style={styles.sidebarLinkButton}
                        >
                          Open
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p style={styles.sidebarEmptyText}>No items in {activeTab}</p>
              )}
            </div>
          </div>

          <div onMouseDown={() => setIsResizing(true)} style={styles.resizer} />
        </div>
      )}

      <div style={styles.main}>
        <Header
          user={user}
          isConnected={isConnected}
          onConnect={handleConnectLinkedIn}
          onDisconnect={handleDisconnectLinkedIn}
          onProfileClick={() => navigate("/profile")}
          onScheduleClick={() => openCreateView("scheduled")}
          onLogout={handleLogout}
          isSidebarOpen={isSidebarOpen}
        />

        {!isConnected ? (
          <ConnectPlatforms />
        ) : (
          <div style={styles.contentArea}>
            {currentView === "dashboard" && (
              <>
                {selectedPost ? (
                  <CreatePostLayout
                    content={content}
                    setContent={setContent}
                    imageUrls={imageUrls}
                    setImageUrls={setImageUrls}
                    profile={profile}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedTime={selectedSlot}
                    setSelectedTime={setSelectedSlot}
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
                        <h2 style={{ color: "#1a1a1a", marginBottom: "16px", fontSize: "28px", fontWeight: "700" }}>Draft Posts</h2>
                        <p style={{ color: "#666666", marginBottom: "24px", fontSize: "16px" }}>Start creating content and save it as drafts to work on later.</p>
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
                        <h2 style={{ color: "#1a1a1a", marginBottom: "16px", fontSize: "28px", fontWeight: "700" }}>Saved Ideas</h2>
                        <p style={{ color: "#666666", marginBottom: "24px", fontSize: "16px" }}>Store your brilliant ideas and templates for future use.</p>
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
                        <h2 style={{ color: "#1a1a1a", marginBottom: "16px", fontSize: "28px", fontWeight: "700" }}>Scheduled Posts</h2>
                        <p style={{ color: "#666666", marginBottom: "24px", fontSize: "16px" }}>Plan and schedule your content for optimal engagement.</p>
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
                        <h2 style={{ color: "#1a1a1a", marginBottom: "16px", fontSize: "28px", fontWeight: "700" }}>Posted Content</h2>
                        <p style={{ color: "#666666", marginBottom: "24px", fontSize: "16px" }}>View your published posts and track performance metrics.</p>
                      </>
                    )}
                  </div>
                )}
              </>
            )}

            {currentView === "create" && (
              <CreatePostLayout
                content={content}
                setContent={setContent}
                imageUrls={imageUrls}
                setImageUrls={setImageUrls}
                profile={profile}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTime={selectedSlot}
                setSelectedTime={setSelectedSlot}
                onSave={handleSavePost}
                onBack={() => setCurrentView("dashboard")}
                activeTab={activeTab}
                selectedPost={selectedPost}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { 
    display: "flex", 
    height: "100vh", 
    background: "#f8fafc", 
    color: "#1a1a1a", 
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
  },
  logoText: { 
    margin: 0, 
    background: "linear-gradient(90deg, #0077b5, #42a5f5)", 
    WebkitBackgroundClip: "text", 
    WebkitTextFillColor: "transparent",
    fontWeight: "700",
    fontSize: "24px"
  },

  card: { 
    padding: "12px 15px", 
    borderRadius: "8px", 
    marginBottom: "10px", 
    cursor: "pointer", 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center",
    background: "#ffffff",
    border: "1px solid #e1e5e9",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
  },
  cardHover: {
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
  },
  countBadge: { 
    background: "#0077b5", 
    color: "#ffffff",
    padding: "2px 8px", 
    borderRadius: "10px", 
    fontSize: "12px",
    fontWeight: "600"
  },
  listContainer: { 
    marginTop: "20px", 
    padding: "15px", 
    background: "#ffffff", 
    borderRadius: "12px", 
    border: "1px solid #e1e5e9",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
  },
  listTitle: { 
    margin: "0 0 12px 0", 
    color: "#666666", 
    fontSize: "12px", 
    fontWeight: "600", 
    textTransform: "uppercase", 
    letterSpacing: "0.5px" 
  },
  list: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "8px", 
    overflowY: "auto", 
    maxHeight: "45vh" 
  },
  sidebarLink: {
    marginTop: "8px",
    display: "inline-block",
    color: "#0a66c2",
    textDecoration: "underline",
    fontSize: "12px",
  },
  sidebarLinkButton: {
    marginTop: "8px",
    padding: "6px 10px",
    borderRadius: "18px",
    border: "1px solid #0a66c2",
    background: "#ffffff",
    color: "#0a66c2",
    fontSize: "12px",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  listItem: { 
    padding: "12px 14px", 
    background: "#f8fafc", 
    borderRadius: "8px", 
    cursor: "pointer", 
    fontSize: "13px", 
    border: "1px solid #e1e5e9", 
    transition: "all 0.2s ease", 
    display: "flex", 
    alignItems: "center" 
  },
  listItemContent: { 
    flex: 1, 
    display: "flex", 
    flexDirection: "column", 
    gap: "4px" 
  },
  listItemText: { 
    margin: 0, 
    color: "#1a1a1a", 
    fontSize: "13px", 
    lineHeight: "1.4", 
    wordBreak: "break-word" 
  },
  listItemMeta: { 
    fontSize: "10px", 
    color: "#666666", 
    textTransform: "capitalize" 
  },
  sidebarEmptyText: { 
    textAlign: "center", 
    color: "#999999", 
    fontSize: "12px", 
    marginTop: "20px", 
    fontStyle: "italic" 
  },

  main: { 
    flex: 1, 
    padding: "30px", 
    display: "flex", 
    flexDirection: "column", 
    overflowY: "auto" 
  },
  header: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: "30px",
    padding: "20px 0",
    borderBottom: "1px solid #e1e5e9"
  },
  createBtn: { 
    background: "#0077b5", 
    padding: "10px 20px", 
    borderRadius: "8px", 
    border: "none", 
    color: "#ffffff", 
    cursor: "pointer", 
    fontWeight: "600", 
    boxShadow: "0 2px 4px rgba(0, 119, 181, 0.2)",
    transition: "all 0.2s ease"
  },
  createBtnHover: {
    background: "#005885",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 8px rgba(0, 119, 181, 0.3)"
  },
  createMainBtn: { 
    marginTop: "20px", 
    background: "#0077b5", 
    padding: "12px 24px", 
    borderRadius: "8px", 
    border: "none", 
    color: "#ffffff", 
    cursor: "pointer", 
    fontWeight: "600", 
    fontSize: "16px",
    boxShadow: "0 2px 4px rgba(0, 119, 181, 0.2)",
    transition: "all 0.2s ease"
  },
  createMainBtnHover: {
    background: "#005885",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 8px rgba(0, 119, 181, 0.3)"
  },
  contentArea: { flex: 1 },

  mainPlaceholder: { 
    textAlign: "center", 
    marginTop: "100px", 
    color: "#666666",
    maxWidth: "500px",
    margin: "100px auto"
  },

  leftPanel: { 
    padding: "20px", 
    borderRight: "1px solid #e1e5e9", 
    position: "relative",
    background: "#ffffff"
  },
  sidebarHeader: { 
    display: "flex", 
    alignItems: "center", 
    gap: "12px", 
    marginBottom: "20px" 
  },
  menuBtn: { 
    background: "#0077b5", 
    border: "none", 
    borderRadius: "8px", 
    width: "40px", 
    height: "40px", 
    cursor: "pointer", 
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px"
  },
  resizer: { 
    position: "absolute", 
    top: 0, 
    right: 0, 
    width: "5px", 
    height: "100%", 
    cursor: "col-resize" 
  },
  headerRight: { 
    display: "flex", 
    gap: "15px", 
    alignItems: "center" 
  },
  appUserBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 12px",
    borderRadius: "12px",
    background: "#ffffff",
    border: "1px solid #e1e5e9",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
  },
  appUserBoxHover: {
    borderColor: "#0077b5",
    boxShadow: "0 2px 8px rgba(0, 119, 181, 0.2)"
  },
  profileBox: { 
    display: "flex", 
    alignItems: "center", 
    gap: "10px" 
  },
  profileImg: { 
    width: "35px", 
    height: "35px", 
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #0077b5"
  },
  profileLink: {
    textDecoration: "none",
    color: "#1a1a1a",
    border: "1px solid #e1e5e9",
    padding: "10px 16px",
    borderRadius: "8px",
    background: "#ffffff",
    fontWeight: "500",
    transition: "all 0.2s ease"
  },
  logoutBtn: {
    background: "#dc2626",
    padding: "10px 16px",
    borderRadius: "8px",
    color: "#ffffff",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease"
  },
  logoutBtnHover: {
    background: "#b91c1c",
    transform: "translateY(-1px)",
    boxShadow: "0 2px 4px rgba(220, 38, 38, 0.3)"
  },
  profileHeader: { 
    display: "flex", 
    alignItems: "center", 
    gap: "12px", 
    padding: "12px", 
    background: "#f8fafc", 
    borderRadius: "10px", 
    border: "1px solid #e1e5e9", 
    marginBottom: "12px" 
  },
  profileHeaderImg: { 
    width: "46px", 
    height: "46px", 
    borderRadius: "50%", 
    objectFit: "cover", 
    border: "2px solid #0077b5" 
  },
  disconnectBtn: { 
    background: "#ef4444", 
    padding: "8px 12px", 
    borderRadius: "8px", 
    color: "#ffffff", 
    border: "none", 
    cursor: "pointer", 
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.2s ease"
  },
  disconnectBtnHover: {
    background: "#dc2626",
    transform: "translateY(-1px)"
  },
  floatingToggle: { 
    position: "fixed", 
    top: "20px", 
    left: "20px", 
    zIndex: 1000, 
    background: "#0077b5", 
    border: "none", 
    borderRadius: "8px", 
    width: "48px", 
    height: "48px", 
    cursor: "pointer", 
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    boxShadow: "0 2px 8px rgba(0, 119, 181, 0.3)"
  },
};
