"use client";

import { UsersIcon } from "@heroicons/react/24/outline";

interface Notification {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  user?: any;
  timestamp: number;
}

interface ActiveNotificationsProps {
  notifications: Notification[];
}

export default function ActiveNotifications({ notifications }: ActiveNotificationsProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg shadow-xl border border-green-400">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <UsersIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">
              {notifications.length} técnico{notifications.length !== 1 ? "s" : ""} conectado{notifications.length !== 1 ? "s" : ""} recientemente
            </p>
            <p className="text-xs text-green-100">
              Último: {notifications[notifications.length - 1]?.user?.nombre || "Usuario"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 