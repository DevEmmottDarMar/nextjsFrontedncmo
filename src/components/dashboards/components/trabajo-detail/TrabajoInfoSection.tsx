"use client";

import React from "react";
import {
  MapPinIcon,
  CalendarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

interface TrabajoInfoSectionProps {
  trabajo: any;
  isEditing: boolean;
  onFieldChange: (field: string, value: any) => void;
}

export default function TrabajoInfoSection({
  trabajo,
  isEditing,
  onFieldChange,
}: TrabajoInfoSectionProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Título */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DocumentTextIcon className="h-5 w-5 text-blue-600" />
          Información General
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título del Trabajo
            </label>
            {isEditing ? (
              <input
                type="text"
                value={trabajo.titulo || ""}
                onChange={(e) => onFieldChange("titulo", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese el título del trabajo"
              />
            ) : (
              <p className="text-gray-900 font-medium">
                {trabajo.titulo || "Sin título"}
              </p>
            )}
          </div>

          {/* Área */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MapPinIcon className="h-4 w-4" />
              Área
            </label>
            <p className="text-gray-900 font-medium">
              {trabajo.area?.nombre || "Sin área asignada"}
            </p>
          </div>

          {/* Fecha Programada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Fecha Programada
            </label>
            {isEditing ? (
              <input
                type="datetime-local"
                value={
                  trabajo.fechaProgramada
                    ? trabajo.fechaProgramada.slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  onFieldChange("fechaProgramada", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">
                {trabajo.fechaProgramada
                  ? new Date(trabajo.fechaProgramada).toLocaleString("es-ES")
                  : "Sin fecha programada"}
              </p>
            )}
          </div>

          {/* Fecha Inicio Real */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Inicio Real
            </label>
            {isEditing ? (
              <input
                type="datetime-local"
                value={
                  trabajo.fechaInicioReal
                    ? trabajo.fechaInicioReal.slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  onFieldChange("fechaInicioReal", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">
                {trabajo.fechaInicioReal
                  ? new Date(trabajo.fechaInicioReal).toLocaleString("es-ES")
                  : "No iniciado"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Descripción
        </h3>
        {isEditing ? (
          <textarea
            value={trabajo.descripcion || ""}
            onChange={(e) => onFieldChange("descripcion", e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Describe detalladamente el trabajo a realizar..."
          />
        ) : (
          <p className="text-gray-700 leading-relaxed">
            {trabajo.descripcion || "Sin descripción disponible"}
          </p>
        )}
      </div>

      {/* Información adicional */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Información Adicional
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Fecha Fin Real */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Finalización
            </label>
            {isEditing ? (
              <input
                type="datetime-local"
                value={
                  trabajo.fechaFinReal ? trabajo.fechaFinReal.slice(0, 16) : ""
                }
                onChange={(e) => onFieldChange("fechaFinReal", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">
                {trabajo.fechaFinReal
                  ? new Date(trabajo.fechaFinReal).toLocaleString("es-ES")
                  : "No finalizado"}
              </p>
            )}
          </div>

          {/* Siguiente Tipo Permiso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Siguiente Permiso Requerido
            </label>
            {isEditing ? (
              <select
                value={trabajo.siguienteTipoPermiso || ""}
                onChange={(e) =>
                  onFieldChange("siguienteTipoPermiso", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar permiso</option>
                <option value="altura">Altura</option>
                <option value="enganche">Enganche</option>
                <option value="cierre">Cierre</option>
                <option value="electrico">Eléctrico</option>
                <option value="mecanico">Mecánico</option>
                <option value="finalizado">Finalizado</option>
              </select>
            ) : (
              <p className="text-gray-900 capitalize">
                {trabajo.siguienteTipoPermiso || "No especificado"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
 