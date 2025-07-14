import { useState, useEffect } from "react";
import { User } from "@/services/authService";

interface SupervisorDashboardProps {
  user: User;
}

export default function SupervisorDashboard({
  user,
}: SupervisorDashboardProps) {
  const [activeTab, setActiveTab] = useState("permisos");
  const [permisosEnder, setPermisosOnger] = useState([
    {
      id: 1,
      solicitante: "Juan Pérez",
      tipo: "Permiso Trabajo",
      descripcion: "Reparación bomba A1",
      estado: "Pendiente",
      fecha: "2024-01-15",
    },
    {
      id: 2,
      solicitante: "María García",
      tipo: "Permiso Caliente",
      descripcion: "Soldadura válvula",
      estado: "Pendiente",
      fecha: "2024-01-15",
    },
    {
      id: 3,
      solicitante: "Carlos López",
      tipo: "Permiso Espacio Confinado",
      descripcion: "Inspección tanque",
      estado: "Aprobado",
      fecha: "2024-01-14",
    },
  ]);

  const [tecnicosConectados] = useState([
    {
      id: 1,
      nombre: "Juan Pérez",
      area: "Mantenimiento",
      ubicacion: "Zona A",
      ultimaActividad: "2 min",
      estado: "En línea",
      ordenActual: "Bomba A1",
    },
    {
      id: 2,
      nombre: "María García",
      area: "Inspección",
      ubicacion: "Zona B",
      ultimaActividad: "5 min",
      estado: "En línea",
      ordenActual: "Tanque B2",
    },
    {
      id: 3,
      nombre: "Ana Rodríguez",
      area: "Mantenimiento",
      ubicacion: "Zona C",
      ultimaActividad: "15 min",
      estado: "Ausente",
      ordenActual: null,
    },
    {
      id: 4,
      nombre: "Carlos López",
      area: "Reparaciones",
      ubicacion: "Taller",
      ultimaActividad: "1 min",
      estado: "En línea",
      ordenActual: "Válvula C3",
    },
  ]);

  const [estadosTrabajos] = useState([
    {
      id: 1,
      titulo: "Mantenimiento Bomba A1",
      tecnico: "Juan Pérez",
      estado: "En Progreso",
      progreso: 75,
      prioridad: "Alta",
    },
    {
      id: 2,
      titulo: "Inspección Tanque B2",
      tecnico: "María García",
      estado: "En Progreso",
      progreso: 40,
      prioridad: "Media",
    },
    {
      id: 3,
      titulo: "Reparación Válvula C3",
      tecnico: "Carlos López",
      estado: "Pendiente",
      progreso: 0,
      prioridad: "Alta",
    },
    {
      id: 4,
      titulo: "Limpieza Filtros D4",
      tecnico: "Ana Rodríguez",
      estado: "Completado",
      progreso: 100,
      prioridad: "Baja",
    },
  ]);

  const [estadosFlotas] = useState([
    {
      id: 1,
      equipo: "Bomba Principal A1",
      estado: "Operativo",
      temperatura: "85°C",
      presion: "120 PSI",
      ubicacion: "Zona A",
    },
    {
      id: 2,
      equipo: "Tanque Almacén B2",
      estado: "Mantenimiento",
      nivel: "65%",
      presion: "45 PSI",
      ubicacion: "Zona B",
    },
    {
      id: 3,
      equipo: "Compresor C3",
      estado: "Alerta",
      temperatura: "95°C",
      presion: "200 PSI",
      ubicacion: "Zona C",
    },
    {
      id: 4,
      equipo: "Filtro Principal D4",
      estado: "Operativo",
      caudal: "450 L/min",
      presion: "80 PSI",
      ubicacion: "Zona D",
    },
  ]);

  const handleAprobarPermiso = (id: number) => {
    setPermisosOnger((permisos) =>
      permisos.map((p) => (p.id === id ? { ...p, estado: "Aprobado" } : p))
    );
    alert("Permiso aprobado exitosamente");
  };

  const handleRechazarPermiso = (id: number) => {
    setPermisosOnger((permisos) =>
      permisos.map((p) => (p.id === id ? { ...p, estado: "Rechazado" } : p))
    );
    alert("Permiso rechazado");
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "Aprobado":
        return "bg-green-100 text-green-800";
      case "Rechazado":
        return "bg-red-100 text-red-800";
      case "En Progreso":
        return "bg-blue-100 text-blue-800";
      case "Completado":
        return "bg-green-100 text-green-800";
      case "En línea":
        return "bg-green-100 text-green-800";
      case "Ausente":
        return "bg-gray-100 text-gray-800";
      case "Operativo":
        return "bg-green-100 text-green-800";
      case "Mantenimiento":
        return "bg-yellow-100 text-yellow-800";
      case "Alerta":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "Alta":
        return "bg-red-100 text-red-800";
      case "Media":
        return "bg-orange-100 text-orange-800";
      case "Baja":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas del Supervisor */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Permisos Pendientes
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {permisosEnder.filter((p) => p.estado === "Pendiente").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Técnicos En Línea
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {
                  tecnicosConectados.filter((t) => t.estado === "En línea")
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Trabajos Activos
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {
                  estadosTrabajos.filter((t) => t.estado === "En Progreso")
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Equipos en Alerta
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {estadosFlotas.filter((e) => e.estado === "Alerta").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("permisos")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "permisos"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Permisos de Trabajo
            </button>
            <button
              onClick={() => setActiveTab("tecnicos")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "tecnicos"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Técnicos Conectados
            </button>
            <button
              onClick={() => setActiveTab("trabajos")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "trabajos"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Estados de Trabajos
            </button>
            <button
              onClick={() => setActiveTab("flotas")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "flotas"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Estado de Flotas
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Tab: Permisos de Trabajo */}
          {activeTab === "permisos" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Permisos de Trabajo Pendientes
              </h3>

              <div className="space-y-4">
                {permisosEnder.map((permiso) => (
                  <div
                    key={permiso.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {permiso.tipo}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Solicitante: {permiso.solicitante}
                        </p>
                        <p className="text-sm text-gray-500">
                          Descripción: {permiso.descripcion}
                        </p>
                        <p className="text-sm text-gray-500">
                          Fecha: {permiso.fecha}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(
                            permiso.estado
                          )}`}
                        >
                          {permiso.estado}
                        </span>
                        {permiso.estado === "Pendiente" && (
                          <>
                            <button
                              onClick={() => handleAprobarPermiso(permiso.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                            >
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleRechazarPermiso(permiso.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                            >
                              Rechazar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Técnicos Conectados */}
          {activeTab === "tecnicos" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Estado de Técnicos
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tecnicosConectados.map((tecnico) => (
                  <div
                    key={tecnico.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        {tecnico.nombre}
                      </h4>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(
                          tecnico.estado
                        )}`}
                      >
                        {tecnico.estado}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <strong>Área:</strong> {tecnico.area}
                      </p>
                      <p>
                        <strong>Ubicación:</strong> {tecnico.ubicacion}
                      </p>
                      <p>
                        <strong>Última actividad:</strong>{" "}
                        {tecnico.ultimaActividad}
                      </p>
                      {tecnico.ordenActual && (
                        <p>
                          <strong>Orden actual:</strong> {tecnico.ordenActual}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Estados de Trabajos */}
          {activeTab === "trabajos" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Estado de Órdenes de Trabajo
              </h3>

              <div className="space-y-4">
                {estadosTrabajos.map((trabajo) => (
                  <div
                    key={trabajo.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {trabajo.titulo}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Técnico: {trabajo.tecnico}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadColor(
                            trabajo.prioridad
                          )}`}
                        >
                          {trabajo.prioridad}
                        </span>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(
                            trabajo.estado
                          )}`}
                        >
                          {trabajo.estado}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progreso</span>
                        <span className="text-gray-900">
                          {trabajo.progreso}%
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${trabajo.progreso}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Estado de Flotas */}
          {activeTab === "flotas" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Estado de Equipos y Flotas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {estadosFlotas.map((equipo) => (
                  <div
                    key={equipo.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        {equipo.equipo}
                      </h4>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(
                          equipo.estado
                        )}`}
                      >
                        {equipo.estado}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <strong>Ubicación:</strong> {equipo.ubicacion}
                      </p>
                      {equipo.temperatura && (
                        <p>
                          <strong>Temperatura:</strong> {equipo.temperatura}
                        </p>
                      )}
                      {equipo.presion && (
                        <p>
                          <strong>Presión:</strong> {equipo.presion}
                        </p>
                      )}
                      {equipo.nivel && (
                        <p>
                          <strong>Nivel:</strong> {equipo.nivel}
                        </p>
                      )}
                      {equipo.caudal && (
                        <p>
                          <strong>Caudal:</strong> {equipo.caudal}
                        </p>
                      )}
                    </div>
                    {equipo.estado === "Alerta" && (
                      <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-700">
                        ⚠️ Requiere atención inmediata
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
