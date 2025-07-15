"use client";

import { BellIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

interface DashboardStatsProps {
  tecnicosConectados: any[];
  notificationHistory: any[];
  permisosPendientes: any[];
  trabajosActivos: any[];
  trabajos: any[];
  loadingTrabajos: boolean;
  user: any;
  equiposAlerta: any[];
}

export default function DashboardStats({
  tecnicosConectados,
  notificationHistory,
  permisosPendientes,
  trabajosActivos,
  trabajos,
  loadingTrabajos,
  user,
  equiposAlerta,
}: DashboardStatsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-500 text-xs">Técnicos Online</span>
          </div>
          <span className="text-2xl font-bold text-blue-600">
            {tecnicosConectados.length}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            Conectados en tiempo real
          </span>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
          <div className="flex items-center space-x-2 mb-2">
            <BellIcon className="h-4 w-4 text-orange-500" />
            <span className="text-gray-500 text-xs">Notificaciones</span>
          </div>
          <span className="text-2xl font-bold text-orange-600">
            {notificationHistory.length}
          </span>
          <span className="text-xs text-gray-500 mt-1">Historial completo</span>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
          <span className="text-gray-500 text-xs mb-1">
            Permisos Pendientes
          </span>
          <span className="text-2xl font-bold text-yellow-600">
            {permisosPendientes.length}
          </span>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
          <span className="text-gray-500 text-xs mb-1">Trabajos Activos</span>
          <span className="text-2xl font-bold text-green-600">
            {trabajosActivos.length}
          </span>
        </div>
      </div>

      {/* Segunda fila de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
          <div className="flex items-center space-x-2 mb-2">
            <Cog6ToothIcon className="h-4 w-4 text-purple-500" />
            <span className="text-gray-500 text-xs">Trabajos del Área</span>
          </div>
          <span className="text-2xl font-bold text-purple-600">
            {loadingTrabajos ? "..." : trabajos.length}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {user?.area?.nombre || "Sin área asignada"}
          </span>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
          <span className="text-gray-500 text-xs mb-1">Equipos en Alerta</span>
          <span className="text-2xl font-bold text-red-600">
            {equiposAlerta.length}
          </span>
        </div>
      </div>
    </>
  );
}
