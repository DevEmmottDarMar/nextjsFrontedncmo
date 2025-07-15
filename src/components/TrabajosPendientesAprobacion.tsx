"use client";

import React, { useState, useEffect } from "react";
import {
  trabajosService,
  TrabajoInicio,
  AprobarTrabajoRequest,
} from "../services/trabajosService";
import { NOTIFICATION_TYPES } from "../config/constants";

interface TrabajosPendientesAprobacionProps {
  onTrabajoAprobado?: (trabajoId: string) => void;
  onTrabajoRechazado?: (trabajoId: string) => void;
}

export default function TrabajosPendientesAprobacion({
  onTrabajoAprobado,
  onTrabajoRechazado,
}: TrabajosPendientesAprobacionProps) {
  const [trabajos, setTrabajos] = useState<TrabajoInicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aprobarLoading, setAprobarLoading] = useState<string | null>(null);

  useEffect(() => {
    loadTrabajos();
  }, []);

  const loadTrabajos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trabajosService.getTrabajosPendientesAprobacion();
      setTrabajos(data);
    } catch (err) {
      setError("Error al cargar trabajos pendientes");
      console.error("Error loading trabajos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAprobarTrabajo = async (
    trabajo: TrabajoInicio,
    aprobado: boolean
  ) => {
    try {
      setAprobarLoading(trabajo.id);

      const supervisorId = localStorage.getItem("userId");
      if (!supervisorId) {
        throw new Error("No se pudo identificar al supervisor");
      }

      const request: AprobarTrabajoRequest = {
        supervisorId,
        aprobado,
        comentarios: aprobado
          ? "Trabajo aprobado por supervisor"
          : "Trabajo rechazado por supervisor",
      };

      await trabajosService.aprobarTrabajo(trabajo.id, request);

      // Remover trabajo de la lista
      setTrabajos((prev) => prev.filter((t) => t.id !== trabajo.id));

      // Llamar callbacks
      if (aprobado) {
        onTrabajoAprobado?.(trabajo.id);
      } else {
        onTrabajoRechazado?.(trabajo.id);
      }

      // Mostrar notificación
      const mensaje = aprobado
        ? "Trabajo aprobado exitosamente"
        : "Trabajo rechazado exitosamente";
      alert(mensaje); // TODO: Usar sistema de notificaciones
    } catch (err) {
      console.error("Error aprobando trabajo:", err);
      alert("Error al procesar la solicitud");
    } finally {
      setAprobarLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Cargando trabajos pendientes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={loadTrabajos}
                className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (trabajos.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No hay trabajos pendientes
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          No hay trabajos esperando aprobación en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Trabajos Pendientes de Aprobación ({trabajos.length})
        </h2>
        <button
          onClick={loadTrabajos}
          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700"
        >
          Actualizar
        </button>
      </div>

      <div className="grid gap-4">
        {trabajos.map((trabajo) => (
          <div
            key={trabajo.id}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {trabajo.titulo || "Trabajo sin título"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Técnico</p>
                    <p className="text-sm font-medium text-gray-900">
                      {trabajo.tecnicoAsignado?.nombre || "No asignado"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Área</p>
                    <p className="text-sm font-medium text-gray-900">
                      {trabajo.area?.nombre || "No especificada"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Fecha de Solicitud</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(trabajo.fechaSolicitud)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pendiente de Aprobación
                    </span>
                  </div>
                </div>

                {trabajo.comentarios && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Comentarios del Técnico
                    </p>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                      {trabajo.comentarios}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleAprobarTrabajo(trabajo, false)}
                disabled={aprobarLoading === trabajo.id}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aprobarLoading === trabajo.id ? "Procesando..." : "Rechazar"}
              </button>

              <button
                onClick={() => handleAprobarTrabajo(trabajo, true)}
                disabled={aprobarLoading === trabajo.id}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aprobarLoading === trabajo.id ? "Procesando..." : "Aprobar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
