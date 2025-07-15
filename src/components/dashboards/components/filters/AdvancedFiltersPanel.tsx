"use client";

import { useState } from "react";
import {
  XMarkIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import DateRangeFilter from "./DateRangeFilter";
import TechnicianFilter from "./TechnicianFilter";
import StatusFilter from "./StatusFilter";
import PriorityFilter from "./PriorityFilter";
import SearchFilter from "./SearchFilter";

interface FilterState {
  dateRange: {
    start: Date | null;
    end: Date | null;
    preset: string;
  };
  technicians: string[];
  statuses: string[];
  priorities: string[];
  search: {
    text: string;
    fields: string[];
  };
  showOverdue: boolean;
  showUnassigned: boolean;
  showWithImages: boolean;
}

interface AdvancedFiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  trabajos: any[];
  tecnicosDisponibles: any[];
}

export default function AdvancedFiltersPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClearFilters,
  trabajos,
  tecnicosDisponibles,
}: AdvancedFiltersPanelProps) {
  const [activeSection, setActiveSection] = useState<string>("general");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const hasActiveFilters = () => {
    return (
      filters.dateRange.start ||
      filters.dateRange.end ||
      filters.technicians.length > 0 ||
      filters.statuses.length > 0 ||
      filters.priorities.length > 0 ||
      filters.search.text ||
      filters.showOverdue ||
      filters.showUnassigned ||
      filters.showWithImages
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.technicians.length > 0) count++;
    if (filters.statuses.length > 0) count++;
    if (filters.priorities.length > 0) count++;
    if (filters.search.text) count++;
    if (filters.showOverdue) count++;
    if (filters.showUnassigned) count++;
    if (filters.showWithImages) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay para móviles */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Panel lateral derecho */}
      <div
        className={`fixed top-0 right-0 h-full z-50 transition-all duration-300 ease-in-out filter-panel-scrollbar ${
          isCollapsed
            ? "w-12 sm:w-14"
            : "w-full sm:w-80 md:w-96 lg:w-80 xl:w-96"
        }`}
      >
        {/* Panel principal */}
        <div className="h-full bg-white shadow-2xl border-l border-gray-200 flex flex-col">
          {/* Header del panel */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4 flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2 sm:gap-3">
                <FunnelIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-bold truncate">
                    Filtros Avanzados
                  </h2>
                  <p className="text-blue-100 text-xs sm:text-sm truncate">
                    {getActiveFiltersCount()} filtro
                    {getActiveFiltersCount() !== 1 ? "s" : ""} activo
                    {getActiveFiltersCount() !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1 sm:gap-2">
              {!isCollapsed && hasActiveFilters() && (
                <button
                  onClick={onClearFilters}
                  className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs transition-colors hidden sm:block"
                >
                  Limpiar
                </button>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title={isCollapsed ? "Expandir" : "Contraer"}
              >
                {isCollapsed ? (
                  <ChevronLeftIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Cerrar"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Contenido del panel */}
          {!isCollapsed && (
            <>
              {/* Navegación lateral */}
              <div className="flex-1 flex">
                <div className="w-16 sm:w-20 bg-gray-50 border-r border-gray-200 p-2">
                  <nav className="space-y-1 sm:space-y-2">
                    {[
                      { id: "general", name: "General", icon: "🔍" },
                      { id: "date", name: "Fechas", icon: "📅" },
                      { id: "technicians", name: "Técnicos", icon: "👥" },
                      { id: "status", name: "Estados", icon: "⚡" },
                      { id: "priority", name: "Prioridad", icon: "🎯" },
                    ].map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full p-2 rounded-lg text-center transition-colors ${
                          activeSection === section.id
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                        title={section.name}
                      >
                        <div className="text-sm sm:text-base mb-1">
                          {section.icon}
                        </div>
                        <div className="text-xs font-medium truncate">
                          {section.name}
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Contenido del filtro */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 filter-panel-scrollbar">
                  {activeSection === "general" && (
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                          Filtros Generales
                        </h3>
                        <SearchFilter
                          value={filters.search}
                          onChange={(search) => updateFilters({ search })}
                        />
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                          Filtros Especiales
                        </h4>

                        <label className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={filters.showOverdue}
                            onChange={(e) =>
                              updateFilters({ showOverdue: e.target.checked })
                            }
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-gray-900 text-sm sm:text-base">
                              Trabajos Atrasados
                            </span>
                            <p className="text-xs sm:text-sm text-gray-600">
                              Mostrar solo trabajos vencidos
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={filters.showUnassigned}
                            onChange={(e) =>
                              updateFilters({
                                showUnassigned: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-gray-900 text-sm sm:text-base">
                              Sin Asignar
                            </span>
                            <p className="text-xs sm:text-sm text-gray-600">
                              Trabajos sin técnico asignado
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={filters.showWithImages}
                            onChange={(e) =>
                              updateFilters({
                                showWithImages: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-gray-900 text-sm sm:text-base">
                              Con Imágenes
                            </span>
                            <p className="text-xs sm:text-sm text-gray-600">
                              Trabajos que tienen fotos
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Resumen de filtros */}
                      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                          Resumen de Filtros
                        </h4>
                        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Total de trabajos:
                            </span>
                            <span className="font-medium">
                              {trabajos.length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Filtros activos:
                            </span>
                            <span className="font-medium text-blue-600">
                              {getActiveFiltersCount()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Resultados esperados:
                            </span>
                            <span className="font-medium text-green-600">
                              {Math.max(
                                0,
                                trabajos.length - getActiveFiltersCount() * 10
                              )}{" "}
                              - {trabajos.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === "date" && (
                    <DateRangeFilter
                      value={filters.dateRange}
                      onChange={(dateRange) => updateFilters({ dateRange })}
                    />
                  )}

                  {activeSection === "technicians" && (
                    <TechnicianFilter
                      value={filters.technicians}
                      onChange={(technicians) => updateFilters({ technicians })}
                      tecnicosDisponibles={tecnicosDisponibles}
                    />
                  )}

                  {activeSection === "status" && (
                    <StatusFilter
                      value={filters.statuses}
                      onChange={(statuses) => updateFilters({ statuses })}
                    />
                  )}

                  {activeSection === "priority" && (
                    <PriorityFilter
                      value={filters.priorities}
                      onChange={(priorities) => updateFilters({ priorities })}
                    />
                  )}
                </div>
              </div>

              {/* Footer con acciones */}
              <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-xs sm:text-sm text-gray-600">
                    {hasActiveFilters() ? (
                      <span>
                        Filtros aplicados • {getActiveFiltersCount()} activo
                        {getActiveFiltersCount() !== 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span>Sin filtros aplicados</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {hasActiveFilters() && (
                      <button
                        onClick={onClearFilters}
                        className="px-2 sm:px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors text-xs sm:text-sm"
                      >
                        Limpiar
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="px-3 sm:px-4 py-1 bg-blue-600 text-white rounded text-xs sm:text-sm hover:bg-blue-700 transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Panel colapsado - solo iconos */}
          {isCollapsed && (
            <div className="flex-1 flex flex-col items-center py-3 sm:py-4 space-y-3 sm:space-y-4">
              <div className="text-center">
                <FunnelIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mx-auto mb-1 sm:mb-2" />
                <div className="text-xs text-gray-600">Filtros</div>
              </div>

              {hasActiveFilters() && (
                <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold">
                  {getActiveFiltersCount()}
                </div>
              )}

              <div className="flex-1 flex flex-col items-center justify-center space-y-1 sm:space-y-2">
                {[
                  { id: "general", icon: "🔍" },
                  { id: "date", icon: "📅" },
                  { id: "technicians", icon: "👥" },
                  { id: "status", icon: "⚡" },
                  { id: "priority", icon: "🎯" },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setIsCollapsed(false);
                      setActiveSection(section.id);
                    }}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-sm sm:text-lg transition-colors filter-icon ${
                      activeSection === section.id
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                    title={section.name}
                  >
                    {section.icon}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
