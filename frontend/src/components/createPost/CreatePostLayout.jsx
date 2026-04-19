import { useEffect, useState } from "react";
import PostEditor from "./PostEditor";
import PostPreview from "./PostPreview";
import ScheduleBox from "./ScheduleBox"; // 🔥 NEW

export default function CreatePostLayout({
  content, setContent,
  imageUrls, setImageUrls,
  profile,
  onSave, onBack,
  activeTab,
  selectedPost,
  selectedDateTime, setSelectedDateTime, // 🔥 NEW
}) {
  const [showReschedule, setShowReschedule] = useState(false);
  

  const isDraft = activeTab === "draft";
  const isSaved = activeTab === "saved";
  const isScheduled = activeTab === "scheduled";
  const isPosted = activeTab === "posted";

  useEffect(() => {
    if (selectedPost?._id) {
      setContent(selectedPost.content || "");
      setImageUrls(selectedPost.imageUrls || []);

      // 🔥 scheduled case
      if (selectedPost.scheduledDate && selectedPost.scheduledSlot) {
        const combined = new Date(
          `${selectedPost.scheduledDate}T${selectedPost.scheduledSlot}`
        );
        if (!isNaN(combined)) setSelectedDateTime(combined);
      }
    }
  }, [selectedPost?._id]);

  // 🔥 MAIN SCHEDULE FUNCTION
  const handleSchedule = () => {
    if (!selectedDateTime) return;

    const date = selectedDateTime.toLocaleDateString("en-CA"); // ✅ YYYY-MM-DD
  const time = selectedDateTime.toTimeString().slice(0, 5);

    onSave("scheduled", {
      scheduledDate: date,
      scheduledSlot: time,
    });
  };

  return (
    <div style={styles.wrapper}>
      
      {/* LEFT */}
      <div style={styles.left}>
        <button onClick={onBack} style={styles.backBtn}>← Back</button>

        {(isDraft || isSaved || isScheduled) && (
          <PostEditor
            {...{ content, setContent, imageUrls, setImageUrls, profile }}
          />
        )}

        {isPosted && (
          <PostPreview post={selectedPost} profile={profile} />
        )}
      </div>

      {/* RIGHT */}
      <div style={styles.right}>

        {/* 📝 DRAFT / SAVED */}
        {(isDraft || isSaved) && (
          <>
            <ScheduleBox
              selectedDateTime={selectedDateTime}
              setSelectedDateTime={setSelectedDateTime}
            />

            <div style={styles.actions}>
              {isDraft && (
                <button
                  style={styles.secondaryBtn}
                  onClick={() => onSave("draft")}
                >
                  Save Draft
                </button>
              )}

              <button
                style={styles.primaryBtn}
                onClick={() => onSave("posted")}
              >
                Post Now
              </button>

              <button
                style={styles.primaryBtn}
                onClick={handleSchedule}
                disabled={!selectedDateTime}
              >
                Schedule
              </button>
            </div>
          </>
        )}

        {/* ⏰ SCHEDULED */}
        {isScheduled && (
          <>
            <div style={styles.infoBox}>
              Scheduled on{" "}
              <strong>
                {selectedPost?.scheduledDate} at {selectedPost?.scheduledSlot}
              </strong>
            </div>

            {!showReschedule && (
              <div style={styles.actions}>
                <button
                  style={styles.secondaryBtn}
                  onClick={() => setShowReschedule(true)}
                >
                  Reschedule
                </button>

                <button
                  style={styles.dangerBtn}
                  onClick={() => onSave("draft")}
                >
                  Cancel
                </button>
              </div>
            )}

            {showReschedule && (
              <>
                <ScheduleBox
                  selectedDateTime={selectedDateTime}
                  setSelectedDateTime={setSelectedDateTime}
                />

                <button
                  style={styles.primaryBtn}
                  onClick={handleSchedule}
                >
                  Confirm Reschedule
                </button>
              </>
            )}
          </>
        )}

        {/* 🚀 POSTED */}
        {isPosted && (
          <button
            style={styles.primaryBtn}
            onClick={() => window.open(selectedPost?.linkedInUrl)}
          >
            View on LinkedIn
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
wrapper: {
  display: "flex",
  gap: "24px",
  padding: "24px",
  height: "100vh",              // 🔥 full screen height
  boxSizing: "border-box",
},

left: {
  flex: 3,                     // 🔥 more space
  display: "flex",
  flexDirection: "column",
},

right: {
  flex: 1.2,
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  minWidth: "320px",
},

  backBtn: {
    marginBottom: "10px",
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    cursor: "pointer",
  },

  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  primaryBtn: {
    background: "#0A66C2",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  secondaryBtn: {
    background: "#f1f5f9",
    border: "1px solid #d1d5db",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  dangerBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  infoBox: {
    background: "#f0f9ff",
    border: "1px solid #bae6fd",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "14px",
  },
};