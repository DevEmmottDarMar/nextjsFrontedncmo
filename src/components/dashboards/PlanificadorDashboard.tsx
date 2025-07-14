import { useState, useEffect } from "react";
import { User } from "@/services/authService";

interface PlanificadorDashboardProps {
  user: User;
}

export default function PlanificadorDashboard({
  user,
}: PlanificadorDashboardProps) {
  const [activeTab, setActiveTab] = useState("crear");
  const [trabajos, setTrabajos] = useState([
    {
      id: 1,
      titulo: "Mantenimiento Bomba A1",
      tecnico: "Juan Pérez",
      estado: "Asignado",
      fechaCreacion: "2024-01-10",
    },
    {
      id: 2,
      titulo: "Inspección Tanque B2",
      tecnico: "María García",
      estado: "En Progreso",
      fechaCreacion: "2024-01-09",
    },
    {
      id: 3,
      titulo: "Reparación Válvula C3",
      tecnico: "Carlos López",
      estado: "Completado",
      fechaCreacion: "2024-01-08",
    },
  ]);

  const [tecnicos] = useState([
    { id: 1, nombre: "Juan Pérez", area: "Mantenimiento", disponible: true },
    { id: 2, nombre: "María García", area: "Inspección", disponible: true },
    { id: 3, nombre: "Carlos López", area: "Reparaciones", disponible: false },
    { id: 4, nombre: "Ana Rodríguez", area: "Mantenimiento", disponible: true },
  ]);

  const [newTrabajo, setNewTrabajo] = useState({
    titulo: "",
    descripcion: "",
    prioridad: "Media",
    tecnicoId: "",
    fechaVencimiento: "",
    area: "",
  });

  const handleCreateTrabajo = (e: React.FormEvent) => {
    e.preventDefault();
    const tecnico = tecnicos.find(
      (t) => t.id === parseInt(newTrabajo.tecnicoId)
    );
    const nuevoTrabajo = {
      id: trabajos.length + 1,
      titulo: newTrabajo.titulo,
      tecnico: tecnico?.nombre || "Sin asignar",
      estado: "Asignado",
      fechaCreacion: new Date().toISOString().split("T")[0],
    };
    setTrabajos([...trabajos, nuevoTrabajo]);
    setNewTrabajo({
      titulo: "",
      descripcion: "",
      prioridad: "Media",
      tecnicoId: "",
      fechaVencimiento: "",
      area: "",
    });
    alert("Trabajo creado exitosamente");
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Asignado":
        return "bg-blue-100 text-blue-800";
      case "En Progreso":
        return "bg-yellow-100 text-yellow-800";
      case "Completado":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas del Planificador */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg
                className="h-6 w-6 text-orange-600"
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
              <h3 className="text-sm font-medium text-gray-500">
                Trabajos Creados
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {trabajos.length}
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Técnicos Disponibles
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {tecnicos.filter((t) => t.disponible).length}
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
              <h3 className="text-sm font-medium text-gray-500">En Progreso</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {trabajos.filter((t) => t.estado === "En Progreso").length}
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
              <h3 className="text-sm font-medium text-gray-500">Completados</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {trabajos.filter((t) => t.estado === "Completado").length}
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
              onClick={() => setActiveTab("crear")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "crear"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Crear Trabajo
            </button>
            <button
              onClick={() => setActiveTab("asignar")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "asignar"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Asignar Trabajos
            </button>
            <button
              onClick={() => setActiveTab("gestionar")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "gestionar"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Gestionar Trabajos
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Tab: Crear Trabajo */}
          {activeTab === "crear" && (
            <form onSubmit={handleCreateTrabajo} className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Crear Nueva Orden de Trabajo
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del Trabajo
                  </label>
                  <input
                    type="text"
                    required
                    value={newTrabajo.titulo}
                    onChange={(e) =>
                      setNewTrabajo({ ...newTrabajo, titulo: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ej: Mantenimiento de bomba principal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <select
                    value={newTrabajo.prioridad}
                    onChange={(e) =>
                      setNewTrabajo({
                        ...newTrabajo,
                        prioridad: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asignar a Técnico
                  </label>
                  <select
                    value={newTrabajo.tecnicoId}
                    onChange={(e) =>
                      setNewTrabajo({
                        ...newTrabajo,
                        tecnicoId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Seleccionar técnico</option>
                    {tecnicos
                      .filter((t) => t.disponible)
                      .map((tecnico) => (
                        <option key={tecnico.id} value={tecnico.id}>
                          {tecnico.nombre} - {tecnico.area}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    value={newTrabajo.fechaVencimiento}
                    onChange={(e) =>
                      setNewTrabajo({
                        ...newTrabajo,
                        fechaVencimiento: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del Trabajo
                </label>
                <textarea
                  rows={4}
                  value={newTrabajo.descripcion}
                  onChange={(e) =>
                    setNewTrabajo({
                      ...newTrabajo,
                      descripcion: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Describe el trabajo a realizar..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Crear Orden de Trabajo
              </button>
            </form>
          )}

          {/* Tab: Asignar Trabajos */}
          {activeTab === "asignar" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Técnicos Disponibles
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tecnicos.map((tecnico) => (
                  <div
                    key={tecnico.id}
                    className={`border rounded-lg p-4 ${
                      tecnico.disponible
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {tecnico.nombre}
                        </h4>
                        <p className="text-sm text-gray-500">{tecnico.area}</p>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          tecnico.disponible
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tecnico.disponible ? "Disponible" : "Ocupado"}
                      </span>
                    </div>
                    {tecnico.disponible && (
                      <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                        Asignar Trabajo
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Gestionar Trabajos */}
          {activeTab === "gestionar" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Trabajos Creados
              </h3>

              <div className="space-y-4">
                {trabajos.map((trabajo) => (
                  <div
                    key={trabajo.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {trabajo.titulo}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Asignado a: {trabajo.tecnico}
                        </p>
                        <p className="text-sm text-gray-500">
                          Creado: {trabajo.fechaCreacion}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(
                            trabajo.estado
                          )}`}
                        >
                          {trabajo.estado}
                        </span>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                          Editar
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                          Eliminar
                        </button>
                      </div>
                    </div>
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
