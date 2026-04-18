import { useEffect } from "react";
import PostEditor from "./PostEditor";
import PostPreview from "./PostPreview";
import ScheduleBox from "./ScheduleBox";

export default function CreatePostLayout({
  content,
  setContent,
  imageUrls,
  setImageUrls,
  profile,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  onSave,
  onBack,
  activeTab,
  selectedPost,
}) {
  const isDraft = activeTab === "draft";
  const isSaved = activeTab === "saved";
  const isScheduled = activeTab === "scheduled";
  const isPosted = activeTab === "posted";

  useEffect(() => {
    if (selectedPost?._id) {
      setContent(selectedPost.content || "");
      setImageUrls(Array.isArray(selectedPost.imageUrls)
        ? selectedPost.imageUrls
        : selectedPost.imageUrl
        ? [selectedPost.imageUrl]
        : []);
      setSelectedDate(selectedPost.scheduledDate || "");
      setSelectedTime(selectedPost.scheduledSlot || "");
    }
  }, [selectedPost?._id, selectedPost?.imageUrls, selectedPost?.imageUrl, setContent, setImageUrls, setSelectedDate, setSelectedTime]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.left}>
        <button onClick={onBack} style={styles.backBtn}>
          Back
        </button>

        {(isDraft || isSaved || isScheduled) && (
          <PostEditor
            content={content}
            setContent={setContent}
            imageUrls={imageUrls}
            setImageUrls={setImageUrls}
            profile={profile}
          />
        )}

        {isPosted && <PostPreview post={selectedPost} profile={profile} />}
      </div>

      <div style={styles.right}>
        {(isDraft || isSaved) && (
          <>
            <ScheduleBox
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              onSchedule={() => onSave("scheduled")}
              existingSlot={selectedPost?.scheduledSlot}
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

              {isSaved && (
                <button
                  style={styles.secondaryBtn}
                  onClick={() => onSave("saved")}
                >
                  Update Saved
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
                onClick={() => onSave("scheduled")}
              >
                Schedule
              </button>
            </div>
          </>
        )}

        {isScheduled && (
          <>
            <div style={styles.infoBox}>
              {selectedPost?.scheduledDate || "Not set"} at{" "}
              {selectedPost?.scheduledSlot || "Not set"}
            </div>

            <ScheduleBox
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              onSchedule={() => onSave("scheduled")}
              existingSlot={selectedPost?.scheduledSlot}
            />

            <div style={styles.actions}>
              <button
                style={styles.secondaryBtn}
                onClick={() => onSave("scheduled")}
              >
                Reschedule
              </button>

              <button
                style={styles.dangerBtn}
                onClick={() => onSave("deleted")}
              >
                Cancel
              </button>

              <button
                style={styles.primaryBtn}
                onClick={() => onSave("posted")}
              >
                Post Now
              </button>
            </div>
          </>
        )}

        {isPosted && (
          selectedPost?.linkedInUrl ? (
            <button
              type="button"
              onClick={() => window.open(selectedPost.linkedInUrl, "_blank")}
              style={{
                ...styles.primaryBtn,
                textDecoration: "none",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              View on LinkedIn
            </button>
          ) : (
            <button style={{ ...styles.primaryBtn, opacity: 0.75, cursor: "default" }} disabled>
              Posted on LinkedIn
            </button>
          )
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    gap: "20px",
    background: "#f3f2ef",
    padding: "20px",
    minHeight: "90vh",
    boxSizing: "border-box",
  },
  left: {
    flex: 2,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  right: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "48px 0px",
    gap: "15px",
  },
  backBtn: {
    background: "#fff",
    border: "1px solid #d1d5db",
    padding: "8px 14px",
    borderRadius: "20px",
    cursor: "pointer",
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    background: "#0a66c2",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "20px",
    fontWeight: "600",
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "#e5e7eb",
    color: "#111",
    border: "none",
    padding: "10px 16px",
    borderRadius: "20px",
  },
  dangerBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "20px",
  },
  infoBox: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },
};
