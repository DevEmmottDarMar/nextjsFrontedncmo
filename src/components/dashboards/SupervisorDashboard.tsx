"use client";

import React, { useState, useEffect, useRef } from "react";
import { User } from "@/services/authService";
import { useWebSocketSimple } from "@/hooks/useWebSocketSimple";
import NotificationManager from "@/components/NotificationManager";
import ActiveNotifications from "@/components/ActiveNotifications";
import TrabajosPendientesAprobacion from "@/components/TrabajosPendientesAprobacion";
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

// Componentes modulares
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import TecnicosSection from "./components/TecnicosSection";
import NotificationsSection from "./components/NotificationsSection";
import TrabajosSection from "./components/TrabajosSection";
import TecnicosChatPanel from "./components/TecnicosChatPanel";

interface SupervisorDashboardProps {
  user: User;
}

const navigation = [
  { name: "Dashboard", icon: HomeIcon, tab: "dashboard" },
  { name: "Técnicos", icon: UsersIcon, tab: "tecnicos" },
  { name: "Notificaciones", icon: BellIcon, tab: "notificaciones" },
  { name: "Trabajos", icon: Cog6ToothIcon, tab: "trabajos" },
  {
    name: "Aprobar Trabajos",
    icon: ClipboardDocumentListIcon,
    tab: "aprobar_trabajos",
  },
  { name: "Permisos", icon: ClipboardDocumentListIcon, tab: "permisos" },
  { name: "Equipos", icon: Cog6ToothIcon, tab: "equipos" },
];

export default function SupervisorDashboard({
  user,
}: SupervisorDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isConnected, connectedUsers, onUserConnected } = useWebSocketSimple();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<any[]>([]);
  const notificationIds = useRef<Set<string>>(new Set());
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Estados para trabajos y paneles
  const [trabajos, setTrabajos] = useState<any[]>([]);
  const [loadingTrabajos, setLoadingTrabajos] = useState(false);
  const [showUserPanel, setShowUserPanel] = useState(false);

  // Datos simulados
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

  // Lógica para notificaciones automáticas
  useEffect(() => {
    if (onUserConnected) {
      onUserConnected((user) => {
        const notifId = `${user.userId || user.id}`;
        if (!notificationIds.current.has(notifId)) {
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

          setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== notifId));
            notificationIds.current.delete(notifId);
          }, 5000);
        }
      });
    }
  }, [onUserConnected]);

  // Filtrar técnicos conectados
  const tecnicosConectados = connectedUsers.filter((u) => {
    const rol = u.rol?.toLowerCase();
    return rol === "técnico" || rol === "tecnico";
  });

  // Cargar trabajos del área del supervisor
  const cargarTrabajos = async () => {
    setLoadingTrabajos(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://cmobackendnest-production.up.railway.app/trabajos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        let trabajosDelArea;
        if (user?.area?.id) {
          trabajosDelArea = data.filter((trabajo: any) => {
            return (
              trabajo.area?.id === user?.area?.id ||
              trabajo.areaId === user?.area?.id
            );
          });
        } else {
          trabajosDelArea = data;
        }
        setTrabajos(trabajosDelArea);
      }
    } catch (error) {
      console.error("❌ Error al cargar trabajos:", error);
    } finally {
      setLoadingTrabajos(false);
    }
  };

  // Cargar trabajos al montar el componente
  useEffect(() => {
    if (user) {
      cargarTrabajos();
    }
  }, [user]);

  // Cerrar sesión
  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        navigation={navigation}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSidebarExpanded(false);
        }}
        handleLogout={handleLogout}
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
      />

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${
          sidebarExpanded ? "ml-56" : "ml-16"
        } bg-gray-100`}
      >
        {/* Header */}
        <Header
          isConnected={isConnected}
          notificationHistory={notificationHistory}
          setActiveTab={setActiveTab}
          showUserPanel={showUserPanel}
          setShowUserPanel={setShowUserPanel}
          handleLogout={handleLogout}
        />

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
        <main className="flex-1 px-4 sm:px-6 pt-6 pb-6">
          {activeTab === "dashboard" && (
            <DashboardStats
              tecnicosConectados={tecnicosConectados}
              notificationHistory={notificationHistory}
              permisosPendientes={permisosPendientes}
              trabajosActivos={trabajosActivos}
              trabajos={trabajos}
              loadingTrabajos={loadingTrabajos}
              user={user}
              equiposAlerta={equiposAlerta}
            />
          )}

          {activeTab === "tecnicos" && (
            <TecnicosSection tecnicosConectados={tecnicosConectados} />
          )}

          {activeTab === "notificaciones" && (
            <NotificationsSection notificationHistory={notificationHistory} />
          )}

          {activeTab === "trabajos" && (
            <TrabajosSection
              trabajos={trabajos}
              loadingTrabajos={loadingTrabajos}
              user={user}
              cargarTrabajos={cargarTrabajos}
              connectedUsers={connectedUsers}
            />
          )}

          {activeTab === "aprobar_trabajos" && (
            <div className="bg-white rounded-lg shadow p-6">
              <TrabajosPendientesAprobacion
                onTrabajoAprobado={(trabajoId) => {
                  console.log("Trabajo aprobado:", trabajoId);
                  // Recargar trabajos después de aprobar
                  cargarTrabajos();
                }}
                onTrabajoRechazado={(trabajoId) => {
                  console.log("Trabajo rechazado:", trabajoId);
                  // Recargar trabajos después de rechazar
                  cargarTrabajos();
                }}
              />
            </div>
          )}

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
        <TecnicosChatPanel tecnicosConectados={tecnicosConectados} />
      </div>
    </div>
  );
}
