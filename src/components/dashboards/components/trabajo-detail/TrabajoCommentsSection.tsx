"use client";

import React from "react";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

interface TrabajoCommentsSectionProps {
  trabajo: any;
  isEditing: boolean;
  onFieldChange: (field: string, value: any) => void;
}

export default function TrabajoCommentsSection({
  trabajo,
  isEditing,
  onFieldChange,
}: TrabajoCommentsSectionProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Comentarios principales */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ChatBubbleLeftIcon className="h-5 w-5 text-blue-600" />
          Comentarios del Trabajo
        </h3>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentarios Adicionales
              </label>
              <textarea
                value={trabajo.comentarios || ""}
                onChange={(e) => onFieldChange("comentarios", e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Agrega comentarios adicionales sobre el trabajo, observaciones, notas importantes..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Máximo 500 caracteres
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {trabajo.comentarios ? (
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-700 leading-relaxed italic">
                  "{trabajo.comentarios}"
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Comentario del supervisor
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <ChatBubbleLeftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No hay comentarios para este trabajo
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Historial de comentarios (simulado) */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Historial de Comentarios
        </h3>

        <div className="space-y-3 sm:space-y-4">
          {/* Comentario del sistema */}
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">S</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900">Sistema</p>
                  <p className="text-xs text-gray-500">
                    {new Date().toLocaleString("es-ES")}
                  </p>
                </div>
                <p className="text-sm text-gray-700">
                  Trabajo creado y asignado al área correspondiente
                </p>
              </div>
            </div>
          </div>

          {/* Comentario del supervisor */}
          {trabajo.comentarios && (
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-medium">S</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      Supervisor
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date().toLocaleString("es-ES")}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700">{trabajo.comentarios}</p>
                </div>
              </div>
            </div>
          )}

          {/* Comentario del técnico (si está asignado) */}
          {trabajo.tecnicoAsignado && (
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm font-medium">T</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {trabajo.tecnicoAsignado.nombre || "Técnico"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date().toLocaleString("es-ES")}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700">
                    Trabajo recibido y en proceso de planificación
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notas rápidas */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Notas Rápidas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm font-medium text-yellow-800">Prioridad</p>
            <p className="text-yellow-700">Media</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-800">Tiempo Estimado</p>
            <p className="text-blue-700">4-6 horas</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-800">Materiales</p>
            <p className="text-green-700">Disponibles</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm font-medium text-purple-800">Permisos</p>
            <p className="text-purple-700">Pendientes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
 