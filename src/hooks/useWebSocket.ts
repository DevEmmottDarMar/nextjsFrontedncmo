"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  "wss://cmobackendnest-production.up.railway.app";

export interface ConnectedUser {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  area?: {
    id: number;
    nombre: string;
  };
}

export interface WebSocketMessage {
  event?: string;
  type?: "user_connected" | "user_disconnected" | "users_list" | "error";
  data?: any;
  message?: string;
  users?: any[];
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  connectedUsers: ConnectedUser[];
  lastMessage: WebSocketMessage | null;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: any) => void;
  onUserConnected?: (callback: (user: any) => void) => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [isClient, setIsClient] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const userConnectedCallbacksRef = useRef<((user: any) => void)[]>([]);
  const lastNotificationRef = useRef<{
    userId: string;
    timestamp: number;
  } | null>(null);

  // Detectar si estamos en el cliente después del montaje
  useEffect(() => {
    setIsClient(true);
  }, []);

  const showNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (
        isClient &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification(title, options);
      } else if (
        isClient &&
        "Notification" in window &&
        Notification.permission === "default"
      ) {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(title, options);
          }
        });
      }
    },
    [isClient]
  );

  const connect = useCallback(() => {
    if (!isClient) return;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket ya está conectado");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No hay token disponible para conectar WebSocket");
      return;
    }

    try {
      console.log("Conectando WebSocket...");
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket conectado exitosamente");
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;

        // Enviar token para autenticación
        if (token) {
          const authMessage = JSON.stringify({ token });
          ws.send(authMessage);
          console.log("Token enviado para autenticación");
        }
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log("🔔 Mensaje WebSocket recibido:", message);
          setLastMessage(message);

          // Manejar mensajes por event (formato del backend)
          if (message.event) {
            switch (message.event) {
              case "connectedUsers":
                if (message.users && Array.isArray(message.users)) {
                  console.log(
                    "👥 Actualizando lista de usuarios conectados:",
                    message.users
                  );
                  // Eliminar duplicados basándose en el ID del usuario
                  const uniqueUsers = message.users.filter(
                    (user, index, self) =>
                      index === self.findIndex((u) => u.id === user.id)
                  );
                  console.log("✅ Usuarios únicos:", uniqueUsers);
                  setConnectedUsers(uniqueUsers);
                }
                break;

              case "authenticated":
                console.log("WebSocket autenticado:", message.message);
                break;

              case "authError":
                console.error(
                  "Error de autenticación WebSocket:",
                  message.message
                );
                break;

              case "permisoNotification":
                console.log("Notificación de permiso:", message.message);
                break;

              case "userConnected":
                console.log("Nuevo usuario conectado:", message.message);

                // Prevenir notificaciones duplicadas del mismo usuario
                const now = Date.now();
                const userId = message.user?.id;
                const lastNotification = lastNotificationRef.current;

                if (
                  userId &&
                  lastNotification &&
                  lastNotification.userId === userId &&
                  now - lastNotification.timestamp < 5000
                ) {
                  console.log(
                    "Notificación duplicada ignorada para usuario:",
                    userId
                  );
                  break;
                }

                // Actualizar referencia de última notificación
                if (userId) {
                  lastNotificationRef.current = { userId, timestamp: now };
                }

                // Mostrar notificación nativa
                showNotification("Nuevo Usuario Conectado", {
                  body: message.message,
                  icon: "/favicon.ico",
                  tag: "user_connected",
                });
                // Ejecutar callbacks registrados
                if (message.user) {
                  userConnectedCallbacksRef.current.forEach((callback) =>
                    callback(message.user)
                  );
                }
                break;

              default:
                console.log("Evento no manejado:", message.event);
            }
          }
          // Manejar mensajes por type (formato anterior)
          else if (message.type) {
            switch (message.type) {
              case "user_connected":
                if (message.data) {
                  setConnectedUsers((prev) => {
                    const userExists = prev.find(
                      (u) => u.id === message.data.id
                    );
                    if (!userExists) {
                      showNotification("Nuevo usuario conectado", {
                        body: `${message.data.nombre} (${message.data.rol}) se ha conectado`,
                        icon: "/favicon.ico",
                        tag: "user_connected",
                      });
                      return [...prev, message.data];
                    }
                    return prev;
                  });
                }
                break;

              case "user_disconnected":
                if (message.data) {
                  setConnectedUsers((prev) =>
                    prev.filter((u) => u.id !== message.data.id)
                  );
                }
                break;

              case "users_list":
                if (message.data && Array.isArray(message.data)) {
                  // Eliminar duplicados basándose en el ID del usuario
                  const uniqueUsers = message.data.filter(
                    (user, index, self) =>
                      index === self.findIndex((u) => u.id === user.id)
                  );
                  setConnectedUsers(uniqueUsers);
                }
                break;

              case "error":
                console.error("Error en WebSocket:", message.message);
                break;

              default:
                console.log("Tipo de mensaje no manejado:", message.type);
            }
          }
        } catch (error) {
          console.error("Error al parsear mensaje WebSocket:", error);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket desconectado:", event.code, event.reason);
        setIsConnected(false);

        // Intentar reconectar si no fue un cierre intencional
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
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error("Error en WebSocket:", error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error("Error al crear WebSocket:", error);
      setIsConnected(false);
    }
  }, [isClient, showNotification]);

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

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket no está conectado");
    }
  }, []);

  // Conectar automáticamente cuando el hook se monta y estamos en el cliente
  useEffect(() => {
    if (isClient) {
      connect();
    }

    // Limpiar al desmontar
    return () => {
      disconnect();
    };
  }, [isClient, connect, disconnect]);

  // Solicitar permisos de notificación al montar
  useEffect(() => {
    if (
      isClient &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, [isClient]);

  const onUserConnected = useCallback((callback: (user: any) => void) => {
    userConnectedCallbacksRef.current.push(callback);
  }, []);

  return {
    isConnected,
    connectedUsers,
    lastMessage,
    connect,
    disconnect,
    sendMessage,
    onUserConnected,
  };
};
