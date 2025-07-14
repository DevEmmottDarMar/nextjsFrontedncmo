"use client";

import { useWebSocketSimple } from "@/hooks/useWebSocketSimple";

export default function WebSocketDebug() {
  const { isConnected, connectedUsers, lastMessage } = useWebSocketSimple();

  // Debug logs
  console.log("🔍 WebSocketDebug - isConnected:", isConnected);
  console.log("🔍 WebSocketDebug - connectedUsers:", connectedUsers);
  console.log("🔍 WebSocketDebug - lastMessage:", lastMessage);

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-3 rounded-lg max-w-sm z-50 text-xs">
      <h3 className="font-bold mb-2">🔍 WebSocket Debug</h3>

      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span>{isConnected ? "Conectado" : "Desconectado"}</span>
        </div>

        <div>Usuarios: {connectedUsers?.length || 0}</div>

        {connectedUsers && connectedUsers.length > 0 && (
          <div>
            <div className="font-semibold">Lista:</div>
            {connectedUsers.map((user, index) => (
              <div key={index} className="ml-2">
                • {user.nombre} ({user.rol})
              </div>
            ))}
          </div>
        )}

        {lastMessage && (
          <div>
            <div className="font-semibold">Último:</div>
            <div className="ml-2 text-xs text-gray-300">
              {lastMessage.event || lastMessage.type || "Sin evento"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
