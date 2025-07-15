"use client";

import { useEffect, useState } from "react";
import { authService, User } from "@/services/authService";
import {
  TecnicoDashboard,
  PlanificadorDashboard,
  SupervisorDashboard,
  AdminDashboard,
} from "./dashboards";
import Header from "./Header";

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Obtener usuario del localStorage
    const userData = authService.getUser();
    setUser(userData);
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
      {/* Enhanced Header Component */}
      <Header user={user} onLogout={handleLogout} />

      {/* Main Content - Con padding-top para compensar el header sticky limpio */}
      <main className="pt-16 pb-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Role-Specific Dashboard Content */}
          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            {renderRoleSpecificDashboard()}
          </div>
        </div>
      </main>
    </div>
  );
}
