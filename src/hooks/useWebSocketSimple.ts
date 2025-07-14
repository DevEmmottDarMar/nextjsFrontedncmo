"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const WS_URL = "wss://cmobackendnest-production.up.railway.app";

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

export const useWebSocketSimple = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const userConnectedCallbacksRef = useRef<((user: any) => void)[]>([]);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === "undefined") return;

    console.log("🔌 Iniciando conexión WebSocket simple...");

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket conectado");
      setIsConnected(true);

      // Enviar token si está disponible
      const token = localStorage.getItem("token");
      if (token) {
        console.log("🔐 Enviando token...");
        ws.send(JSON.stringify({ token }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("📨 Mensaje recibido:", message);
        setLastMessage(message);

        if (message.event === "connectedUsers" && message.users) {
          console.log("👥 Actualizando usuarios:", message.users);
          setConnectedUsers(message.users);
        } else if (message.event === "userConnected" && message.user) {
          console.log("🆕 Nuevo usuario conectado:", message.user);
          
          // Mostrar notificación nativa del navegador
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Nuevo Técnico Conectado", {
              body: `${message.user.nombre} se ha conectado desde dispositivo móvil`,
              icon: "/favicon.ico",
              tag: "user_connected",
              requireInteraction: false,
            });
          }
          
          // Ejecutar callbacks registrados
          userConnectedCallbacksRef.current.forEach((callback) =>
            callback(message.user)
          );
        }
      } catch (e) {
        console.error("❌ Error parseando mensaje:", e);
      }
    };

    ws.onclose = () => {
      console.log("🔌 WebSocket desconectado");
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("❌ Error WebSocket:", error);
      setIsConnected(false);
    };

    // Cleanup
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // Solicitar permisos de notificación
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const onUserConnected = useCallback((callback: (user: any) => void) => {
    userConnectedCallbacksRef.current.push(callback);
  }, []);

  return {
    isConnected,
    connectedUsers,
    lastMessage,
    onUserConnected,
  };
};
