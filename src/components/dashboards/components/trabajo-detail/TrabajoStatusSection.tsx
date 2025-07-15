"use client";

import React from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface TrabajoStatusSectionProps {
  trabajo: any;
  isEditing: boolean;
  onFieldChange: (field: string, value: any) => void;
}

export default function TrabajoStatusSection({
  trabajo,
  isEditing,
  onFieldChange,
}: TrabajoStatusSectionProps) {
  const estados = [
    {
      value: "pendiente",
      label: "Pendiente",
      icon: ClockIcon,
      color: "yellow",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-200",
    },
    {
      value: "asignado",
      label: "Asignado",
      icon: ClockIcon,
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-200",
    },
    {
      value: "en_proceso",
      label: "En Proceso",
      icon: ClockIcon,
      color: "purple",
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
      borderColor: "border-purple-200",
    },
    {
      value: "en_progreso",
      label: "En Progreso",
      icon: ClockIcon,
      color: "indigo",
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-800",
      borderColor: "border-indigo-200",
    },
    {
      value: "completado",
      label: "Completado",
      icon: CheckCircleIcon,
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-200",
    },
    {
      value: "cancelado",
      label: "Cancelado",
      icon: XCircleIcon,
      color: "red",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-200",
    },
  ];

  const estadoActual =
    estados.find((e) => e.value === trabajo.estado) || estados[0];

  // Verificar si está atrasado
  const estaAtrasado =
    trabajo.estado !== "completado" &&
    trabajo.fechaProgramada &&
    new Date(trabajo.fechaProgramada) < new Date();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Estado actual */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Estado Actual
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`p-3 rounded-full ${estadoActual.bgColor} ${estadoActual.borderColor} border-2`}
            >
              <estadoActual.icon
                className={`h-6 w-6 ${estadoActual.textColor}`}
              />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {estadoActual.label}
              </p>
              {estaAtrasado && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  Trabajo atrasado
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <select
              value={trabajo.estado}
              onChange={(e) => onFieldChange("estado", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {estados.map((estado) => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Información de fechas */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cronología</h3>

        <div className="space-y-3 sm:space-y-4">
          {/* Fecha programada */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <ClockIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Fecha Programada</p>
                <p className="text-sm text-gray-600">
                  {trabajo.fechaProgramada
                    ? new Date(trabajo.fechaProgramada).toLocaleString("es-ES")
                    : "No programado"}
                </p>
              </div>
            </div>
            {estaAtrasado && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                Atrasado
              </span>
            )}
          </div>

          {/* Fecha de inicio real */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <ClockIcon className="h-5 w-5 text-blue-400" />
              <div>
                <p className="font-medium text-gray-900">
                  Fecha de Inicio Real
                </p>
                <p className="text-sm text-gray-600">
                  {trabajo.fechaInicioReal
                    ? new Date(trabajo.fechaInicioReal).toLocaleString("es-ES")
                    : "No iniciado"}
                </p>
              </div>
            </div>
            {trabajo.fechaInicioReal && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Iniciado
              </span>
            )}
          </div>

          {/* Fecha de finalización */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
              <div>
                <p className="font-medium text-gray-900">
                  Fecha de Finalización
                </p>
                <p className="text-sm text-gray-600">
                  {trabajo.fechaFinReal
                    ? new Date(trabajo.fechaFinReal).toLocaleString("es-ES")
                    : "No finalizado"}
                </p>
              </div>
            </div>
            {trabajo.fechaFinReal && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Completado
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progreso del trabajo */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso</h3>

        <div className="space-y-3 sm:space-y-4">
          {/* Barra de progreso */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progreso del trabajo</span>
              <span>{getProgressPercentage(trabajo)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(trabajo)}%` }}
              ></div>
            </div>
          </div>

          {/* Indicadores de progreso */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {getProgressPercentage(trabajo)}%
              </p>
              <p className="text-sm text-gray-600">Completado</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">
                {100 - getProgressPercentage(trabajo)}%
              </p>
              <p className="text-sm text-gray-600">Pendiente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Función para calcular el progreso basado en el estado
function getProgressPercentage(trabajo: any): number {
  switch (trabajo.estado) {
    case "pendiente":
      return 0;
    case "asignado":
      return 20;
    case "en_proceso":
      return 40;
    case "en_progreso":
      return 60;
    case "completado":
      return 100;
    case "cancelado":
      return 0;
    default:
      return 0;
  }
}
