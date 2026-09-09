import { useState, useCallback, useMemo } from "react";
import NotificationContext from "./notification-context";

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const addNotification = useCallback(
    (message, type = "info", duration = 5000) => {
      const id = Date.now() + Math.random();
      const notification = {
        id,
        message,
        type, // "success", "error", "warning", "info"
        duration,
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    [removeNotification]
  );

  const showSuccess = useCallback(
    (message, duration = 5000) => addNotification(message, "success", duration),
    [addNotification]
  );

  const showError = useCallback(
    (message, duration = 7000) => addNotification(message, "error", duration),
    [addNotification]
  );

  const showWarning = useCallback(
    (message, duration = 6000) => addNotification(message, "warning", duration),
    [addNotification]
  );

  const showInfo = useCallback(
    (message, duration = 5000) => addNotification(message, "info", duration),
    [addNotification]
  );

  const value = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo,
    }),
    [notifications, addNotification, removeNotification, showSuccess, showError, showWarning, showInfo]
  );

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
};
