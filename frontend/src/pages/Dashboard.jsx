import { useEffect, useState } from "react";
import { createPost } from "../api/post.api";
import api from "../api/axios";
import ConnectPlatforms from "../components/ConnectPlatforms";

function Logo({ onClick }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={onClick}>
      <svg width="40" height="40" viewBox="0 0 64 64">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#grad)" />
        <path d="M30 10 L22 34 H30 L26 54 L42 26 H34 L38 10 Z" fill="white" />
      </svg>
      <h2 style={styles.logoText}>Schedular</h2>
    </div>
  );
}

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("draft");
  const [selectedPost, setSelectedPost] = useState(null);

  // View state: 'dashboard' ya 'create'
  const [currentView, setCurrentView] = useState("dashboard");
  const [modalMode, setModalMode] = useState("scheduled"); 
  const [content, setContent] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const [isConnected, setIsConnected] = useState(() => !!localStorage.getItem("userId"));
  const [profileName, setProfileName] = useState(() => localStorage.getItem("profileName") || "");
  const [profileHeadline, setProfileHeadline] = useState(() => localStorage.getItem("profileHeadline") || "");
  const [profilePicture, setProfilePicture] = useState(() => localStorage.getItem("profilePicture") || "");

  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isResizing, setIsResizing] = useState(false);

  const loadPosts = async () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.log("No userId yet...");
    return;
  }

  try {
    const res = await api.get(`/api/posts?userId=${userId}`);

    console.log("Fetched posts:", res.data); // 🔍 debug

    setPosts(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.log("Fetch error:", err);
    setPosts([]);
  }
};

  // INIT
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");

    if (userId) {
      localStorage.setItem("userId", userId);
      setIsConnected(true);
    }

    const name = params.get("name");
    const headline = params.get("headline");
    const picture = params.get("profilePicture");

    if (name) {
      const decodedName = decodeURIComponent(name);
      localStorage.setItem("profileName", decodedName);
      setProfileName(decodedName);
    }
    if (headline) {
      const decodedHeadline = decodeURIComponent(headline);
      localStorage.setItem("profileHeadline", decodedHeadline);
      setProfileHeadline(decodedHeadline);
    }
    if (picture) {
      const decodedPicture = decodeURIComponent(picture);
      localStorage.setItem("profilePicture", decodedPicture);
      setProfilePicture(decodedPicture);
    }

    loadPosts();
  }, [isConnected]);

  // RESIZE
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
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("⚠️ Please connect LinkedIn first");
    if (!content) return alert("⚠️ Write something first");
    
    const finalStatus = forceStatus || modalMode;

    if (finalStatus === "scheduled" && (!selectedDate || !selectedSlot)) {
      return alert("⚠️ Select date & time to schedule");
    }

    await createPost({
      content,
      platform: "linkedin",
      userId,
      scheduledDate: finalStatus === "scheduled" ? selectedDate : null,
      scheduledSlot: finalStatus === "scheduled" ? selectedSlot : null,
      status: finalStatus,
    });

    setContent("");
    setSelectedDate("");
    setSelectedSlot("");
    setCurrentView("dashboard"); // Go back to dashboard
    loadPosts();
  };

  const openCreateView = (mode = "scheduled") => {
    if (!isConnected) return alert("⚠️ Please connect LinkedIn first");
    setModalMode(mode);
    setCurrentView("create");
    setSelectedPost(null);
  };

  const getCount = (status) => posts.filter((p) => p.status === status).length;
  const filteredPosts = posts.filter((p) => p.status === activeTab);
  const items = ["draft", "saved", "scheduled", "posted"];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


  // ==========================================
  // --- CALENDAR DYNAMIC LOGIC ---
  // ==========================================
  
  // 1. Get next 5 days starting from Today
  const calendarDays = [...Array(5)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    
    // Format "YYYY-MM-DD" backend se match karne ke liye
    const dateStr = [d.getFullYear(), (d.getMonth() + 1).toString().padStart(2, '0'), d.getDate().toString().padStart(2, '0')].join('-');
    
    // Format "MON 26" UI mein dikhane ke liye
    const displayStr = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }).toUpperCase();
    
    return { displayStr, dateStr };
  });

  // 2. Generate Time Slots (8 AM to 7 PM)
  const calendarTimes = [...Array(12)].map((_, i) => {
    const hour24 = i + 8; 
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 > 12 ? hour24 - 12 : hour24;
    
    const displayTime = `${hour12} ${ampm}`;
    const hourStr = hour24.toString().padStart(2, '0'); // "08", "09", "14" etc.

    return { displayTime, hourStr };
  });

  // 3. Filter only Scheduled Posts from DB
  const scheduledPosts = posts.filter(p => p.status === "scheduled");

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      {!isSidebarOpen && (
        <button onClick={toggleSidebar} style={styles.floatingToggle}>☰</button>
      )}

      {isSidebarOpen && (
        <div style={{ ...styles.leftPanel, width: sidebarWidth }}>
          <div style={styles.sidebarHeader}>
            <button onClick={toggleSidebar} style={styles.menuBtn}>☰</button>
            <h3 style={{ margin: 0, cursor: 'pointer' }} onClick={() => setCurrentView('dashboard')}>Posts</h3>
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
                background: (activeTab === item && currentView === "dashboard") ? "#0ea5e9" : "#1e293b",
                border: (activeTab === item && currentView === "dashboard") ? "1px solid #7dd3fc" : "1px solid transparent",
              }}
            >
              <span style={{fontWeight: 'bold'}}>{item.toUpperCase()}</span>
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
                      background: selectedPost?._id === p._id ? "#0ea5e9" : "#1e293b",
                      borderLeft: selectedPost?._id === p._id ? "4px solid #38bdf8" : "4px solid transparent",
                    }}
                    onClick={() => {
                      setSelectedPost(p);
                      setCurrentView("dashboard");
                    }}
                  >
                    <div style={styles.listItemContent}>
                      <p style={styles.listItemText}>{p.content.slice(0, 50)}</p>
                      <span style={styles.listItemMeta}>{p.status}</span>
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

      {/* MAIN CONTENT AREA */}
      <div style={styles.main}>
        <div style={styles.header}>
          <Logo onClick={() => setCurrentView('dashboard')} />
          <div style={styles.headerRight}>
            {isConnected && (
              <>
                <div style={styles.profileBox}>
                  <img
                    src={profilePicture || "https://via.placeholder.com/40"}
                    alt="profile"
                    style={styles.profileImg}
                  />
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <span style={{ color: "#fff", fontWeight: "bold" }}>
                      {profileName || "LinkedIn User"}
                    </span>
                    <span style={{ color: "#94a3b8", fontSize: "12px" }}>
                      {profileHeadline || "Connected to LinkedIn"}
                    </span>
                  </div>
                </div>
                <button
                  style={styles.disconnectBtn}
                  onClick={() => {
                    localStorage.removeItem("userId");
                    localStorage.removeItem("profileName");
                    localStorage.removeItem("profileHeadline");
                    localStorage.removeItem("profilePicture");
                    setIsConnected(false);
                    window.location.reload();
                  }}
                >❌ Disconnect</button>
              </>
            )}
            {currentView === "dashboard" && (
              <button
                style={styles.createBtn}
                onClick={() => openCreateView("scheduled")}
              >
                ✍️ Schedule Post
              </button>
            )}
          </div>
        </div>

        {!isConnected ? (
          <ConnectPlatforms />
        ) : (
          <div style={styles.contentArea}>
            
            {/* VIEW: DASHBOARD */}
            {currentView === "dashboard" && (
              <>
                {selectedPost ? (
                  <div style={styles.preview}>
                    <div style={styles.previewHeader}>
                      <h3>{activeTab === 'posted' ? 'Post Analytics' : 'Content View'}</h3>
                      <span style={styles.statusTag}>{selectedPost.status}</span>
                    </div>
                    
                    <p style={styles.previewText}>{selectedPost.content}</p>
                    
                    {activeTab === 'draft' && (
                      <div style={styles.previewActions}>
                        <button style={styles.actionBtn}>✏️ Continue Editing</button>
                      </div>
                    )}
                    {activeTab === 'scheduled' && (
                      <div style={styles.previewActions}>
                        <div style={styles.scheduleInfo}>📅 Scheduled for: {selectedPost.scheduledDate} at {selectedPost.scheduledSlot}</div>
                        <button style={styles.rescheduleBtn}>🔄 Reschedule</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={styles.mainPlaceholder}>
                    {activeTab === 'draft' && (
                      <>
                        <h2>Adha Adhura Kaam? 🚧</h2>
                        <p>Start a new draft right away and complete it later.</p>
                        <button style={styles.createMainBtn} onClick={() => openCreateView('draft')}>✍️ Create New Draft</button>
                      </>
                    )}
                    {activeTab === 'saved' && (
                      <>
                        <h2>Content & Templates Library 📚</h2>
                        <p>Store your brilliant ideas or templates here to use them anytime.</p>
                        <button style={styles.createMainBtn} onClick={() => openCreateView('saved')}>💡 Save New Idea</button>
                      </>
                    )}
                    {activeTab === 'scheduled' && (
                      <>
                        <h2>Future Planning ⏳</h2>
                        <p>Select a post from the queue to review or reschedule.</p>
                        <button style={styles.createMainBtn} onClick={() => openCreateView('scheduled')}>📅 Schedule New Post</button>
                      </>
                    )}
                    {activeTab === 'posted' && (
                      <>
                        <h2>History & Analytics 📈</h2>
                        <p>Select a past post to view its performance metrics and platform link.</p>
                      </>
                    )}
                  </div>
                )}
              </>
            )}

            {/* VIEW: CREATE POST (New Full Screen UI) */}
            {currentView === "create" && (
              <div style={{...styles.createPostContainer, height: '100vh'}}>
                
                {/* Left Panel: Editor */}
                <div style={{...styles.editorPanel, overflow: 'hidden'}}>
                  <div style={styles.editorHeader}>
                    <h2>Create Post</h2>
                    <button onClick={() => setCurrentView('dashboard')} style={styles.backBtn}>← Back</button>
                  </div>

                  <div style={styles.profileHeader}>
                    <img
                      src={profilePicture || 'https://via.placeholder.com/50'}
                      alt="profile"
                      style={styles.profileHeaderImg}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <strong style={{ color: '#fff' }}>{profileName || 'LinkedIn User'}</strong>
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>{profileHeadline || 'Upcoming post on your timeline'}</span>
                    </div>
                  </div>

                  <div style={styles.linkedinEditor}>
 <div style={styles.linkedinEditor}>
  <textarea
    placeholder="Start writing your post..."
    style={styles.linkedinTextarea}
    value={content}
    onChange={(e) => setContent(e.target.value)}
  />
</div>

{/* 🔥 LIVE PREVIEW */}
<div style={styles.livePreview}>
  <div style={styles.previewCard}>
    
    <div style={styles.previewTop}>
      <img
        src={profilePicture || "https://via.placeholder.com/40"}
        style={styles.previewAvatar}
      />
      <div>
        <div style={styles.previewName}>
          {profileName || "LinkedIn User"}
        </div>
        <div style={styles.previewHeadline}>
          {profileHeadline || "Your headline"} • Now
        </div>
      </div>
    </div>

    <div style={styles.previewContent}>
      {content || "Start writing to preview your post..."}
    </div>

  </div>
</div>

  
</div>

                  <div style={styles.scheduleSection}>
                    <h3>Schedule</h3>
                    <div style={styles.inputGroup}>
                      <label>Date</label>
                      <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={styles.createInput} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label>Time</label>
                      <input type="time" value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)} style={styles.createInput} />
                    </div>
                    
                    <div style={styles.actionButtonsRow}>
                      <button style={styles.btnOutline} onClick={() => setCurrentView('dashboard')}>Discard</button>
                      <button style={styles.btnOutline} onClick={() => handleSavePost('draft')}>Save Draft</button>
                      <button style={styles.btnPrimarySmall} onClick={() => handleSavePost('posted')}>Publish Now</button>
                    </div>

                    <button onClick={() => handleSavePost('scheduled')} style={styles.btnPrimaryLarge}>
                      Schedule Post
                    </button>
                  </div>
                </div>

                {/* Right Panel: Calendar Grid */}
                <div style={{...styles.calendarPanel, overflow: 'hidden'}}>
                  <div style={styles.calendarHeader}>
                    <h3 style={{ textTransform: 'uppercase' }}>
                      {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div style={styles.legendBox}>
                      <span style={styles.legendItem}><span style={{...styles.legendDot, background: '#e2e8f0'}}></span> Free</span>
                      <span style={styles.legendItem}><span style={{...styles.legendDot, background: '#7c3aed'}}></span> My Posts</span>
                      <span style={styles.legendItem}><span style={{...styles.legendDot, background: '#38bdf8'}}></span> Scheduling Here</span>
                    </div>
                  </div>

                  <div style={styles.calendarGrid}>
                    {/* Header Row (Days) */}
                    <div style={styles.gridHeaderEmpty}></div>
                    {calendarDays.map((day) => (
                      <div key={day.dateStr} style={styles.gridHeaderCell}>{day.displayStr}</div>
                    ))}

                    {/* Time Rows */}
                    {calendarTimes.map((time) => (
                      <div key={time.hourStr} style={{display: 'contents'}}>
                        
                        {/* Left Time Label */}
                        <div style={styles.timeLabel}>{time.displayTime}</div>
                        
                        {/* Day Cells for this Time */}
                        {calendarDays.map((day) => {
                          // Check if any post from backend matches this Date & Hour
                          const existingPost = scheduledPosts.find(
                            p => p.scheduledDate === day.dateStr && p.scheduledSlot?.startsWith(time.hourStr)
                          );

                          // Check if user is currently selecting this slot in the left form
                          const isCurrentlySelecting = 
                            selectedDate === day.dateStr && 
                            selectedSlot?.startsWith(time.hourStr);

                          // Determine cell styles & content
                          let cellStyle = styles.gridCell;
                          let contentText = null;

                          if (existingPost) {
                            cellStyle = { ...styles.gridCell, ...styles.cellMyPost };
                            contentText = existingPost.content.slice(0, 15) + "...";
                          } else if (isCurrentlySelecting) {
                            cellStyle = { ...styles.gridCell, ...styles.cellPreview };
                            contentText = "New Post...";
                          }

                          return (
                            <div 
                              key={`${day.dateStr}-${time.hourStr}`} 
                              style={cellStyle}
                              onClick={() => {
                                if (existingPost) {
                                  alert("⚠️ Already scheduled at this time");
                                  return;
                                }
                                // Auto-fill form on click!
                                setSelectedDate(day.dateStr);
                                setSelectedSlot(`${time.hourStr}:00`);
                              }}
                              onMouseEnter={(e) => {
                                if (!existingPost && !isCurrentlySelecting) {
                                  e.target.style.background = '#e2e8f0';
                                  e.target.style.transform = 'scale(1.02)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!existingPost && !isCurrentlySelecting) {
                                  e.target.style.background = '#f8fafc';
                                  e.target.style.transform = 'scale(1)';
                                }
                              }}
                            >
                              {contentText && <span style={styles.cellText}>{contentText}</span>}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  // BASE STYLES
  container: { display: "flex", height: "100vh", background: "#020617", color: "#fff", fontFamily: 'Inter, sans-serif' },
  logoText: { margin: 0, background: "linear-gradient(90deg, #7c3aed, #22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  // SIDEBAR & LIST
  card: { padding: "12px 15px", borderRadius: "8px", marginBottom: "10px", cursor: "pointer", display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  countBadge: { background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' },
  listContainer: { marginTop: "20px", padding: "15px", background: "rgba(30, 41, 59, 0.5)", borderRadius: "12px", border: "1px solid #334155" },
  listTitle: { margin: "0 0 12px 0", color: "#cbd5e1", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" },
  list: { display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto", maxHeight: "45vh" },
  listItem: { padding: "12px 14px", background: "#1e293b", borderRadius: "8px", cursor: "pointer", fontSize: '13px', border: '1px solid #334155', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center' },
  listItemContent: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  listItemText: { margin: 0, color: '#e2e8f0', fontSize: '13px', lineHeight: '1.4', wordBreak: 'break-word' },
  listItemMeta: { fontSize: '10px', color: '#94a3b8', textTransform: 'capitalize' },
  sidebarEmptyText: { textAlign: 'center', color: '#475569', fontSize: '12px', marginTop: '20px', fontStyle: 'italic' },
  linkedinEditor: {
  background: "#000",
  borderRadius: "12px",
  padding: "20px",
  border: "1px solid #1e293b",
},

linkedinTextarea: {
  width: "100%",
  height: "200px",
  background: "transparent",
  border: "none",
  color: "#e2e8f0",
  fontSize: "18px",
  outline: "none",
  resize: "none",
  lineHeight: "1.6",
  fontWeight: "400",
},

linkedinProfile: {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "14px",
  background: "#020617",
  borderRadius: "12px",
  border: "1px solid #1e293b",
},

/* 🔥 LIVE PREVIEW */
livePreview: {
  marginTop: "20px",
},

previewCard: {
  background: "#0a0f1c",
  border: "1px solid #1e293b",
  borderRadius: "12px",
  padding: "16px",
},

previewTop: {
  display: "flex",
  gap: "10px",
  marginBottom: "12px",
},

previewAvatar: {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
},

previewName: {
  fontWeight: "600",
  color: "#fff",
  fontSize: "14px",
},

previewHeadline: {
  fontSize: "12px",
  color: "#94a3b8",
},

previewContent: {
  marginTop: "10px",
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#e2e8f0",
  whiteSpace: "pre-wrap",
},
  // MAIN DASHBOARD AREA
  main: { flex: 1, padding: "30px", display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  header: { display: "flex", justifyContent: "space-between", alignItems: 'center', marginBottom: '30px' },
  createBtn: { background: "#22c55e", padding: "10px 20px", borderRadius: "8px", border: "none", color: "#fff", cursor: "pointer", fontWeight: 'bold', boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.39)' },
  createMainBtn: { marginTop: '20px', background: "#0ea5e9", padding: "12px 24px", borderRadius: "8px", border: "none", color: "#fff", cursor: "pointer", fontWeight: 'bold', fontSize: '16px' },
  contentArea: { flex: 1 },

  // DASHBOARD PREVIEW & PLACEHOLDERS
  preview: { background: "#1e293b", padding: "30px", borderRadius: "12px", border: '1px solid #334155', maxWidth: '700px' },
  previewHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' },
  statusTag: { background: '#0ea5e9', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', textTransform: 'capitalize', fontWeight: 'bold' },
  previewText: { fontSize: '18px', lineHeight: '1.6', color: '#e2e8f0', whiteSpace: 'pre-wrap' },
  previewActions: { marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  actionBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  scheduleInfo: { color: '#94a3b8', fontSize: '14px' },
  rescheduleBtn: { background: '#f59e0b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  mainPlaceholder: { textAlign: 'center', marginTop: '100px', color: '#64748b' },

  // ==========================================
  // CREATE POST UI STYLES
  // ==========================================
  createPostContainer: { display: 'flex', gap: '15px', height: '100%', alignItems: 'flex-start' },
  
  // LEFT PANEL (EDITOR)
  editorPanel: { flex: '0 0 65%', background: '#0f172a', padding: '25px', borderRadius: '16px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)', overflowY: 'auto' },
  editorHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' },
  textareaWrapper: { background: '#020617', borderRadius: '12px', padding: '15px', border: '1px solid #1e293b' },
  mainTextarea: { width: '100%', height: '250px', background: 'transparent', border: 'none', color: '#e2e8f0', fontSize: '15px', outline: 'none', resize: 'none', lineHeight: '1.5' },
  
  scheduleSection: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  createInput: { background: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', colorScheme: 'dark' },
  
  actionButtonsRow: { display: 'flex', gap: '10px', marginTop: '10px' },
  btnOutline: { flex: 1, background: 'transparent', border: '1px solid #334155', color: '#e2e8f0', padding: '10px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s' },
  btnPrimarySmall: { flex: 1, background: '#3b82f6', border: 'none', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer' },
  btnPrimaryLarge: { width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' },

  // RIGHT PANEL (CALENDAR)
  calendarPanel: { flex: '0 0 30%', background: '#0f172a', padding: '24px', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)', overflowY: 'auto' },
  calendarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  legendBox: { display: 'flex', gap: '18px', flexWrap: 'wrap' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#e2e8f0', fontWeight: '500' },
  legendDot: { width: '14px', height: '14px', borderRadius: '50%' },
  
  // CALENDAR GRID
  calendarGrid: { display: 'grid', gridTemplateColumns: '50px repeat(5, 1fr)', gap: '0px', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'auto', maxHeight: 'calc(100vh - 280px)' },
  gridHeaderEmpty: { background: '#0f172a', padding: '12px 8px' },
  gridHeaderCell: { background: '#0f172a', padding: '12px 8px', textAlign: 'center', fontSize: '13px', color: '#cbd5e1', fontWeight: '600', borderBottom: '1px solid #334155' },
  timeLabel: { background: '#0f172a', padding: '12px 8px', textAlign: 'right', fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderTop: '1px solid #334155', fontWeight: '500' },
  
  // DYNAMIC CELL STYLES
  gridCell: { background: '#f8fafc', minHeight: '65px', borderTop: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', padding: '6px', cursor: 'pointer', transition: 'all 0.2s ease', borderRadius: '0px' },
  cellMyPost: { background: 'linear-gradient(135deg, #7c3aed, #a855f7)', border: '1px solid #5b21b6', boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)' },
  cellPreview: { background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', border: '1px dashed #0284c7', opacity: 0.9, boxShadow: '0 2px 8px rgba(56, 189, 248, 0.3)' },
  cellText: { fontSize: '11px', color: '#fff', lineHeight: '1.3', display: 'block', wordWrap: 'break-word', fontWeight: '500' },

  // OTHERS
  leftPanel: { padding: "20px", borderRight: "1px solid #1e293b", position: "relative" },
  sidebarHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" },
  menuBtn: { background: "#7c3aed", border: "none", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", color: '#fff' },
  resizer: { position: "absolute", top: 0, right: 0, width: "5px", height: "100%", cursor: "col-resize" },
  headerRight: { display: "flex", gap: "15px", alignItems: 'center' },
  profileBox: { display: "flex", alignItems: "center", gap: "10px" },
  profileImg: { width: "35px", height: "35px", borderRadius: "50%" },
  profileHeader: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#0f172a', borderRadius: '10px', border: '1px solid #334155', marginBottom: '12px' },
  profileHeaderImg: { width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' },
  disconnectBtn: { background: "#ef4444", padding: "8px 12px", borderRadius: "8px", color: "#fff", border: "none", cursor: "pointer", fontSize: '13px' },
  floatingToggle: { position: "fixed", top: "20px", left: "20px", zIndex: 1000, background: "#7c3aed", border: "none", borderRadius: "50%", width: "48px", height: "48px", cursor: "pointer", color: '#fff' },
};

