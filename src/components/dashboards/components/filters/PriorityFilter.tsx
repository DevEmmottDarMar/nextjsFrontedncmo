"use client";

import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface PriorityFilterProps {
  value: string[];
  onChange: (priorities: string[]) => void;
}

const priorityOptions = [
  {
    id: "baja",
    name: "Baja",
    description: "Trabajos de baja urgencia",
    icon: InformationCircleIcon,
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-200",
    level: 1,
  },
  {
    id: "normal",
    name: "Normal",
    description: "Trabajos de prioridad estándar",
    icon: InformationCircleIcon,
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    borderColor: "border-blue-200",
    level: 2,
  },
  {
    id: "alta",
    name: "Alta",
    description: "Trabajos de alta prioridad",
    icon: ExclamationTriangleIcon,
    color: "orange",
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
    borderColor: "border-orange-200",
    level: 3,
  },
  {
    id: "urgente",
    name: "Urgente",
    description: "Trabajos críticos que requieren atención inmediata",
    icon: ExclamationCircleIcon,
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    borderColor: "border-red-200",
    level: 4,
  },
  {
    id: "critica",
    name: "Crítica",
    description: "Trabajos de máxima urgencia",
    icon: ExclamationCircleIcon,
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
    borderColor: "border-purple-200",
    level: 5,
  },
];

export default function PriorityFilter({
  value,
  onChange,
}: PriorityFilterProps) {
  const togglePriority = (priorityId: string) => {
    if (value.includes(priorityId)) {
      onChange(value.filter((id) => id !== priorityId));
    } else {
      onChange([...value, priorityId]);
    }
  };

  const selectAll = () => {
    const allPriorities = priorityOptions.map((p) => p.id);
    onChange(allPriorities);
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectHighPriority = () => {
    onChange(["alta", "urgente", "critica"]);
  };

  const selectLowPriority = () => {
    onChange(["baja", "normal"]);
  };

  const selectCritical = () => {
    onChange(["critica", "urgente"]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Filtro por Prioridad
        </h3>

        {/* Acciones rápidas */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Acciones Rápidas</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={selectAll}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Todas
            </button>
            <button
              onClick={selectHighPriority}
              className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
            >
              Alta Prioridad
            </button>
            <button
              onClick={selectLowPriority}
              className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
            >
              Baja Prioridad
            </button>
            <button
              onClick={selectCritical}
              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
            >
              Críticos
            </button>
          </div>
          <div className="mt-2">
            <button
              onClick={clearAll}
              className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              Limpiar selección
            </button>
          </div>
        </div>

        {/* Lista de prioridades */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">
            Niveles de Prioridad ({priorityOptions.length})
          </h4>
          <div className="space-y-3">
            {priorityOptions.map((priority) => {
              const isSelected = value.includes(priority.id);
              const IconComponent = priority.icon;

              return (
                <div
                  key={priority.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? `${priority.bgColor} ${priority.borderColor} ${priority.textColor}`
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => togglePriority(priority.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isSelected ? "bg-white/50" : `${priority.bgColor}`
                      }`}
                    >
                      <IconComponent
                        className={`h-4 w-4 ${
                          isSelected
                            ? priority.textColor
                            : `${priority.textColor}`
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h5
                            className={`font-medium ${
                              isSelected ? priority.textColor : "text-gray-900"
                            }`}
                          >
                            {priority.name}
                          </h5>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isSelected
                                ? "bg-white/50 text-current"
                                : `${priority.bgColor} ${priority.textColor}`
                            }`}
                          >
                            Nivel {priority.level}
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded border-2 ${
                            isSelected
                              ? "bg-white border-white"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-full h-full text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          isSelected ? "opacity-80" : "text-gray-600"
                        }`}
                      >
                        {priority.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prioridades seleccionadas */}
        {value.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">
              Prioridades Seleccionadas ({value.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {value.map((priorityId) => {
                const priority = priorityOptions.find(
                  (p) => p.id === priorityId
                );
                if (!priority) return null;

                return (
                  <div
                    key={priorityId}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${priority.bgColor} ${priority.textColor}`}
                  >
                    <priority.icon className="h-3 w-3" />
                    <span>{priority.name}</span>
                    <button
                      onClick={() => togglePriority(priorityId)}
                      className="hover:bg-white/20 rounded-full p-1"
                    >
                      <svg
                        className="h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Leyenda de prioridades */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">
            Leyenda de Prioridades
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-2">
                <strong>Baja (1-2):</strong> Trabajos que pueden esperar sin
                afectar operaciones críticas.
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Alta (3):</strong> Trabajos importantes que requieren
                atención pronta.
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">
                <strong>Urgente (4):</strong> Trabajos críticos que afectan
                operaciones.
              </p>
              <p className="text-gray-600">
                <strong>Crítica (5):</strong> Trabajos de máxima urgencia que
                requieren atención inmediata.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
