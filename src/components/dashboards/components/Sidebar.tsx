"use client";

import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  navigation: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export default function Sidebar({
  navigation,
  activeTab,
  setActiveTab,
  handleLogout,
  expanded,
  setExpanded,
}: SidebarProps) {
  // Al seleccionar una pestaña, colapsar el sidebar
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setExpanded(false);
  };

  return (
    <aside
      className={`bg-gray-900 text-white flex flex-col fixed left-0 top-0 bottom-0 h-full z-20 transition-all duration-200 ${
        expanded ? "w-56" : "w-16"
      }`}
    >
      {/* Espaciado para el header */}
      <div className="h-16"></div>
      
      {/* Botón menú hamburguesa */}
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 rounded hover:bg-gray-800 focus:outline-none"
          aria-label="Expandir menú"
        >
          <Bars3Icon className="h-7 w-7 text-white" />
        </button>
      </div>
      <nav className="py-4 space-y-1 flex-1">
        {navigation.map((item) => (
          <button
            key={item.tab}
            onClick={() => handleTabClick(item.tab)}
            className={`w-full transition-colors duration-150 hover:bg-gray-800 focus:outline-none ${
              activeTab === item.tab ? "bg-gray-800 text-blue-400" : ""
            }`}
          >
            {expanded ? (
              <div className="flex items-center px-3 py-3 text-left">
                <item.icon className="h-6 w-6" />
                <span className="ml-3 font-medium">{item.name}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center py-4 h-14 w-full">
                <item.icon className="h-7 w-7" />
              </div>
            )}
          </button>
        ))}
      </nav>
      <div className="mt-auto flex flex-col">
        <button
          onClick={handleLogout}
          className="w-full border-t border-gray-800 hover:bg-gray-800 focus:outline-none transition-colors duration-150"
        >
          {expanded ? (
            <div className="flex items-center px-3 py-3 text-left">
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
              <span className="ml-3">Cerrar sesión</span>
            </div>
          ) : (
            <div className="flex items-center justify-center py-4 h-14 w-full">
              <ArrowRightOnRectangleIcon className="h-7 w-7" />
            </div>
          )}
        </button>
        {expanded && (
          <div className="flex items-center px-4 py-3 font-bold text-base tracking-wide">
            <span className="text-blue-400 mr-2">●</span>CMO CENTRAL MONITOREO
          </div>
        )}
      </div>
    </aside>
  );
}
