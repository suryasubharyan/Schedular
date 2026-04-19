import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ScheduleBox({
  selectedDateTime,
  setSelectedDateTime,
}) {
  return (
    <>
      <div style={styles.container}>
        <label style={styles.label}>Select Date & Time</label>

        <div style={styles.inputWrapper}>
          <DatePicker
            selected={selectedDateTime}
            onChange={(date) => setSelectedDateTime(date)}
            showTimeSelect
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="MMM d, yyyy h:mm aa"
            minDate={new Date()}
            minTime={
              selectedDateTime?.toDateString() === new Date().toDateString()
                ? new Date()
                : new Date().setHours(0, 0)
            }
            maxTime={new Date().setHours(23, 59)}
            placeholderText="Select schedule time"

            customInput={<CustomInput />}
            popperClassName="custom-popper"
            calendarClassName="custom-calendar"
          />
        </div>
      </div>

      {/* 🔥 STYLE FIX HERE */}
      <style>
        {`
        .custom-calendar {
          border-radius: 16px !important;
          border: 1px solid #e5e7eb !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
          overflow: hidden;
          font-family: sans-serif;
        }

        .custom-calendar .react-datepicker__header {
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
          padding: 12px;
        }

        .custom-calendar .react-datepicker__current-month {
          font-weight: 600;
          font-size: 14px;
        }

        .custom-calendar .react-datepicker__day-name {
          color: #6b7280;
          font-size: 12px;
        }

        .custom-calendar .react-datepicker__day {
          border-radius: 8px;
          transition: 0.2s;
        }

        .custom-calendar .react-datepicker__day:hover {
          background: #e0f2fe;
        }

        .custom-calendar .react-datepicker__day--selected {
          background: #0A66C2 !important;
          color: white;
        }

        .custom-calendar .react-datepicker__day--today {
          font-weight: bold;
        }

        .custom-calendar .react-datepicker__time-container {
          border-left: 1px solid #e5e7eb;
        }

        .custom-calendar .react-datepicker__time-list-item {
          padding: 10px;
          transition: 0.2s;
        }

        .custom-calendar .react-datepicker__time-list-item:hover {
          background: #e0f2fe;
        }

        .custom-calendar .react-datepicker__time-list-item--selected {
          background: #0A66C2 !important;
          color: white;
        }

        .custom-calendar .react-datepicker__triangle {
          display: none;
        }
        `}
      </style>
    </>
  );
}

/* CUSTOM INPUT */
function CustomInput({ value, onClick }) {
  return (
    <div style={styles.inputBox} onClick={onClick}>
      <span style={value ? styles.valueText : styles.placeholder}>
        {value || "Select schedule time"}
      </span>
      <span style={styles.icon}>📅</span>
    </div>
  );
}

const styles = {
  container: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "18px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  },

  label: {
    fontWeight: "600",
    marginBottom: "12px",
    display: "block",
    fontSize: "15px",
    color: "#111827",
  },

  inputWrapper: {
    width: "100%",
  },

  inputBox: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },

  valueText: {
    fontSize: "14px",
    color: "#111827",
  },

  placeholder: {
    fontSize: "14px",
    color: "#9ca3af",
  },

  icon: {
    fontSize: "16px",
    opacity: 0.7,
  },
};