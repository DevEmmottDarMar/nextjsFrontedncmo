"use client";

import { useState, useEffect, useCallback } from "react";
import { useWebSocket } from "./useWebSocket";

interface PermisoNotification {
  id: string;
  message: string;
  permiso: any;
  type: "nuevo" | "actualizado";
  timestamp: number;
}

export const usePermisoNotifications = () => {
  const [permisoNotifications, setPermisoNotifications] = useState<
    PermisoNotification[]
  >([]);
  const { lastMessage } = useWebSocket();

  const addPermisoNotification = useCallback(
    (notification: PermisoNotification) => {
      setPermisoNotifications((prev) => [notification, ...prev]);

      // Auto-remove after 10 seconds
      setTimeout(() => {
        setPermisoNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }, 10000);
    },
    []
  );

  const removePermisoNotification = useCallback((id: string) => {
    setPermisoNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const clearAllPermisoNotifications = useCallback(() => {
    setPermisoNotifications([]);
  }, []);

  // Escuchar mensajes de WebSocket para notificaciones de permisos
  useEffect(() => {
    if (lastMessage?.event === "permisoNotification") {
      const notification: PermisoNotification = {
        id: `${Date.now()}-${Math.random()}`,
        message: lastMessage.message || "Nueva notificación de permiso",
        permiso: lastMessage.permiso,
        type: lastMessage.type || "nuevo",
        timestamp: Date.now(),
      };

      addPermisoNotification(notification);

      // Mostrar notificación nativa del navegador
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Permiso de Trabajo", {
          body: notification.message,
          icon: "/favicon.ico",
          tag: "permiso_notification",
          requireInteraction: false,
        });
      }
    }
  }, [lastMessage, addPermisoNotification]);

  return {
    permisoNotifications,
    addPermisoNotification,
    removePermisoNotification,
    clearAllPermisoNotifications,
  };
};
