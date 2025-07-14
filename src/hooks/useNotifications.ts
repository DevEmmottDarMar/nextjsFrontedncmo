"use client";

import { useState, useCallback, useRef } from "react";

interface Notification {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  duration?: number;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const idCounter = useRef(0);

  const addNotification = useCallback(
    (
      message: string,
      type: "success" | "info" | "warning" | "error" = "info",
      duration: number = 5000
    ) => {
      const id = `${Date.now()}-${idCounter.current++}`;
      const notification: Notification = { id, message, type, duration };

      setNotifications((prev) => [...prev, notification]);

      // Auto-remove notification after duration
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };
};
