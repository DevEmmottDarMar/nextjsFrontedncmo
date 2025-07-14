"use client";

import { useWebSocket } from "@/hooks/useWebSocket";

export default function WebSocketStatus() {
  const { isConnected, connectedUsers, connect, disconnect } = useWebSocket();

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Estado de Conexión en Tiempo Real
        </h3>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span
            className={`text-sm font-medium ${
              isConnected ? "text-green-600" : "text-red-600"
            }`}
          >
            {isConnected ? "Conectado" : "Desconectado"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{connectedUsers.length}</span> usuarios
          conectados
        </div>
        <div className="flex space-x-2">
          <button
            onClick={connect}
            disabled={isConnected}
            className={`px-3 py-1 text-xs font-medium rounded ${
              isConnected
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Conectar
          </button>
          <button
            onClick={disconnect}
            disabled={!isConnected}
            className={`px-3 py-1 text-xs font-medium rounded ${
              !isConnected
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            Desconectar
          </button>
        </div>
      </div>

      {connectedUsers.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Usuarios Conectados:
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {connectedUsers.map((user) => (
              <div
                key={user.userId || user.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">
                    {user.nombre ||
                      user.email ||
                      `Usuario ${user.userId || user.id}`}
                  </span>
                  <span className="text-gray-500">({user.rol})</span>
                </div>
                {user.area && (
                  <span className="text-xs text-gray-400">
                    {user.area.nombre}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
