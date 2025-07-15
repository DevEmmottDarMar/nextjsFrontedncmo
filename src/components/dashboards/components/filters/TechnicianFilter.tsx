"use client";

import { useState } from "react";
import {
  UsersIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface TechnicianFilterProps {
  value: string[];
  onChange: (technicians: string[]) => void;
  tecnicosDisponibles: any[];
}

export default function TechnicianFilter({
  value,
  onChange,
  tecnicosDisponibles,
}: TechnicianFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTecnicos = tecnicosDisponibles.filter(
    (tecnico) =>
      tecnico.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tecnico.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addTechnician = (tecnicoId: string) => {
    if (!value.includes(tecnicoId)) {
      onChange([...value, tecnicoId]);
    }
  };

  const removeTechnician = (tecnicoId: string) => {
    onChange(value.filter((id) => id !== tecnicoId));
  };

  const selectAll = () => {
    const allIds = tecnicosDisponibles.map((t) => t.userId || t.id);
    onChange(allIds);
  };

  const clearAll = () => {
    onChange([]);
  };

  const getTechnicianName = (tecnicoId: string) => {
    const tecnico = tecnicosDisponibles.find(
      (t) => (t.userId || t.id) === tecnicoId
    );
    return tecnico?.nombre || "Técnico desconocido";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Filtro por Técnicos
        </h3>

        {/* Búsqueda */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Buscar Técnicos</h4>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Acciones Rápidas</h4>
          <div className="flex items-center gap-3">
            <button
              onClick={selectAll}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Seleccionar Todos
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              Limpiar Selección
            </button>
            <button
              onClick={() => onChange([])}
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
            >
              Solo Sin Asignar
            </button>
          </div>
        </div>

        {/* Lista de técnicos */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">
            Técnicos Disponibles ({filteredTecnicos.length})
          </h4>
          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredTecnicos.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No se encontraron técnicos
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredTecnicos.map((tecnico) => {
                  const tecnicoId = tecnico.userId || tecnico.id;
                  const isSelected = value.includes(tecnicoId);

                  return (
                    <div
                      key={tecnicoId}
                      className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : ""
                      }`}
                      onClick={() =>
                        isSelected
                          ? removeTechnician(tecnicoId)
                          : addTechnician(tecnicoId)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <UsersIcon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {tecnico.nombre}
                            </p>
                            <p className="text-sm text-gray-600">
                              {tecnico.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <span className="text-blue-600 text-sm font-medium">
                              Seleccionado
                            </span>
                          )}
                          <div
                            className={`w-4 h-4 rounded border-2 ${
                              isSelected
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <svg
                                className="w-full h-full text-white"
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
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Técnicos seleccionados */}
        {value.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">
              Técnicos Seleccionados ({value.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {value.map((tecnicoId) => (
                <div
                  key={tecnicoId}
                  className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{getTechnicianName(tecnicoId)}</span>
                  <button
                    onClick={() => removeTechnician(tecnicoId)}
                    className="hover:bg-blue-200 rounded-full p-1"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
