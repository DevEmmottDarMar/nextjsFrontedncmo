"use client";

import { useEffect, useState } from "react";
import { authService, User } from "@/services/authService";
import {
  TecnicoDashboard,
  PlanificadorDashboard,
  SupervisorDashboard,
  AdminDashboard,
} from "./dashboards";

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Obtener usuario del localStorage
    const userData = authService.getUser();
    setUser(userData);

    // Actualizar tiempo cada segundo
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  const getRoleMessage = (rol: string) => {
    switch (rol) {
      case "admin":
        return {
          emoji: "👨‍💼",
          greeting: "¡Bienvenido, Administrador!",
          message:
            "Tienes acceso completo al sistema CMO. Puedes gestionar usuarios, áreas y supervisar todas las operaciones.",
          color: "from-purple-500 to-pink-500",
        };
      case "supervisor":
        return {
          emoji: "📊",
          greeting: "¡Hola, Supervisor!",
          message:
            "Puedes autorizar permisos, supervisar técnicos conectados y monitorear el estado de trabajos y flotas.",
          color: "from-blue-500 to-cyan-500",
        };
      case "técnico":
        return {
          emoji: "👷‍♂️",
          greeting: "¡Bienvenido, Técnico!",
          message:
            "Tienes órdenes de trabajo asignadas. Puedes actualizar el estado de tus tareas y reportar progreso.",
          color: "from-green-500 to-teal-500",
        };
      case "planificador":
        return {
          emoji: "📋",
          greeting: "¡Hola, Planificador!",
          message:
            "Puedes crear trabajos, asignar recursos a técnicos y gestionar la planificación de actividades.",
          color: "from-orange-500 to-red-500",
        };
      default:
        return {
          emoji: "👤",
          greeting: "¡Bienvenido!",
          message: "Acceso al sistema CMO.",
          color: "from-gray-500 to-gray-600",
        };
    }
  };

  const renderRoleSpecificDashboard = () => {
    if (!user) return null;

    switch (user.rol) {
      case "admin":
        return <AdminDashboard user={user} />;
      case "supervisor":
        return <SupervisorDashboard user={user} />;
      case "planificador":
        return <PlanificadorDashboard user={user} />;
      case "técnico":
        return <TecnicoDashboard user={user} />;
      default:
        return <TecnicoDashboard user={user} />; // Fallback al dashboard técnico
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const roleInfo = getRoleMessage(user.rol);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6"
                  />
                </svg>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                CMO Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
              <div className="text-sm text-gray-700">
                <span className="font-medium">{user.nombre}</span>
                <span className="ml-2 text-xs px-2 py-1 bg-gray-100 rounded-full capitalize">
                  {user.rol}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <div
          className={`bg-gradient-to-r ${roleInfo.color} rounded-xl shadow-lg p-8 mb-6`}
        >
          <div className="text-center text-white">
            <div className="text-6xl mb-4">{roleInfo.emoji}</div>
            <h2 className="text-3xl font-bold mb-2">{roleInfo.greeting}</h2>
            <h3 className="text-xl font-semibold mb-4">{user.nombre}</h3>
            <p className="text-lg opacity-90">{roleInfo.message}</p>
          </div>
        </div>

        {/* Role-Specific Dashboard Content */}
        {renderRoleSpecificDashboard()}
      </main>
    </div>
  );
}
