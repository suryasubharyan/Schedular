import { useEffect } from "react";
import { useNotification } from "../context/NotificationContext";

const TYPE_STYLES = {
  success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/60 dark:border-green-900 dark:text-green-300",
  error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/60 dark:border-red-900 dark:text-red-300",
  warning: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/60 dark:border-amber-900 dark:text-amber-300",
  info: "bg-brand-50 border-brand-200 text-brand-800 dark:bg-brand-950/60 dark:border-brand-900 dark:text-brand-300",
};

const NotificationItem = ({ notification, onRemove }) => {
  useEffect(() => {
    if (notification.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification, onRemove]);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
      default:
        return "ℹ";
    }
  };

  return (
    <div
      onClick={() => onRemove(notification.id)}
      className={`relative mb-3 flex min-w-80 max-w-125 cursor-pointer items-center gap-3 overflow-hidden rounded-xl
        border px-5 py-4 text-sm leading-tight shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl
        ${TYPE_STYLES[notification.type] || TYPE_STYLES.info}`}
    >
      <span className="shrink-0 text-lg font-bold">{getIcon(notification.type)}</span>
      <span className="flex-1">{notification.message}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(notification.id);
        }}
        className="ml-auto shrink-0 border-none bg-transparent p-0 text-xl text-current opacity-70 transition-opacity duration-150 hover:opacity-100"
      >
        ×
      </button>

      {notification.duration > 0 && (
        <div
          className="animate-shrink absolute bottom-0 left-0 h-0.75 bg-current opacity-30"
          style={{ animationDuration: `${notification.duration}ms` }}
        />
      )}
    </div>
  );
};

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-9999">
      <div className="pointer-events-auto">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationContainer;
