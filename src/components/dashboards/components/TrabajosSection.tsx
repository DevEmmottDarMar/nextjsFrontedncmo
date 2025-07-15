"use client";

import { useState } from "react";
import {
  Cog6ToothIcon,
  UsersIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { FilterState, applyFilters } from "./filters";
import TrabajoDetailModal from "./TrabajoDetailModal";

interface Trabajo {
  id: string;
  titulo?: string;
  descripcion?: string;
  estado: string;
  fechaProgramada?: string;
  tecnicoAsignado?: {
    nombre?: string;
    email?: string;
  };
  area?: {
    nombre?: string;
  };
  comentarios?: string;
  fechaInicioReal?: string;
  fechaFinReal?: string;
}

interface TrabajosSectionProps {
  trabajos: Trabajo[];
  loadingTrabajos: boolean;
  user: {
    area?: {
      id?: string;
      nombre?: string;
    };
  };
  cargarTrabajos: () => void;
  connectedUsers?: any[];
}

export default function TrabajosSection({
  trabajos,
  loadingTrabajos,
  user,
  cargarTrabajos,
  connectedUsers = [],
}: TrabajosSectionProps) {
  const [filtroTrabajos, setFiltroTrabajos] = useState("todos");
  const [busquedaTrabajos, setBusquedaTrabajos] = useState("");
  const [selectedTrabajo, setSelectedTrabajo] = useState<Trabajo | null>(null);
  const [showTrabajoDetail, setShowTrabajoDetail] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    dateRange: { start: null, end: null, preset: "" },
    technicians: [],
    statuses: [],
    priorities: [],
    search: { text: "", fields: [] },
    showOverdue: false,
    showUnassigned: false,
    showWithImages: false,
  });

  // Calcular estadísticas de trabajos
  const estadisticasTrabajos = {
    total: trabajos.length,
    pendientes: trabajos.filter((t) => t.estado === "pendiente").length,
    enProgreso: trabajos.filter((t) => t.estado === "en_progreso").length,
    completados: trabajos.filter((t) => t.estado === "completado").length,
    atrasados: trabajos.filter((t) => {
      if (t.estado === "completado") return false;
      const fechaProgramada = new Date(t.fechaProgramada || "");
      const hoy = new Date();
      return fechaProgramada < hoy;
    }).length,
  };

  // Aplicar filtros avanzados
  const trabajosConFiltrosAvanzados = applyFilters(trabajos, advancedFilters);

  // Filtrar y buscar trabajos (filtros básicos)
  const trabajosFiltrados = trabajosConFiltrosAvanzados.filter((trabajo) => {
    // Aplicar filtro por estado
    if (filtroTrabajos !== "todos") {
      if (filtroTrabajos === "atrasados") {
        if (trabajo.estado === "completado") return false;
        const fechaProgramada = new Date(trabajo.fechaProgramada || "");
        const hoy = new Date();
        if (fechaProgramada >= hoy) return false;
      } else if (trabajo.estado !== filtroTrabajos) {
        return false;
      }
    }

    // Aplicar búsqueda por texto
    if (busquedaTrabajos) {
      const busqueda = busquedaTrabajos.toLowerCase();
      return (
        trabajo.titulo?.toLowerCase().includes(busqueda) ||
        trabajo.descripcion?.toLowerCase().includes(busqueda) ||
        trabajo.tecnicoAsignado?.nombre?.toLowerCase().includes(busqueda) ||
        trabajo.area?.nombre?.toLowerCase().includes(busqueda)
      );
    }

    return true;
  });

  // Abrir detalle del trabajo
  const handleTrabajoClick = async (trabajo: Trabajo) => {
    setSelectedTrabajo(trabajo);
    setShowTrabajoDetail(true);
  };

  // Cerrar detalle del trabajo
  const handleCloseTrabajoDetail = () => {
    setShowTrabajoDetail(false);
    setSelectedTrabajo(null);
  };

  // Actualizar trabajo
  const handleUpdateTrabajo = async (trabajoId: string, updates: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://cmobackendnest-production.up.railway.app/trabajos/${trabajoId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );

      if (response.ok) {
        // Actualizar la lista de trabajos
        cargarTrabajos();
        return true;
      } else {
        console.error("Error al actualizar trabajo");
        return false;
      }
    } catch (error) {
      console.error("Error al actualizar trabajo:", error);
      return false;
    }
  };

  // Obtener icono del estado
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "completado":
        return "✅";
      case "en_progreso":
        return "🔄";
      case "pendiente":
        return "⏳";
      default:
        return "❓";
    }
  };

  // Obtener gradiente de color para el estado
  const getEstadoGradient = (estado: string, estaAtrasado: boolean) => {
    if (estaAtrasado) return "from-red-500 to-red-600";
    switch (estado) {
      case "completado":
        return "from-green-500 to-green-600";
      case "en_progreso":
        return "from-blue-500 to-blue-600";
      case "pendiente":
        return "from-yellow-500 to-yellow-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  // Obtener técnicos únicos de los trabajos
  const getTecnicosUnicos = () => {
    const tecnicos = new Set<string>();
    trabajos.forEach((trabajo) => {
      if (trabajo.tecnicoAsignado?.nombre) {
        tecnicos.add(trabajo.tecnicoAsignado.nombre);
      }
    });
    return Array.from(tecnicos).sort();
  };

  // Obtener áreas únicas de los trabajos
  const getAreasUnicas = () => {
    const areas = new Set<string>();
    trabajos.forEach((trabajo) => {
      if (trabajo.area?.nombre) {
        areas.add(trabajo.area.nombre);
      }
    });
    return Array.from(areas).sort();
  };

  // Obtener fechas únicas para filtros
  const getFechasUnicas = () => {
    const fechas = new Set<string>();
    trabajos.forEach((trabajo) => {
      if (trabajo.fechaProgramada) {
        const fecha = new Date(trabajo.fechaProgramada);
        fechas.add(fecha.toISOString().split("T")[0]); // Solo la fecha
      }
    });
    return Array.from(fechas).sort();
  };

  // Obtener prioridades únicas (simuladas)
  const getPrioridadesUnicas = () => {
    const prioridades = new Set<string>();
    trabajos.forEach((trabajo) => {
      // Simular prioridad basada en el estado y fecha
      if (trabajo.estado === "pendiente") {
        const fechaProgramada = new Date(trabajo.fechaProgramada || "");
        const hoy = new Date();
        const diasDiferencia = Math.ceil(
          (fechaProgramada.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diasDiferencia < 0) {
          prioridades.add("Crítica");
        } else if (diasDiferencia <= 2) {
          prioridades.add("Alta");
        } else if (diasDiferencia <= 7) {
          prioridades.add("Media");
        } else {
          prioridades.add("Baja");
        }
      }
    });
    return Array.from(prioridades).sort();
  };

  // Obtener técnicos conectados
  const getTecnicosConectados = () => {
    return connectedUsers.filter((user) => {
      const rol = user.rol?.toLowerCase();
      return rol === "técnico" || rol === "tecnico";
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 transition-all duration-300 ease-in-out">
      {/* Header ultra compacto con filtros avanzados integrados */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-3 text-white">
        {/* Primera fila: Título, estadísticas y botones */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-bold">
                {user?.area?.nombre
                  ? `Trabajos: ${user.area.nombre}`
                  : "Todos los Trabajos"}
              </h2>
              <p className="text-blue-100 text-xs">
                {trabajos.length} trabajo{trabajos.length !== 1 ? "s" : ""}{" "}
                total
              </p>
            </div>

            {/* Estadísticas compactas en línea */}
            <div className="flex items-center gap-2">
              <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-center border border-white/20">
                <div className="text-sm font-bold">
                  {estadisticasTrabajos.total}
                </div>
                <div className="text-xs text-blue-100">Total</div>
              </div>
              <div className="bg-yellow-500/20 backdrop-blur-sm px-2 py-1 rounded text-center border border-yellow-400/30">
                <div className="text-sm font-bold text-yellow-200">
                  {estadisticasTrabajos.pendientes}
                </div>
                <div className="text-xs text-yellow-100">Pend.</div>
              </div>
              <div className="bg-blue-500/20 backdrop-blur-sm px-2 py-1 rounded text-center border border-blue-400/30">
                <div className="text-sm font-bold text-blue-200">
                  {estadisticasTrabajos.enProgreso}
                </div>
                <div className="text-xs text-blue-100">Prog.</div>
              </div>
              <div className="bg-green-500/20 backdrop-blur-sm px-2 py-1 rounded text-center border border-green-400/30">
                <div className="text-sm font-bold text-green-200">
                  {estadisticasTrabajos.completados}
                </div>
                <div className="text-xs text-green-100">Comp.</div>
              </div>
              <div className="bg-red-500/20 backdrop-blur-sm px-2 py-1 rounded text-center border border-red-400/30">
                <div className="text-sm font-bold text-red-200">
                  {estadisticasTrabajos.atrasados}
                </div>
                <div className="text-xs text-red-100">Atr.</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={cargarTrabajos}
              disabled={loadingTrabajos}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded font-medium transition-all duration-200 backdrop-blur-sm disabled:opacity-50 text-sm"
            >
              {loadingTrabajos ? "..." : "Actualizar"}
            </button>
          </div>
        </div>

        {/* Segunda fila: Filtros básicos y avanzados integrados */}
        <div className="flex items-center gap-2">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200" />
            <input
              type="text"
              placeholder="Buscar trabajos..."
              value={busquedaTrabajos}
              onChange={(e) => setBusquedaTrabajos(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white/10 border border-white/20 rounded focus:ring-1 focus:ring-white/50 focus:border-transparent text-white placeholder-blue-200 backdrop-blur-sm text-sm"
            />
          </div>

          {/* Filtro de estado */}
          <select
            value={filtroTrabajos}
            onChange={(e) => setFiltroTrabajos(e.target.value)}
            className="px-3 py-1.5 bg-white/10 border border-white/20 rounded focus:ring-1 focus:ring-white/50 focus:border-transparent text-white backdrop-blur-sm text-sm min-w-[120px]"
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="en_progreso">En Progreso</option>
            <option value="completado">Completados</option>
            <option value="atrasados">Atrasados</option>
          </select>

          {/* Filtro de técnicos */}
          <select
            value={
              advancedFilters.technicians.length > 0
                ? advancedFilters.technicians[0]
                : ""
            }
            onChange={(e) => {
              const tecnico = e.target.value;
              setAdvancedFilters({
                ...advancedFilters,
                technicians: tecnico ? [tecnico] : [],
              });
            }}
            className="px-3 py-1.5 bg-white/10 border border-white/20 rounded focus:ring-1 focus:ring-white/50 focus:border-transparent text-white backdrop-blur-sm text-sm min-w-[140px]"
          >
            <option value="">Todos los técnicos</option>
            {getTecnicosUnicos().map((tecnico) => (
              <option key={tecnico} value={tecnico}>
                {tecnico}{" "}
                {getTecnicosConectados().some((t) => t.nombre === tecnico)
                  ? "🟢"
                  : ""}
              </option>
            ))}
          </select>

          {/* Filtro de área */}
          <select
            value={
              advancedFilters.statuses.length > 0
                ? advancedFilters.statuses[0]
                : ""
            }
            onChange={(e) => {
              const area = e.target.value;
              setAdvancedFilters({
                ...advancedFilters,
                statuses: area ? [area] : [],
              });
            }}
            className="px-3 py-1.5 bg-white/10 border border-white/20 rounded focus:ring-1 focus:ring-white/50 focus:border-transparent text-white backdrop-blur-sm text-sm min-w-[120px]"
          >
            <option value="">Todas las áreas</option>
            {getAreasUnicas().map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

          {/* Filtro de prioridad */}
          <select
            value={
              advancedFilters.priorities.length > 0
                ? advancedFilters.priorities[0]
                : ""
            }
            onChange={(e) => {
              const prioridad = e.target.value;
              setAdvancedFilters({
                ...advancedFilters,
                priorities: prioridad ? [prioridad] : [],
              });
            }}
            className="px-3 py-1.5 bg-white/10 border border-white/20 rounded focus:ring-1 focus:ring-white/50 focus:border-transparent text-white backdrop-blur-sm text-sm min-w-[120px]"
          >
            <option value="">Todas las prioridades</option>
            {getPrioridadesUnicas().map((prioridad) => (
              <option key={prioridad} value={prioridad}>
                {prioridad === "Crítica"
                  ? "🔴 "
                  : prioridad === "Alta"
                  ? "🟠 "
                  : prioridad === "Media"
                  ? "🟡 "
                  : "🟢 "}
                {prioridad}
              </option>
            ))}
          </select>

          {/* Filtros especiales */}
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                setAdvancedFilters({
                  ...advancedFilters,
                  showOverdue: !advancedFilters.showOverdue,
                })
              }
              className={`px-2 py-1.5 rounded text-xs font-medium transition-all ${
                advancedFilters.showOverdue
                  ? "bg-red-500/30 text-red-100 border border-red-400/50"
                  : "bg-white/10 text-blue-100 border border-white/20 hover:bg-white/20"
              }`}
              title="Solo atrasados"
            >
              ⚠️ Atrasados
            </button>
            <button
              onClick={() =>
                setAdvancedFilters({
                  ...advancedFilters,
                  showUnassigned: !advancedFilters.showUnassigned,
                })
              }
              className={`px-2 py-1.5 rounded text-xs font-medium transition-all ${
                advancedFilters.showUnassigned
                  ? "bg-orange-500/30 text-orange-100 border border-orange-400/50"
                  : "bg-white/10 text-blue-100 border border-white/20 hover:bg-white/20"
              }`}
              title="Sin asignar"
            >
              👤 Sin asignar
            </button>
            <button
              onClick={() =>
                setAdvancedFilters({
                  ...advancedFilters,
                  showWithImages: !advancedFilters.showWithImages,
                })
              }
              className={`px-2 py-1.5 rounded text-xs font-medium transition-all ${
                advancedFilters.showWithImages
                  ? "bg-green-500/30 text-green-100 border border-green-400/50"
                  : "bg-white/10 text-blue-100 border border-white/20 hover:bg-white/20"
              }`}
              title="Con imágenes"
            >
              📸 Con fotos
            </button>
            <button
              onClick={() => {
                const tecnicosConectados = getTecnicosConectados();
                if (tecnicosConectados.length > 0) {
                  setAdvancedFilters({
                    ...advancedFilters,
                    technicians: tecnicosConectados.map((t) => t.nombre),
                  });
                }
              }}
              className="px-2 py-1.5 rounded text-xs font-medium transition-all bg-white/10 text-blue-100 border border-white/20 hover:bg-white/20"
              title="Solo técnicos conectados"
            >
              🟢 Conectados
            </button>
            <button
              onClick={() => {
                const hoy = new Date();
                const trabajosHoy = trabajos.filter((trabajo) => {
                  if (!trabajo.fechaProgramada) return false;
                  const fechaTrabajo = new Date(trabajo.fechaProgramada);
                  return fechaTrabajo.toDateString() === hoy.toDateString();
                });
                if (trabajosHoy.length > 0) {
                  setAdvancedFilters({
                    ...advancedFilters,
                    dateRange: { start: hoy, end: hoy, preset: "hoy" },
                  });
                }
              }}
              className="px-2 py-1.5 rounded text-xs font-medium transition-all bg-white/10 text-blue-100 border border-white/20 hover:bg-white/20"
              title="Trabajos de hoy"
            >
              📅 Hoy
            </button>
          </div>
        </div>

        {/* Tercera fila: Filtros de fecha y limpiar */}
        <div className="flex items-center gap-2 mt-2">
          {/* Filtro de fecha rápida */}
          <select
            value={advancedFilters.dateRange.preset}
            onChange={(e) => {
              const preset = e.target.value;
              let start = null;
              let end = null;

              if (preset === "hoy") {
                start = new Date();
                end = new Date();
              } else if (preset === "ayer") {
                start = new Date();
                start.setDate(start.getDate() - 1);
                end = new Date();
                end.setDate(end.getDate() - 1);
              } else if (preset === "semana") {
                start = new Date();
                start.setDate(start.getDate() - 7);
                end = new Date();
              } else if (preset === "mes") {
                start = new Date();
                start.setMonth(start.getMonth() - 1);
                end = new Date();
              } else if (preset === "proxima_semana") {
                start = new Date();
                end = new Date();
                end.setDate(end.getDate() + 7);
              } else if (preset === "atrasados") {
                start = new Date(0); // Desde el inicio
                end = new Date();
                end.setDate(end.getDate() - 1); // Hasta ayer
              }

              setAdvancedFilters({
                ...advancedFilters,
                dateRange: { start, end, preset },
              });
            }}
            className="px-3 py-1.5 bg-white/10 border border-white/20 rounded focus:ring-1 focus:ring-white/50 focus:border-transparent text-white backdrop-blur-sm text-sm min-w-[140px]"
          >
            <option value="">Todas las fechas</option>
            <option value="hoy">📅 Hoy</option>
            <option value="ayer">📅 Ayer</option>
            <option value="semana">📅 Última semana</option>
            <option value="mes">📅 Último mes</option>
            <option value="proxima_semana">📅 Próxima semana</option>
            <option value="atrasados">⚠️ Atrasados</option>
          </select>

          {/* Filtro de fecha específica */}
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                const fecha = new Date(e.target.value);
                setAdvancedFilters({
                  ...advancedFilters,
                  dateRange: {
                    start: fecha,
                    end: fecha,
                    preset: "especifica",
                  },
                });
              }
            }}
            className="px-3 py-1.5 bg-white/10 border border-white/20 rounded focus:ring-1 focus:ring-white/50 focus:border-transparent text-white backdrop-blur-sm text-sm min-w-[140px]"
          >
            <option value="">Fecha específica</option>
            {getFechasUnicas().map((fecha) => (
              <option key={fecha} value={fecha}>
                {new Date(fecha).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </option>
            ))}
          </select>

          {/* Contador de filtros activos */}
          {(advancedFilters.dateRange.start ||
            advancedFilters.dateRange.end ||
            advancedFilters.technicians.length > 0 ||
            advancedFilters.statuses.length > 0 ||
            advancedFilters.priorities.length > 0 ||
            advancedFilters.search.text ||
            advancedFilters.showOverdue ||
            advancedFilters.showUnassigned ||
            advancedFilters.showWithImages) && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-blue-200 text-xs">
                {
                  [
                    advancedFilters.dateRange.start ||
                      advancedFilters.dateRange.end,
                    advancedFilters.technicians.length > 0,
                    advancedFilters.statuses.length > 0,
                    advancedFilters.priorities.length > 0,
                    advancedFilters.search.text,
                    advancedFilters.showOverdue,
                    advancedFilters.showUnassigned,
                    advancedFilters.showWithImages,
                  ].filter(Boolean).length
                }{" "}
                filtros activos
              </span>
              <button
                onClick={() =>
                  setAdvancedFilters({
                    dateRange: { start: null, end: null, preset: "" },
                    technicians: [],
                    statuses: [],
                    priorities: [],
                    search: { text: "", fields: [] },
                    showOverdue: false,
                    showUnassigned: false,
                    showWithImages: false,
                  })
                }
                className="text-blue-200 hover:text-white text-xs transition-colors bg-white/10 px-2 py-1 rounded"
              >
                Limpiar todo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lista de trabajos compacta */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        {loadingTrabajos ? (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-3 sm:mt-4 text-sm sm:text-lg">
              Cargando trabajos...
            </p>
          </div>
        ) : trabajos.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Cog6ToothIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No hay trabajos
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              No se encontraron trabajos en esta área
            </p>
          </div>
        ) : trabajosFiltrados.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <MagnifyingGlassIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Sin resultados
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              No se encontraron trabajos con los filtros aplicados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {trabajosFiltrados.map((trabajo) => {
              const fechaProgramada = new Date(trabajo.fechaProgramada || "");
              const hoy = new Date();
              const estaAtrasado =
                trabajo.estado !== "completado" && fechaProgramada < hoy;
              const estadoGradient = getEstadoGradient(
                trabajo.estado,
                estaAtrasado
              );

              return (
                <div
                  key={trabajo.id}
                  className={`group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border ${
                    selectedTrabajo?.id === trabajo.id
                      ? "border-blue-400 shadow-blue-100"
                      : estaAtrasado
                      ? "border-red-200 hover:border-red-300"
                      : "border-gray-200 hover:border-gray-300"
                  } overflow-hidden h-32`}
                  onClick={() => handleTrabajoClick(trabajo)}
                >
                  {/* Barra de estado superior */}
                  <div
                    className={`h-1 bg-gradient-to-r ${estadoGradient}`}
                  ></div>

                  {/* Contenido ultra compacto */}
                  <div className="p-2 h-full flex flex-col">
                    {/* Header con título y estado */}
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h3 className="font-semibold text-gray-900 text-xs truncate flex-1">
                        {trabajo.titulo || "Sin título"}
                      </h3>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${estadoGradient} text-white shadow-sm flex-shrink-0`}
                      >
                        {getEstadoIcon(trabajo.estado)}
                      </span>
                    </div>

                    {/* Información técnica compacta */}
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                      <UsersIcon className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      <span className="truncate">
                        {trabajo.tecnicoAsignado?.nombre || "Sin asignar"}
                      </span>
                    </div>

                    {/* Fecha compacta */}
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                      <CalendarIcon className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      <span>
                        {trabajo.fechaProgramada
                          ? new Date(
                              trabajo.fechaProgramada
                            ).toLocaleDateString("es-ES", {
                              month: "short",
                              day: "numeric",
                            })
                          : "Sin fecha"}
                      </span>
                    </div>

                    {/* Indicadores especiales compactos */}
                    <div className="flex items-center gap-1 mt-auto">
                      {estaAtrasado && (
                        <div className="flex items-center gap-1 text-red-600 bg-red-50 px-1.5 py-0.5 rounded text-xs">
                          <ClockIcon className="h-3 w-3" />
                          <span className="font-medium">Atrasado</span>
                        </div>
                      )}
                      {trabajo.descripcion && (
                        <div className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                          +info
                        </div>
                      )}
                    </div>

                    {/* Botón de ver detalles */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors bg-white/80 rounded"
                        title="Ver detalles"
                      >
                        <EyeIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de detalle del trabajo */}
      {showTrabajoDetail && selectedTrabajo && (
        <TrabajoDetailModal
          trabajo={selectedTrabajo}
          isOpen={showTrabajoDetail}
          onClose={handleCloseTrabajoDetail}
          onUpdate={handleUpdateTrabajo}
          onRefresh={cargarTrabajos}
        />
      )}
    </div>
  );
}
