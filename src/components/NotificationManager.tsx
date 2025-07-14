"use client";

import { useState, useEffect } from "react";
import { UsersIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface Notification {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  user?: any;
  timestamp: number;
}

interface NotificationManagerProps {
  notifications: Notification[];
  onRemoveNotification: (id: string) => void;
}

export default function NotificationManager({ 
  notifications, 
  onRemoveNotification 
}: NotificationManagerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      setIsVisible(true);
    }
  }, [notifications.length]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-8 z-50 space-y-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`
            bg-gradient-to-r from-green-50 to-emerald-50 
            border-l-4 border-green-500 text-green-800 
            p-4 rounded-lg shadow-xl max-w-sm 
            transform transition-all duration-300 
            ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
          `}
          style={{
            animation: 'slideInRight 0.3s ease-out, fadeIn 0.3s ease-out'
          }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
            
            <div className="ml-3 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    🎉 Nuevo Técnico Conectado
                  </p>
                  <p className="text-sm text-green-700 mt-1 font-medium">
                    {notif.user?.nombre || 'Usuario'}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {notif.message}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Conectado desde dispositivo móvil
                  </div>
                </div>
                
                <button
                  onClick={() => onRemoveNotification(notif.id)}
                  className="ml-2 flex-shrink-0 text-green-400 hover:text-green-600 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
              
              <div className="mt-2 text-xs text-green-500">
                {new Date(notif.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 