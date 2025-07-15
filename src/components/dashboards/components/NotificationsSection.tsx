"use client";

import { BellIcon, UsersIcon } from "@heroicons/react/24/outline";

interface NotificationsSectionProps {
  notificationHistory: any[];
}

export default function NotificationsSection({
  notificationHistory,
}: NotificationsSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Historial de Notificaciones
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">
            {notificationHistory.length} notificación
            {notificationHistory.length !== 1 ? "es" : ""}
          </span>
        </div>
      </div>

      {notificationHistory.length === 0 ? (
        <div className="text-center py-8">
          <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No hay notificaciones en el historial
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Las notificaciones aparecerán aquí cuando los técnicos se conecten
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notificationHistory.map((notif) => (
            <div
              key={notif.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <UsersIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        🎉 Nuevo Técnico Conectado
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {notif.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 font-medium">
                      {notif.user?.nombre || "Usuario"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {notif.message}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Conectado desde dispositivo móvil
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notif.timestamp).toLocaleString("es-ES")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Técnico
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
