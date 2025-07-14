"use client";

import { useEffect, useState } from "react";
import { authService, User } from "@/services/authService";

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
            "Puedes supervisar las operaciones, revisar órdenes de trabajo y gestionar tu equipo.",
          color: "from-blue-500 to-cyan-500",
        };
      case "técnico":
        return {
          emoji: "👷‍♂️",
          greeting: "¡Bienvenido, Técnico!",
          message:
            "Tienes órdenes de trabajo asignadas. Puedes actualizar el estado de tus tareas.",
          color: "from-green-500 to-teal-500",
        };
      case "planificador":
        return {
          emoji: "📋",
          greeting: "¡Hola, Planificador!",
          message:
            "Puedes crear y gestionar órdenes de trabajo, asignar recursos y planificar actividades.",
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

        {/* User Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información Personal
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Nombre:
                </span>
                <p className="text-gray-900">{user.nombre}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Email:
                </span>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  ID Usuario:
                </span>
                <p className="text-gray-900">#{user.id}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Estado:
                </span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.activo
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          </div>

          {/* Role Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Rol y Permisos
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Rol:</span>
                <p className="text-gray-900 capitalize font-semibold">
                  {user.rol}
                </p>
              </div>
              {user.area && (
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Área:
                  </span>
                  <p className="text-gray-900">{user.area.nombre}</p>
                </div>
              )}
              <div className="mt-4">
                <span className="text-xs font-medium text-gray-500">
                  Permisos según rol:
                </span>
                <div className="mt-2 text-sm text-gray-600">
                  {user.rol === "admin" &&
                    "• Administración completa del sistema"}
                  {user.rol === "supervisor" && "• Supervisión de operaciones"}
                  {user.rol === "técnico" &&
                    "• Ejecución de órdenes de trabajo"}
                  {user.rol === "planificador" &&
                    "• Planificación y asignación"}
                </div>
              </div>
            </div>
          </div>

          {/* Backend Connection Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Estado del Sistema
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Backend Conectado</span>
              </div>
              <div className="text-xs text-gray-500">
                <p>API: Railway Production</p>
                <p>WebSocket: Disponible</p>
                <p>Base de datos: PostgreSQL</p>
              </div>
              <div className="mt-4 pt-4 border-t">
                <span className="text-xs font-medium text-gray-500">
                  Endpoints principales:
                </span>
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <div>• POST /auth/login</div>
                  <div>• GET /users/profile</div>
                  <div>• GET /ordenes-trabajo</div>
                  <div>• WebSocket /events</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="text-2xl mb-2">📋</div>
              <div className="text-sm font-medium">Ver Órdenes</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="text-2xl mb-2">👥</div>
              <div className="text-sm font-medium">Usuarios</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium">Reportes</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-sm font-medium">Configuración</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
