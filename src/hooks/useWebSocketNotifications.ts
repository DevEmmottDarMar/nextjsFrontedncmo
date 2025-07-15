import { useState, useEffect, useCallback, useRef } from "react";
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
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

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

      // Manejar mensajes por event (formato del backend)
      if (message.event) {
        switch (message.event) {
          case "permisoNotification":
            console.log("Notificación de permiso recibida:", message.message);
            addNotification({
              type: "info",
              message: message.message,
              user: message.permiso?.tecnico
                ? { nombre: message.permiso.tecnico.nombre }
                : undefined,
              trabajoId: message.permiso?.trabajo?.id,
              tecnicoId: message.permiso?.tecnico?.id,
            });
            break;

          case "authenticated":
            console.log("WebSocket autenticado:", message.message);
            break;

          case "authError":
            console.error("Error de autenticación WebSocket:", message.message);
            break;

          case "userConnected":
            console.log("Nuevo usuario conectado:", message.message);
            break;

          default:
            console.log("Evento no manejado:", message.event);
        }
        return; // Salir después de manejar el evento
      }

      // Manejar mensajes por type (formato anterior)
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

    // Verificar si el token es válido antes de conectar
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();

      if (currentTime > expirationTime) {
        console.log("Token expirado, no conectando WebSocket");
        return;
      }
    } catch (tokenError) {
      console.error("Token inválido, no conectando WebSocket:", tokenError);
      return;
    }

    // Cerrar conexión existente si hay una
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      const wsUrl =
        process.env.NEXT_PUBLIC_WS_URL ||
        "wss://cmobackendnest-production.up.railway.app/ws";

      console.log("Conectando WebSocket a:", wsUrl);
      const ws = new WebSocket(`${wsUrl}?token=${token}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected successfully");
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        setIsConnected(false);

        // Intentar reconectar si no fue un cierre intencional y no hemos excedido los intentos
        if (
          event.code !== 1000 &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttemptsRef.current),
            30000
          );
          console.log(
            `Reconectando en ${delay}ms (intento ${
              reconnectAttemptsRef.current + 1
            }/${maxReconnectAttempts})`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connectWebSocket();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };

      return ws;
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      setIsConnected(false);
      return null;
    }
  }, [handleWebSocketMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "Desconexión intencional");
      wsRef.current = null;
    }

    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
  }, []);

  useEffect(() => {
    const ws = connectWebSocket();

    return () => {
      disconnect();
    };
  }, [connectWebSocket, disconnect]);

  return {
    notifications,
    isConnected,
    addNotification,
    removeNotification,
  };
}
