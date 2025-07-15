import { useState, useEffect, useCallback } from "react";
import { NOTIFICATION_TYPES } from "../config/constants";

interface Notification {
  id: string;
  message: string;
  type:
    | "success"
    | "info"
    | "warning"
    | "error"
    | "trabajo_iniciado"
    | "trabajo_aprobado"
    | "trabajo_rechazado";
  user?: any;
  timestamp: number;
  trabajoId?: string;
  tecnicoId?: string;
}

export function useWebSocketNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp">) => {
      const newNotification: Notification = {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };

      setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]); // Mantener solo las últimas 5

      // Auto-remove notification after 8 seconds
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 8000);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const handleWebSocketMessage = useCallback(
    (message: any) => {
      console.log("WebSocket message received:", message);

      switch (message.type) {
        case NOTIFICATION_TYPES.TRABAJO_INICIADO:
          addNotification({
            type: "trabajo_iniciado",
            message: `Trabajo "${
              message.titulo || "Sin título"
            }" iniciado por técnico`,
            user: { nombre: message.tecnicoNombre || "Técnico" },
            trabajoId: message.trabajoId,
            tecnicoId: message.tecnicoId,
          });
          break;

        case NOTIFICATION_TYPES.TRABAJO_APROBADO:
          addNotification({
            type: "trabajo_aprobado",
            message: `Trabajo "${
              message.titulo || "Sin título"
            }" aprobado por supervisor`,
            user: { nombre: message.supervisorNombre || "Supervisor" },
            trabajoId: message.trabajoId,
          });
          break;

        case NOTIFICATION_TYPES.TRABAJO_RECHAZADO:
          addNotification({
            type: "trabajo_rechazado",
            message: `Trabajo "${
              message.titulo || "Sin título"
            }" rechazado por supervisor`,
            user: { nombre: message.supervisorNombre || "Supervisor" },
            trabajoId: message.trabajoId,
          });
          break;

        case NOTIFICATION_TYPES.PERMISO_SOLICITADO:
          addNotification({
            type: "info",
            message: `Nuevo permiso solicitado por ${
              message.tecnicoNombre || "técnico"
            }`,
            user: { nombre: message.tecnicoNombre || "Técnico" },
          });
          break;

        case NOTIFICATION_TYPES.PERMISO_APROBADO:
          addNotification({
            type: "success",
            message: `Permiso aprobado por ${
              message.supervisorNombre || "supervisor"
            }`,
            user: { nombre: message.supervisorNombre || "Supervisor" },
          });
          break;

        case NOTIFICATION_TYPES.PERMISO_RECHAZADO:
          addNotification({
            type: "warning",
            message: `Permiso rechazado por ${
              message.supervisorNombre || "supervisor"
            }`,
            user: { nombre: message.supervisorNombre || "Supervisor" },
          });
          break;

        default:
          console.log("Unknown notification type:", message.type);
      }
    },
    [addNotification]
  );

  const connectWebSocket = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token available for WebSocket connection");
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3000";
    const ws = new WebSocket(`${wsUrl}/ws?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);

      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        connectWebSocket();
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    return ws;
  }, [handleWebSocketMessage]);

  useEffect(() => {
    const ws = connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connectWebSocket]);

  return {
    notifications,
    isConnected,
    addNotification,
    removeNotification,
  };
}
