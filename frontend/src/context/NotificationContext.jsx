import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = "info", duration = 5000) => {
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
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration = 5000) => {
    return addNotification(message, "success", duration);
  }, [addNotification]);

  const showError = useCallback((message, duration = 7000) => {
    return addNotification(message, "error", duration);
  }, [addNotification]);

  const showWarning = useCallback((message, duration = 6000) => {
    return addNotification(message, "warning", duration);
  }, [addNotification]);

  const showInfo = useCallback((message, duration = 5000) => {
    return addNotification(message, "info", duration);
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};