"use client";

import { BellIcon, UsersIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

interface HeaderProps {
  isConnected: boolean;
  notificationHistory: any[];
  setActiveTab: (tab: string) => void;
  showUserPanel: boolean;
  setShowUserPanel: (show: boolean) => void;
  handleLogout: () => void;
}

export default function Header({
  isConnected,
  notificationHistory,
  setActiveTab,
  showUserPanel,
  setShowUserPanel,
  handleLogout,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white shadow flex items-center justify-between h-14 px-6">
      <div className="flex items-center space-x-4">
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
          onClick={() => setShowUserPanel(!showUserPanel)}
          className="lg:hidden flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded text-blue-700 text-sm font-medium"
        >
          <UsersIcon className="h-5 w-5 mr-1" />
          {showUserPanel ? "Ocultar" : "Usuarios"}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm font-medium"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" /> Salir
        </button>
      </div>
    </header>
  );
} 