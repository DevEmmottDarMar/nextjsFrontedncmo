"use client";

import { useState, useEffect, useRef } from "react";
import { User } from "@/services/authService";
import { useWebSocketSimple, ConnectedUser } from "@/hooks/useWebSocketSimple";
import NotificationContainer from "@/components/NotificationContainer";
import NotificationBar from "@/components/NotificationBar";
import WebSocketDebug from "@/components/WebSocketDebug";
import NotificationManager from "@/components/NotificationManager";
import ActiveNotifications from "@/components/ActiveNotifications";
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

interface SupervisorDashboardProps {
  user: User;
}

const navigation = [
  { name: "Dashboard", icon: HomeIcon, tab: "dashboard" },
  { name: "Técnicos", icon: UsersIcon, tab: "tecnicos" },
  { name: "Notificaciones", icon: BellIcon, tab: "notificaciones" },
  { name: "Permisos", icon: ClipboardDocumentListIcon, tab: "permisos" },
  { name: "Equipos", icon: Cog6ToothIcon, tab: "equipos" },
];

export default function SupervisorDashboard({
  user,
}: SupervisorDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isConnected, connectedUsers, lastMessage, onUserConnected } =
    useWebSocketSimple();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const notificationIds = useRef<Set<string>>(new Set());

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Lógica para notificaciones automáticas cuando se conectan usuarios
  useEffect(() => {
    if (onUserConnected) {
      onUserConnected((user) => {
        const notifId = `${user.userId || user.id}`;
        if (!notificationIds.current.has(notifId)) {
          console.log("🔔 Creando notificación para:", user.nombre);

          // Reproducir sonido de notificación (si está disponible)
          try {
            const audio = new Audio(
              "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
            );
            audio.volume = 0.3;
            audio.play().catch(() => {
              // Ignorar errores de audio
            });
          } catch (e) {
            // Ignorar errores de audio
          }

          const newNotification = {
            id: notifId,
            message: `${user.nombre} se ha conectado desde dispositivo móvil`,
            type: "success",
            user: user,
            timestamp: Date.now(),
          };

          setNotifications((prev) => [...prev, newNotification]);
          setNotificationHistory((prev) => [newNotification, ...prev]);
          notificationIds.current.add(notifId);

          // Limpiar notificación después de 5 segundos
          setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== notifId));
            notificationIds.current.delete(notifId);
          }, 5000);
        }
      });
    }
  }, [onUserConnected]);

  // Filtrar técnicos conectados en tiempo real
  const tecnicosConectados = connectedUsers.filter((u) => {
    const rol = u.rol?.toLowerCase();
    const isTecnico = rol === "técnico" || rol === "tecnico";
    console.log(
      `🔍 Usuario ${u.nombre} - Rol: "${u.rol}" (${rol}) - Es técnico: ${isTecnico}`
    );
    return isTecnico;
  });

  // Debug: Mostrar todos los usuarios conectados
  console.log("👥 Todos los usuarios conectados:", connectedUsers);
  console.log("🔧 Técnicos filtrados:", tecnicosConectados);

  const permisosPendientes = [
    { id: 1, nombre: "Juan Pérez", tipo: "Trabajo", estado: "Pendiente" },
    { id: 2, nombre: "María García", tipo: "Caliente", estado: "Pendiente" },
  ];

  const trabajosActivos = [
    {
      id: 1,
      titulo: "Mantenimiento Bomba A1",
      tecnico: "Juan Pérez",
      progreso: 75,
    },
    {
      id: 2,
      titulo: "Inspección Tanque B2",
      tecnico: "María García",
      progreso: 40,
    },
  ];

  const equiposAlerta = [
    { id: 1, equipo: "Compresor C3", estado: "Alerta", ubicacion: "Zona C" },
  ];

  // Cerrar sesión (simulado)
  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full z-20">
        <div className="flex items-center h-16 px-6 font-bold text-lg tracking-wide border-b border-gray-800">
          <span className="text-blue-400 mr-2">●</span>CMO CENTRAL MONITOREO
        </div>
        <nav className="flex-1 py-6 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-150 hover:bg-gray-800 focus:outline-none ${
                activeTab === item.tab ? "bg-gray-800 text-blue-400" : ""
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center px-6 py-3 text-left w-full border-t border-gray-800 hover:bg-gray-800 focus:outline-none"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
          <span>Cerrar sesión</span>
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white shadow flex items-center justify-between h-16 px-8">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Hola, <span className="font-semibold">{user.nombre}</span>
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                isConnected
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
              ></div>
              {isConnected ? "WebSocket Activo" : "WebSocket Desconectado"}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab("notificaciones")}
              className="relative focus:outline-none hover:text-blue-600 transition-colors"
            >
              <BellIcon className="h-6 w-6 text-gray-500" />
              {notificationHistory.length > 0 && (
                <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full ring-2 ring-white bg-red-500 animate-pulse"></span>
              )}
            </button>
            <span className="text-xs text-gray-500">
              {notificationHistory.length > 0
                ? `${notificationHistory.length} notificación${
                    notificationHistory.length !== 1 ? "es" : ""
                  }`
                : "Sin notificaciones"}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm font-medium"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" /> Salir
            </button>
          </div>
        </header>

        {/* Notificaciones automáticas */}
        <NotificationManager
          notifications={notifications}
          onRemoveNotification={(id) => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            notificationIds.current.delete(id);
          }}
        />

        {/* Notificaciones activas visibles */}
        <ActiveNotifications notifications={notifications} />

        {/* Panel principal */}
        <main className="flex-1 p-8">
          {/* Indicador de tiempo real */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-800">
                  Monitoreo en Tiempo Real
                </span>
              </div>
              <span className="text-xs text-blue-600">
                Última actualización: {currentTime.toLocaleTimeString("es-ES")}
              </span>
            </div>
          </div>

          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-500 text-xs">
                      Técnicos Online
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {tecnicosConectados.length}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Conectados en tiempo real
                  </span>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
                  <div className="flex items-center space-x-2 mb-2">
                    <BellIcon className="h-4 w-4 text-orange-500" />
                    <span className="text-gray-500 text-xs">
                      Notificaciones
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">
                    {notificationHistory.length}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Historial completo
                  </span>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
                  <span className="text-gray-500 text-xs mb-1">
                    Permisos Pendientes
                  </span>
                  <span className="text-2xl font-bold text-yellow-600">
                    {permisosPendientes.length}
                  </span>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
                  <span className="text-gray-500 text-xs mb-1">
                    Trabajos Activos
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {trabajosActivos.length}
                  </span>
                </div>
              </div>

              {/* Segunda fila de cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
                  <span className="text-gray-500 text-xs mb-1">
                    Equipos en Alerta
                  </span>
                  <span className="text-2xl font-bold text-red-600">
                    {equiposAlerta.length}
                  </span>
                </div>
              </div>

              {/* Notificaciones Recientes */}
              {notificationHistory.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Notificaciones Recientes
                    </h3>
                    <button
                      onClick={() => setActiveTab("notificaciones")}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Ver todas →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {notificationHistory.slice(0, 3).map((notif) => (
                      <div
                        key={notif.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <UsersIcon className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notif.user?.nombre || "Usuario"}
                          </p>
                          <p className="text-xs text-gray-600">
                            {notif.message}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(notif.timestamp).toLocaleTimeString(
                              "es-ES"
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Técnicos */}
          {activeTab === "tecnicos" && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Técnicos Conectados
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">
                    {tecnicosConectados.length} conectado
                    {tecnicosConectados.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {tecnicosConectados.length === 0 ? (
                <div className="text-center py-8">
                  <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    No hay técnicos conectados
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Los técnicos aparecerán aquí cuando se conecten desde sus
                    dispositivos móviles
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {tecnicosConectados.map((t) => (
                    <div
                      key={t.userId || t.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <UsersIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {t.nombre}
                            </h3>
                            <p className="text-sm text-gray-600">{t.email}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Área: {t.area?.nombre || "Sin área asignada"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                            Conectado
                          </span>
                          <p className="text-xs text-gray-500 mt-1">Técnico</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notificaciones */}
          {activeTab === "notificaciones" && (
            <div className="bg-white rounded-lg shadow p-6">
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
                    Las notificaciones aparecerán aquí cuando los técnicos se
                    conecten
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
                              {new Date(notif.timestamp).toLocaleString(
                                "es-ES"
                              )}
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
          )}

          {/* Permisos */}
          {activeTab === "permisos" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900">
                Permisos pendientes
              </h2>
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-4">Solicitante</th>
                    <th className="text-left py-2 px-4">Tipo</th>
                    <th className="text-left py-2 px-4">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {permisosPendientes.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="py-2 px-4">{p.nombre}</td>
                      <td className="py-2 px-4">{p.tipo}</td>
                      <td className="py-2 px-4">
                        <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold">
                          {p.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Equipos */}
          {activeTab === "equipos" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900">
                Equipos en alerta
              </h2>
              <ul>
                {equiposAlerta.length === 0 && (
                  <li className="text-gray-400">No hay equipos en alerta</li>
                )}
                {equiposAlerta.map((e) => (
                  <li
                    key={e.id}
                    className="py-2 border-b border-gray-100 flex items-center"
                  >
                    <Cog6ToothIcon className="h-5 w-5 text-red-500 mr-2" />
                    <span className="font-medium text-gray-800">
                      {e.equipo}
                    </span>
                    <span className="ml-2 text-xs text-red-600">
                      {e.estado}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {e.ubicacion}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>

      {/* Componente de debug */}
      <WebSocketDebug />
    </div>
  );
}
