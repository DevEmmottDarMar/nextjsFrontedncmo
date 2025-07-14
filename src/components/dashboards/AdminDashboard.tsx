import { useState, useEffect } from "react";
import { User } from "@/services/authService";

interface AdminDashboardProps {
  user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const [sistemStats] = useState({
    totalUsuarios: 24,
    usuariosActivos: 18,
    ordenesToday: 12,
    equiposOperativos: 15,
    equiposMantenimiento: 3,
    equiposAlarma: 1,
    permisosCompletente: 8,
    trabajosCompletados: 45,
  });

  const [usuarios] = useState([
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan@cmo.com",
      rol: "técnico",
      area: "Mantenimiento",
      activo: true,
      ultimoAcceso: "2024-01-15 14:30",
    },
    {
      id: 2,
      nombre: "María García",
      email: "maria@cmo.com",
      rol: "supervisor",
      area: "Operaciones",
      activo: true,
      ultimoAcceso: "2024-01-15 13:45",
    },
    {
      id: 3,
      nombre: "Carlos López",
      email: "carlos@cmo.com",
      rol: "planificador",
      area: "Planificación",
      activo: true,
      ultimoAcceso: "2024-01-15 12:20",
    },
    {
      id: 4,
      nombre: "Ana Rodríguez",
      email: "ana@cmo.com",
      rol: "técnico",
      area: "Mantenimiento",
      activo: false,
      ultimoAcceso: "2024-01-14 16:15",
    },
  ]);

  const [areas] = useState([
    {
      id: 1,
      nombre: "Mantenimiento",
      responsable: "Juan Pérez",
      usuarios: 8,
      equipos: 12,
      activa: true,
    },
    {
      id: 2,
      nombre: "Operaciones",
      responsable: "María García",
      usuarios: 6,
      equipos: 8,
      activa: true,
    },
    {
      id: 3,
      nombre: "Planificación",
      responsable: "Carlos López",
      usuarios: 4,
      equipos: 0,
      activa: true,
    },
    {
      id: 4,
      nombre: "Seguridad",
      responsable: "Ana Rodríguez",
      usuarios: 6,
      equipos: 4,
      activa: true,
    },
  ]);

  const [reportesSistema] = useState([
    {
      id: 1,
      tipo: "Rendimiento",
      descripcion: "Reporte mensual de productividad",
      estado: "Generado",
      fecha: "2024-01-15",
    },
    {
      id: 2,
      tipo: "Seguridad",
      descripcion: "Incidentes de seguridad",
      estado: "En proceso",
      fecha: "2024-01-15",
    },
    {
      id: 3,
      tipo: "Mantenimiento",
      descripcion: "Programación de mantenimientos",
      estado: "Pendiente",
      fecha: "2024-01-14",
    },
  ]);

  const [configSistema, setConfigSistema] = useState({
    nombreEmpresa: "CMO Operaciones",
    tiempoSesion: 8,
    notificacionesEmail: true,
    backupAutomatico: true,
    frecuenciaBackup: "diario",
    nivelLog: "info",
  });

  const getRolColor = (rol: string) => {
    switch (rol) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "supervisor":
        return "bg-blue-100 text-blue-800";
      case "técnico":
        return "bg-green-100 text-green-800";
      case "planificador":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Generado":
        return "bg-green-100 text-green-800";
      case "En proceso":
        return "bg-yellow-100 text-yellow-800";
      case "Pendiente":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas Generales del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg
                className="h-6 w-6 text-purple-600"
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
                Total Usuarios
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {sistemStats.totalUsuarios}
              </p>
              <p className="text-xs text-green-600">
                {sistemStats.usuariosActivos} activos
              </p>
            </div>
          </div>
        </div>

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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Órdenes Hoy</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {sistemStats.ordenesToday}
              </p>
              <p className="text-xs text-green-600">
                {sistemStats.trabajosCompletados} completadas
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Equipos Operativos
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {sistemStats.equiposOperativos}
              </p>
              <p className="text-xs text-yellow-600">
                {sistemStats.equiposMantenimiento} en mantto.
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Permisos del Día
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {sistemStats.permisosCompletente}
              </p>
              <p className="text-xs text-red-600">
                {sistemStats.equiposAlarma} en alerta
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
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Vista General
            </button>
            <button
              onClick={() => setActiveTab("usuarios")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "usuarios"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Gestión de Usuarios
            </button>
            <button
              onClick={() => setActiveTab("areas")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "areas"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Áreas
            </button>
            <button
              onClick={() => setActiveTab("reportes")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "reportes"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Reportes
            </button>
            <button
              onClick={() => setActiveTab("configuracion")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "configuracion"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Configuración
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Tab: Vista General */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Panel de Administración General
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Resumen de Actividad */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Actividad del Sistema
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Usuarios conectados:
                      </span>
                      <span className="text-sm font-medium">
                        {sistemStats.usuariosActivos}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Órdenes activas:
                      </span>
                      <span className="text-sm font-medium">
                        {sistemStats.ordenesToday}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Equipos operativos:
                      </span>
                      <span className="text-sm font-medium">
                        {sistemStats.equiposOperativos}/
                        {sistemStats.equiposOperativos +
                          sistemStats.equiposMantenimiento +
                          sistemStats.equiposAlarma}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Permisos pendientes:
                      </span>
                      <span className="text-sm font-medium">
                        {sistemStats.permisosCompletente}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones Rápidas de Admin */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Acciones Rápidas
                  </h4>
                  <div className="space-y-3">
                    <button className="w-full text-left p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                      🆕 Crear nuevo usuario
                    </button>
                    <button className="w-full text-left p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                      📊 Generar reporte completo
                    </button>
                    <button className="w-full text-left p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                      🔧 Configurar mantenimientos
                    </button>
                    <button className="w-full text-left p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                      💾 Realizar backup manual
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Gestión de Usuarios */}
          {activeTab === "usuarios" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Gestión de Usuarios
                </h3>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  + Nuevo Usuario
                </button>
              </div>

              <div className="space-y-4">
                {usuarios.map((usuario) => (
                  <div
                    key={usuario.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {usuario.nombre}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {usuario.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          Área: {usuario.area}
                        </p>
                        <p className="text-sm text-gray-500">
                          Último acceso: {usuario.ultimoAcceso}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRolColor(
                            usuario.rol
                          )}`}
                        >
                          {usuario.rol}
                        </span>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            usuario.activo
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {usuario.activo ? "Activo" : "Inactivo"}
                        </span>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                          Editar
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                          {usuario.activo ? "Desactivar" : "Activar"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Áreas */}
          {activeTab === "areas" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Gestión de Áreas
                </h3>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  + Nueva Área
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {areas.map((area) => (
                  <div
                    key={area.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        {area.nombre}
                      </h4>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          area.activa
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {area.activa ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <strong>Responsable:</strong> {area.responsable}
                      </p>
                      <p>
                        <strong>Usuarios:</strong> {area.usuarios}
                      </p>
                      <p>
                        <strong>Equipos:</strong> {area.equipos}
                      </p>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                        Editar
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Reportes */}
          {activeTab === "reportes" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Reportes del Sistema
                </h3>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  + Generar Reporte
                </button>
              </div>

              <div className="space-y-4">
                {reportesSistema.map((reporte) => (
                  <div
                    key={reporte.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {reporte.tipo}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {reporte.descripcion}
                        </p>
                        <p className="text-sm text-gray-500">
                          Fecha: {reporte.fecha}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(
                            reporte.estado
                          )}`}
                        >
                          {reporte.estado}
                        </span>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                          Descargar
                        </button>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                          Ver
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Configuración */}
          {activeTab === "configuracion" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Configuración del Sistema
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Empresa
                    </label>
                    <input
                      type="text"
                      value={configSistema.nombreEmpresa}
                      onChange={(e) =>
                        setConfigSistema({
                          ...configSistema,
                          nombreEmpresa: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiempo de Sesión (horas)
                    </label>
                    <input
                      type="number"
                      value={configSistema.tiempoSesion}
                      onChange={(e) =>
                        setConfigSistema({
                          ...configSistema,
                          tiempoSesion: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frecuencia de Backup
                    </label>
                    <select
                      value={configSistema.frecuenciaBackup}
                      onChange={(e) =>
                        setConfigSistema({
                          ...configSistema,
                          frecuenciaBackup: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="diario">Diario</option>
                      <option value="semanal">Semanal</option>
                      <option value="mensual">Mensual</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={configSistema.notificacionesEmail}
                      onChange={(e) =>
                        setConfigSistema({
                          ...configSistema,
                          notificacionesEmail: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Notificaciones por Email
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={configSistema.backupAutomatico}
                      onChange={(e) =>
                        setConfigSistema({
                          ...configSistema,
                          backupAutomatico: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Backup Automático
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nivel de Log
                    </label>
                    <select
                      value={configSistema.nivelLog}
                      onChange={(e) =>
                        setConfigSistema({
                          ...configSistema,
                          nivelLog: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="error">Error</option>
                      <option value="warning">Warning</option>
                      <option value="info">Info</option>
                      <option value="debug">Debug</option>
                    </select>
                  </div>
                </div>
              </div>

              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Guardar Configuración
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
