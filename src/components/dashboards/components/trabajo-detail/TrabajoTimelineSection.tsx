"use client";

import React from "react";
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface TrabajoTimelineSectionProps {
  trabajo: any;
}

export default function TrabajoTimelineSection({
  trabajo,
}: TrabajoTimelineSectionProps) {
  // Generar eventos de la cronología basados en los datos del trabajo
  const timelineEvents = [
    {
      id: 1,
      type: "created",
      title: "Trabajo Creado",
      description: "El trabajo fue creado en el sistema",
      date: trabajo.createdAt || new Date(),
      icon: CheckCircleIcon,
      color: "blue",
      completed: true,
    },
    {
      id: 2,
      type: "assigned",
      title: "Asignado a Área",
      description: `Trabajo asignado al área: ${
        trabajo.area?.nombre || "Sin área"
      }`,
      date: trabajo.createdAt || new Date(),
      icon: CheckCircleIcon,
      color: "blue",
      completed: true,
    },
    {
      id: 3,
      type: "technician",
      title: "Técnico Asignado",
      description: trabajo.tecnicoAsignado
        ? `Asignado a: ${trabajo.tecnicoAsignado.nombre}`
        : "Sin técnico asignado",
      date: trabajo.createdAt || new Date(),
      icon: CheckCircleIcon,
      color: trabajo.tecnicoAsignado ? "green" : "yellow",
      completed: !!trabajo.tecnicoAsignado,
    },
    {
      id: 4,
      type: "scheduled",
      title: "Fecha Programada",
      description: trabajo.fechaProgramada
        ? `Programado para: ${new Date(trabajo.fechaProgramada).toLocaleString(
            "es-ES"
          )}`
        : "Sin fecha programada",
      date: trabajo.fechaProgramada || null,
      icon: ClockIcon,
      color: trabajo.fechaProgramada ? "blue" : "gray",
      completed: !!trabajo.fechaProgramada,
    },
    {
      id: 5,
      type: "started",
      title: "Trabajo Iniciado",
      description: trabajo.fechaInicioReal
        ? `Iniciado el: ${new Date(trabajo.fechaInicioReal).toLocaleString(
            "es-ES"
          )}`
        : "Trabajo no iniciado",
      date: trabajo.fechaInicioReal || null,
      icon: CheckCircleIcon,
      color: trabajo.fechaInicioReal ? "green" : "gray",
      completed: !!trabajo.fechaInicioReal,
    },
    {
      id: 6,
      type: "completed",
      title: "Trabajo Completado",
      description: trabajo.fechaFinReal
        ? `Completado el: ${new Date(trabajo.fechaFinReal).toLocaleString(
            "es-ES"
          )}`
        : "Trabajo no completado",
      date: trabajo.fechaFinReal || null,
      icon: CheckCircleIcon,
      color: trabajo.fechaFinReal ? "green" : "gray",
      completed: !!trabajo.fechaFinReal,
    },
  ];

  const getColorClasses = (color: string, completed: boolean) => {
    if (!completed) return "text-gray-400 bg-gray-100";

    switch (color) {
      case "blue":
        return "text-blue-600 bg-blue-100";
      case "green":
        return "text-green-600 bg-green-100";
      case "yellow":
        return "text-yellow-600 bg-yellow-100";
      case "red":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getBorderColor = (color: string, completed: boolean) => {
    if (!completed) return "border-gray-200";

    switch (color) {
      case "blue":
        return "border-blue-200";
      case "green":
        return "border-green-200";
      case "yellow":
        return "border-yellow-200";
      case "red":
        return "border-red-200";
      default:
        return "border-gray-200";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-blue-600" />
          Cronología del Trabajo
        </h3>

        {/* Resumen de estado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {timelineEvents.filter((e) => e.completed).length}
            </p>
            <p className="text-sm text-gray-600">Eventos Completados</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">
              {timelineEvents.filter((e) => !e.completed).length}
            </p>
            <p className="text-sm text-gray-600">Pendientes</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {Math.round(
                (timelineEvents.filter((e) => e.completed).length /
                  timelineEvents.length) *
                  100
              )}
              %
            </p>
            <p className="text-sm text-gray-600">Progreso</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <div className="relative">
          {/* Línea de tiempo */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Eventos */}
          <div className="space-y-4 sm:space-y-6">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              const isLast = index === timelineEvents.length - 1;

              return (
                <div
                  key={event.id}
                  className="relative flex items-start space-x-4"
                >
                  {/* Icono del evento */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${getBorderColor(
                      event.color,
                      event.completed
                    )} ${getColorClasses(event.color, event.completed)}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Contenido del evento */}
                  <div
                    className={`flex-1 min-w-0 pb-6 ${
                      !isLast ? "border-b border-gray-200" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4
                        className={`text-lg font-semibold ${
                          event.completed ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {event.title}
                      </h4>
                      {event.date && (
                        <span className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-sm ${
                        event.completed ? "text-gray-700" : "text-gray-500"
                      }`}
                    >
                      {event.description}
                    </p>

                    {/* Estado del evento */}
                    <div className="mt-2">
                      {event.completed ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Completado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                          Pendiente
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Información Adicional
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Duración estimada */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              Duración Estimada
            </h4>
            <p className="text-2xl font-bold text-blue-600">4-6 horas</p>
            <p className="text-sm text-gray-600">
              Basado en trabajos similares
            </p>
          </div>

          {/* Tiempo transcurrido */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              Tiempo Transcurrido
            </h4>
            <p className="text-2xl font-bold text-green-600">
              {trabajo.fechaInicioReal && trabajo.fechaFinReal
                ? `${Math.round(
                    (new Date(trabajo.fechaFinReal).getTime() -
                      new Date(trabajo.fechaInicioReal).getTime()) /
                      (1000 * 60 * 60)
                  )}h`
                : "N/A"}
            </p>
            <p className="text-sm text-gray-600">Tiempo real de ejecución</p>
          </div>

          {/* Próximo paso */}
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Próximo Paso</h4>
            <p className="text-lg font-semibold text-yellow-700">
              {trabajo.siguienteTipoPermiso
                ? `Solicitar permiso: ${trabajo.siguienteTipoPermiso}`
                : "Completar trabajo"}
            </p>
            <p className="text-sm text-gray-600">Acción requerida</p>
          </div>

          {/* Estado actual */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Estado Actual</h4>
            <p className="text-lg font-semibold text-purple-700 capitalize">
              {trabajo.estado}
            </p>
            <p className="text-sm text-gray-600">Estado del trabajo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
 