"use client";

import { CheckCircleIcon, ClockIcon, XCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface StatusFilterProps {
  value: string[];
  onChange: (statuses: string[]) => void;
}

const statusOptions = [
  {
    id: "pendiente",
    name: "Pendiente",
    description: "Trabajos esperando asignación o inicio",
    icon: ClockIcon,
    color: "yellow",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    borderColor: "border-yellow-200"
  },
  {
    id: "en_progreso",
    name: "En Progreso",
    description: "Trabajos actualmente en ejecución",
    icon: CheckCircleIcon,
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    borderColor: "border-blue-200"
  },
  {
    id: "completado",
    name: "Completado",
    description: "Trabajos finalizados exitosamente",
    icon: CheckCircleIcon,
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-200"
  },
  {
    id: "cancelado",
    name: "Cancelado",
    description: "Trabajos cancelados o suspendidos",
    icon: XCircleIcon,
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    borderColor: "border-red-200"
  },
  {
    id: "atrasado",
    name: "Atrasado",
    description: "Trabajos fuera del plazo establecido",
    icon: ExclamationTriangleIcon,
    color: "orange",
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
    borderColor: "border-orange-200"
  },
  {
    id: "revision",
    name: "En Revisión",
    description: "Trabajos pendientes de revisión",
    icon: ClockIcon,
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
    borderColor: "border-purple-200"
  }
];

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  const toggleStatus = (statusId: string) => {
    if (value.includes(statusId)) {
      onChange(value.filter(id => id !== statusId));
    } else {
      onChange([...value, statusId]);
    }
  };

  const selectAll = () => {
    const allStatuses = statusOptions.map(s => s.id);
    onChange(allStatuses);
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectActive = () => {
    onChange(["pendiente", "en_progreso", "revision"]);
  };

  const selectCompleted = () => {
    onChange(["completado"]);
  };

  const selectProblematic = () => {
    onChange(["atrasado", "cancelado"]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtro por Estados</h3>
        
        {/* Acciones rápidas */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Acciones Rápidas</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={selectAll}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Todos
            </button>
            <button
              onClick={selectActive}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
            >
              Activos
            </button>
            <button
              onClick={selectCompleted}
              className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
            >
              Completados
            </button>
            <button
              onClick={selectProblematic}
              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
            >
              Problemáticos
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

        {/* Lista de estados */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">
            Estados Disponibles ({statusOptions.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {statusOptions.map((status) => {
              const isSelected = value.includes(status.id);
              const IconComponent = status.icon;
              
              return (
                <div
                  key={status.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? `${status.bgColor} ${status.borderColor} ${status.textColor}`
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleStatus(status.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isSelected ? "bg-white/50" : `${status.bgColor}`
                    }`}>
                      <IconComponent className={`h-4 w-4 ${
                        isSelected ? status.textColor : `${status.textColor}`
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className={`font-medium ${
                          isSelected ? status.textColor : "text-gray-900"
                        }`}>
                          {status.name}
                        </h5>
                        <div className={`w-4 h-4 rounded border-2 ${
                          isSelected 
                            ? "bg-white border-white" 
                            : "border-gray-300"
                        }`}>
                          {isSelected && (
                            <svg className="w-full h-full text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${
                        isSelected ? "opacity-80" : "text-gray-600"
                      }`}>
                        {status.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estados seleccionados */}
        {value.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">
              Estados Seleccionados ({value.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {value.map((statusId) => {
                const status = statusOptions.find(s => s.id === statusId);
                if (!status) return null;
                
                return (
                  <div
                    key={statusId}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${status.bgColor} ${status.textColor}`}
                  >
                    <status.icon className="h-3 w-3" />
                    <span>{status.name}</span>
                    <button
                      onClick={() => toggleStatus(statusId)}
                      className="hover:bg-white/20 rounded-full p-1"
                    >
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 