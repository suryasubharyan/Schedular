import { useEffect } from "react";
import { useNotification } from "../context/NotificationContext";

const NotificationItem = ({ notification, onRemove }) => {
  const { removeNotification } = useNotification();

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

  const getStyles = (type) => {
    const baseStyles = {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "16px 20px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      border: "1px solid",
      marginBottom: "12px",
      minWidth: "320px",
      maxWidth: "500px",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontSize: "14px",
      lineHeight: "1.4",
      cursor: "pointer",
      transition: "all 0.2s ease",
      position: "relative",
      overflow: "hidden",
    };

    switch (type) {
      case "success":
        return {
          ...baseStyles,
          background: "#f0fdf4",
          borderColor: "#bbf7d0",
          color: "#166534",
        };
      case "error":
        return {
          ...baseStyles,
          background: "#fef2f2",
          borderColor: "#fecaca",
          color: "#991b1b",
        };
      case "warning":
        return {
          ...baseStyles,
          background: "#fffbeb",
          borderColor: "#fde68a",
          color: "#92400e",
        };
      case "info":
      default:
        return {
          ...baseStyles,
          background: "#eff6ff",
          borderColor: "#bfdbfe",
          color: "#1e40af",
        };
    }
  };

  const iconStyles = {
    fontSize: "18px",
    fontWeight: "bold",
    flexShrink: 0,
  };

  const closeButtonStyles = {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "inherit",
    opacity: 0.7,
    padding: "0",
    marginLeft: "auto",
    flexShrink: 0,
  };

  return (
    <div
      style={getStyles(notification.type)}
      onClick={() => onRemove(notification.id)}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
      }}
    >
      <span style={iconStyles}>{getIcon(notification.type)}</span>
      <span style={{ flex: 1 }}>{notification.message}</span>
      <button
        style={closeButtonStyles}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(notification.id);
        }}
        onMouseEnter={(e) => (e.target.style.opacity = 1)}
        onMouseLeave={(e) => (e.target.style.opacity = 0.7)}
      >
        ×
      </button>

      {/* Progress bar for timer */}
      {notification.duration > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: "3px",
            background: "currentColor",
            opacity: 0.3,
            animation: `shrink ${notification.duration}ms linear forwards`,
          }}
        />
      )}
    </div>
  );
};

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div style={{ pointerEvents: "auto" }}>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}
      </style>
    </div>
  );
};

export default NotificationContainer;