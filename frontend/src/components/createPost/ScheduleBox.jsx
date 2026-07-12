import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ScheduleBox({
  selectedDateTime,
  setSelectedDateTime,
}) {
  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-night-700 dark:bg-night-800">
        <label className="mb-3 block text-sm font-semibold text-slate-900 dark:text-white">
          Select Date & Time
        </label>

        <div className="w-full">
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

      <style>
        {`
        .custom-calendar {
          border-radius: 16px !important;
          border: 1px solid #e5e7eb !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
          overflow: hidden;
          font-family: Inter, sans-serif;
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
          background: #d1fae5;
        }

        .custom-calendar .react-datepicker__day--selected {
          background: #059669 !important;
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
          background: #d1fae5;
        }

        .custom-calendar .react-datepicker__time-list-item--selected {
          background: #059669 !important;
          color: white;
        }

        .custom-calendar .react-datepicker__triangle {
          display: none;
        }

        .dark .custom-calendar {
          border-color: #384540 !important;
          background: #212a26;
        }

        .dark .custom-calendar .react-datepicker__header {
          background: #141b17;
          border-color: #384540;
        }

        .dark .custom-calendar .react-datepicker__current-month,
        .dark .custom-calendar .react-datepicker__day-name,
        .dark .custom-calendar .react-datepicker__day,
        .dark .custom-calendar .react-datepicker__time-list-item {
          color: #e2e8f0;
        }

        .dark .custom-calendar .react-datepicker__day:hover,
        .dark .custom-calendar .react-datepicker__time-list-item:hover {
          background: #384540;
        }

        .dark .custom-calendar .react-datepicker__time-container {
          border-color: #384540;
        }

        .dark .custom-calendar .react-datepicker__day--disabled,
        .dark .custom-calendar .react-datepicker__day--outside-month {
          color: #475569;
        }
        `}
      </style>
    </>
  );
}

function CustomInput({ value, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5
        py-3 transition-all duration-200 hover:border-brand-400 dark:border-night-700 dark:bg-night-900"
    >
      <span className={`text-sm ${value ? "text-slate-900 dark:text-slate-100" : "text-slate-400"}`}>
        {value || "Select schedule time"}
      </span>
      <span className="text-base opacity-70">📅</span>
    </div>
  );
}
