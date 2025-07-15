"use client";

import { useState, useEffect } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";

interface Notification {
  id: string;
  type: 'user_connected' | 'permiso_notification' | 'general';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationCountChange?: (count: number) => void;
}

export default function NotificationDropdown({ isOpen, onClose, onNotificationCountChange }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { lastMessage, connectedUsers } = useWebSocket();

  // Agregar notificaciones basadas en mensajes de WebSocket
  useEffect(() => {
    if (lastMessage) {
      let newNotification: Notification | null = null;

      switch (lastMessage.event) {
        case 'userConnected':
          if (lastMessage.user) {
            newNotification = {
              id: `user_connected_${Date.now()}`,
              type: 'user_connected',
              title: 'Usuario Conectado',
              message: `${lastMessage.user.nombre} (${lastMessage.user.rol}) se ha conectado`,
              timestamp: new Date(),
              read: false
            };
          }
          break;

        case 'permisoNotification':
          newNotification = {
            id: `permiso_${Date.now()}`,
            type: 'permiso_notification',
            title: 'Nuevo Permiso',
            message: lastMessage.message || 'Nuevo permiso solicitado',
            timestamp: new Date(),
            read: false
          };
          break;

        default:
          // Otros tipos de notificaciones
          break;
      }

      if (newNotification) {
        setNotifications(prev => [newNotification!, ...prev.slice(0, 9)]); // Mantener solo las últimas 10
      }
    }
  }, [lastMessage]);

  // Agregar algunas notificaciones de ejemplo al inicio
  useEffect(() => {
    const exampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'permiso_notification',
        title: 'Nuevo permiso solicitado',
        message: 'Juan Pérez solicita permiso para trabajo en altura',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
        read: false
      },
      {
        id: '2',
        type: 'user_connected',
        title: 'Usuario conectado',
        message: 'María García (supervisora) se ha conectado',
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutos atrás
        read: false
      },
      {
        id: '3',
        type: 'general',
        title: 'Trabajo completado',
        message: 'Carlos López completó el trabajo #MT-001',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hora atrás
        read: true
      }
    ];

    setNotifications(exampleNotifications);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'user_connected':
        return (
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'permiso_notification':
        return (
          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Comunicar el número de notificaciones no leídas al componente padre
  useEffect(() => {
    if (onNotificationCountChange) {
      onNotificationCountChange(unreadCount);
    }
  }, [unreadCount, onNotificationCountChange]);

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Notificaciones</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-gray-500">{unreadCount} sin leer</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-64 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <svg className="h-8 w-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.07 2.82l3.12 3.12M7.05 5.84L3.93 2.72M17.66 9.84l3.12-3.12M14.64 12.86l3.12 3.12M8 12a4 4 0 108 0v3a4 4 0 01-8 0V9z" />
            </svg>
            <p className="text-sm">No hay notificaciones</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-900'}`}>
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTimeAgo(notification.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <button 
          onClick={onClose}
          className="w-full text-sm text-indigo-600 hover:text-indigo-800 font-medium text-center"
        >
          Ver todas las notificaciones
        </button>
      </div>
    </div>
  );
}