"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

interface SearchFilterProps {
  value: {
    text: string;
    fields: string[];
  };
  onChange: (search: { text: string; fields: string[] }) => void;
}

const searchFields = [
  {
    id: "titulo",
    name: "Título",
    description: "Buscar en el título del trabajo",
  },
  {
    id: "descripcion",
    name: "Descripción",
    description: "Buscar en la descripción",
  },
  {
    id: "tecnico",
    name: "Técnico",
    description: "Buscar por nombre del técnico",
  },
  { id: "area", name: "Área", description: "Buscar por área o ubicación" },
  { id: "equipo", name: "Equipo", description: "Buscar por equipo o máquina" },
  { id: "codigo", name: "Código", description: "Buscar por código de trabajo" },
  {
    id: "cliente",
    name: "Cliente",
    description: "Buscar por nombre del cliente",
  },
  {
    id: "observaciones",
    name: "Observaciones",
    description: "Buscar en observaciones",
  },
];

export default function SearchFilter({ value, onChange }: SearchFilterProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateSearchText = (text: string) => {
    onChange({ ...value, text });
  };

  const toggleField = (fieldId: string) => {
    const newFields = value.fields.includes(fieldId)
      ? value.fields.filter((f) => f !== fieldId)
      : [...value.fields, fieldId];
    onChange({ ...value, fields: newFields });
  };

  const selectAllFields = () => {
    const allFields = searchFields.map((f) => f.id);
    onChange({ ...value, fields: allFields });
  };

  const clearFields = () => {
    onChange({ ...value, fields: [] });
  };

  const selectCommonFields = () => {
    onChange({
      ...value,
      fields: ["titulo", "descripcion", "tecnico", "area"],
    });
  };

  const clearSearch = () => {
    onChange({ text: "", fields: [] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Búsqueda Avanzada
        </h3>

        {/* Campo de búsqueda principal */}
        <div className="mb-4 sm:mb-6">
          <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
            Texto de Búsqueda
          </h4>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar trabajos..."
              value={value.text}
              onChange={(e) => updateSearchText(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <span>
              Buscando en {value.fields.length} campo
              {value.fields.length !== 1 ? "s" : ""}
            </span>
            {value.text && (
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        </div>

        {/* Configuración avanzada */}
        <div className="mb-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            <span className="font-medium">
              {showAdvanced ? "Ocultar" : "Mostrar"} configuración avanzada
            </span>
          </button>
        </div>

        {/* Campos de búsqueda */}
        {showAdvanced && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Campos de Búsqueda</h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={selectAllFields}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Todos
                </button>
                <button
                  onClick={selectCommonFields}
                  className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  Comunes
                </button>
                <button
                  onClick={clearFields}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Ninguno
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchFields.map((field) => {
                const isSelected = value.fields.includes(field.id);

                return (
                  <div
                    key={field.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => toggleField(field.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-4 h-4 rounded border-2 mt-0.5 ${
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
                      <div className="flex-1">
                        <h5
                          className={`font-medium ${
                            isSelected ? "text-blue-900" : "text-gray-900"
                          }`}
                        >
                          {field.name}
                        </h5>
                        <p
                          className={`text-sm ${
                            isSelected ? "text-blue-700" : "text-gray-600"
                          }`}
                        >
                          {field.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Campos seleccionados */}
        {value.fields.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">
              Campos Seleccionados ({value.fields.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {value.fields.map((fieldId) => {
                const field = searchFields.find((f) => f.id === fieldId);
                if (!field) return null;

                return (
                  <div
                    key={fieldId}
                    className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{field.name}</span>
                    <button
                      onClick={() => toggleField(fieldId)}
                      className="hover:bg-blue-200 rounded-full p-1"
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

        {/* Consejos de búsqueda */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">
            Consejos de Búsqueda
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-2">
                <strong>Búsqueda exacta:</strong> Usa comillas para frases
                exactas
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Múltiples términos:</strong> Separa palabras con
                espacios
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">
                <strong>Excluir términos:</strong> Usa - antes de la palabra
              </p>
              <p className="text-gray-600">
                <strong>Búsqueda parcial:</strong> No es necesario escribir
                palabras completas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
