import { useEffect, useState } from "react";
import { getAvailabilityAPI } from "../../api/availability.api";

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
];

export default function ScheduleBox({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  onSchedule,
  existingSlot,
}) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate) {
      setBookedSlots([]);
      return;
    }

    setLoading(true);

    getAvailabilityAPI(selectedDate)
      .then((res) => {
        setBookedSlots(res.data.bookedSlots || []);
      })
      .catch(() => {
        setBookedSlots([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedDate, existingSlot]);

  return (
    <div style={styles.container}>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => {
          setSelectedDate(e.target.value);
          setSelectedTime(null);
        }}
        style={styles.dateInput}
      />

      <div style={styles.grid}>
        {timeSlots.map((slot) => {
          const isExisting = existingSlot === slot;
          const isBooked = bookedSlots.includes(slot) && !isExisting;
          const isSelected = selectedTime === slot;

          return (
            <div
              key={slot}
              onClick={() => !isBooked && setSelectedTime(slot)}
              style={{
                ...styles.slot,
                background: isBooked
                  ? "#fee2e2"
                  : isSelected
                  ? "#0A66C2"
                  : isExisting
                  ? "#ede9fe"
                  : "#e7f3ff",
                color: isBooked
                  ? "#b91c1c"
                  : isSelected
                  ? "#fff"
                  : isExisting
                  ? "#6d28d9"
                  : "#0A66C2",
                border: isSelected
                  ? "2px solid #0A66C2"
                  : isExisting
                  ? "2px dashed #6d28d9"
                  : "1px solid #d1d5db",
                cursor: isBooked ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {slot}

              {isBooked && <div style={styles.bookedTag}>Booked</div>}

              {isExisting && !isSelected && !isBooked && (
                <div style={{ ...styles.bookedTag, color: "#6d28d9" }}>
                  Scheduled
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        style={styles.scheduleBtn}
        onClick={onSchedule}
        disabled={!selectedDate || !selectedTime}
      >
        {loading ? "Loading..." : "Schedule Post"}
      </button>
    </div>
  );
}

const styles = {
  container: {
    background: "#fff",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  dateInput: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    marginBottom: "15px",
  },
  slot: {
    padding: "10px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "13px",
    fontWeight: "500",
    position: "relative",
    transition: "0.2s",
  },
  bookedTag: {
    fontSize: "10px",
    position: "absolute",
    bottom: "2px",
    right: "5px",
  },
  scheduleBtn: {
    width: "100%",
    background: "#0A66C2",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "25px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
