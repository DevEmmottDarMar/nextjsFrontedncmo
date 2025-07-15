"use client";

import { useState, useEffect } from "react";
import { UsersIcon, XMarkIcon } from "@heroicons/react/24/outline";

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

interface NotificationManagerProps {
  notifications: Notification[];
  onRemoveNotification: (id: string) => void;
}

export default function NotificationManager({
  notifications,
  onRemoveNotification,
}: NotificationManagerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      setIsVisible(true);
    }
  }, [notifications.length]);

  if (notifications.length === 0) return null;

  const _getNotificationStyles = (type: string) => {
    switch (type) {
      case "trabajo_iniciado":
        return "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 text-blue-800";
      case "trabajo_aprobado":
        return "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-800";
      case "trabajo_rechazado":
        return "bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-800";
      default:
        return "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-800";
    }
  };

  const _getIconStyles = (type: string) => {
    switch (type) {
      case "trabajo_iniciado":
        return "bg-blue-100";
      case "trabajo_aprobado":
        return "bg-green-100";
      case "trabajo_rechazado":
        return "bg-red-100";
      default:
        return "bg-green-100";
    }
  };

  const _getTextStyles = (type: string) => {
    switch (type) {
      case "trabajo_iniciado":
        return "text-blue-800";
      case "trabajo_aprobado":
        return "text-green-800";
      case "trabajo_rechazado":
        return "text-red-800";
      default:
        return "text-green-800";
    }
  };

  const _getPulseStyles = (type: string) => {
    switch (type) {
      case "trabajo_iniciado":
        return "bg-blue-500";
      case "trabajo_aprobado":
        return "bg-green-500";
      case "trabajo_rechazado":
        return "bg-red-500";
      default:
        return "bg-green-500";
    }
  };

  const _getNotificationIcon = (type: string) => {
    switch (type) {
      case "trabajo_iniciado":
        return <span className="text-blue-600 text-lg">🚀</span>;
      case "trabajo_aprobado":
        return <span className="text-green-600 text-lg">✅</span>;
      case "trabajo_rechazado":
        return <span className="text-red-600 text-lg">❌</span>;
      default:
        return <UsersIcon className="h-5 w-5 text-green-600" />;
    }
  };

  const _getNotificationTitle = (type: string) => {
    switch (type) {
      case "trabajo_iniciado":
        return "🚀 Trabajo Iniciado";
      case "trabajo_aprobado":
        return "✅ Trabajo Aprobado";
      case "trabajo_rechazado":
        return "❌ Trabajo Rechazado";
      default:
        return "🎉 Nuevo Técnico Conectado";
    }
  };

  const _getNotificationSubtitle = (type: string) => {
    switch (type) {
      case "trabajo_iniciado":
        return "Pendiente de aprobación";
      case "trabajo_aprobado":
        return "Trabajo autorizado";
      case "trabajo_rechazado":
        return "Trabajo rechazado";
      default:
        return "Conectado desde dispositivo móvil";
    }
  };

  const _getCloseButtonStyles = (type: string) => {
    switch (type) {
      case "trabajo_iniciado":
        return "text-blue-400 hover:text-blue-600";
      case "trabajo_aprobado":
        return "text-green-400 hover:text-green-600";
      case "trabajo_rechazado":
        return "text-red-400 hover:text-red-600";
      default:
        return "text-green-400 hover:text-green-600";
    }
  };

  const _getTimeStyles = (type: string) => {
    switch (type) {
      case "trabajo_iniciado":
        return "text-blue-500";
      case "trabajo_aprobado":
        return "text-green-500";
      case "trabajo_rechazado":
        return "text-red-500";
      default:
        return "text-green-500";
    }
  };

  return (
    <div className="fixed top-20 right-8 z-50 space-y-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`
            ${_getNotificationStyles(notif.type)}
            p-4 rounded-lg shadow-xl max-w-sm 
            transform transition-all duration-300 
            ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }
          `}
          style={{
            animation: "slideInRight 0.3s ease-out, fadeIn 0.3s ease-out",
          }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${_getIconStyles(
                  notif.type
                )}`}
              >
                {_getNotificationIcon(notif.type)}
              </div>
            </div>

            <div className="ml-3 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className={`text-sm font-semibold ${_getTextStyles(
                      notif.type
                    )}`}
                  >
                    {_getNotificationTitle(notif.type)}
                  </p>
                  <p
                    className={`text-sm mt-1 font-medium ${_getTextStyles(
                      notif.type
                    )}`}
                  >
                    {notif.user?.nombre || "Usuario"}
                  </p>
                  <p className={`text-xs mt-1 ${_getTextStyles(notif.type)}`}>
                    {notif.message}
                  </p>
                  <div
                    className={`flex items-center mt-2 text-xs ${_getTextStyles(
                      notif.type
                    )}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-2 animate-pulse ${_getPulseStyles(
                        notif.type
                      )}`}
                    ></div>
                    {_getNotificationSubtitle(notif.type)}
                  </div>
                </div>

                <button
                  onClick={() => onRemoveNotification(notif.id)}
                  className={`ml-2 flex-shrink-0 transition-colors ${_getCloseButtonStyles(
                    notif.type
                  )}`}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>

              <div className={`mt-2 text-xs ${_getTimeStyles(notif.type)}`}>
                {new Date(notif.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
