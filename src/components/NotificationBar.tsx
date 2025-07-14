"use client";

import { useState, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";

interface NotificationBarProps {
  onUserConnected?: (callback: (user: any) => void) => void;
}

export default function NotificationBar({
  onUserConnected,
}: NotificationBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const { addNotification } = useNotifications();

  // Configurar notificaciones para usuarios conectados
  useEffect(() => {
    if (onUserConnected) {
      onUserConnected((user) => {
        const notification = {
          id: Date.now().toString(),
          message: `${user.nombre} se ha conectado como ${user.rol}`,
          user: user,
          timestamp: new Date(),
          type: "user_connected",
        };

        setRecentNotifications((prev) => [notification, ...prev.slice(0, 9)]); // Mantener solo las últimas 10
        setNotificationCount((prev) => prev + 1);

        // Mostrar notificación toast también
        addNotification(notification.message, "info", 4000);
      });
    }
  }, [onUserConnected, addNotification]);

  const openModal = () => {
    setIsModalOpen(true);
    setNotificationCount(0); // Resetear contador al abrir
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const clearNotifications = () => {
    setRecentNotifications([]);
    setNotificationCount(0);
  };

  return (
    <>
      {/* Barra Superior */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 shadow-sm z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Dashboard CMO
            </h1>
            <div className="text-sm text-gray-500">
              Sistema de Control de Mantenimiento y Operaciones
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Ícono de Notificaciones */}
            <div className="relative">
              <button
                onClick={openModal}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v3.75l1.5 1.5H3l1.5-1.5V9.75a6 6 0 0 1 6-6z"
                  />
                </svg>

                {/* Badge de notificaciones */}
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* Estado de conexión */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">En línea</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Notificaciones */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end p-4">
          <div className="bg-white rounded-lg shadow-xl w-96 max-h-96 overflow-hidden">
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Notificaciones
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearNotifications}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Limpiar
                </button>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="max-h-80 overflow-y-auto">
              {recentNotifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v3.75l1.5 1.5H3l1.5-1.5V9.75a6 6 0 0 1 6-6z"
                    />
                  </svg>
                  <p>No hay notificaciones</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {recentNotifications.map((notification) => (
                    <div key={notification.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.user?.nombre || "Usuario"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
