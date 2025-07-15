"use client";

import React, { useState } from "react";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

interface TrabajoActionsSectionProps {
  trabajo: any;
  onRefresh: () => void;
}

export default function TrabajoActionsSection({
  trabajo,
  onRefresh,
}: TrabajoActionsSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const handleAction = async (action: string) => {
    setIsLoading(true);
    setActionMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://cmobackendnest-production.up.railway.app/trabajos/${trabajo.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado:
              action === "completar"
                ? "completado"
                : action === "cancelar"
                ? "cancelado"
                : action === "reiniciar"
                ? "pendiente"
                : trabajo.estado,
            fechaFinReal:
              action === "completar" ? new Date().toISOString() : undefined,
            fechaInicioReal:
              action === "reiniciar" ? new Date().toISOString() : undefined,
          }),
        }
      );

      if (response.ok) {
        setActionMessage(`Acción "${action}" ejecutada correctamente`);
        onRefresh();
      } else {
        setActionMessage("Error al ejecutar la acción");
      }
    } catch (error) {
      console.error("Error:", error);
      setActionMessage("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const actions = [
    {
      id: "completar",
      title: "Marcar como Completado",
      description: "Finalizar el trabajo y marcar como completado",
      icon: CheckCircleIcon,
      color: "green",
      disabled:
        trabajo.estado === "completado" || trabajo.estado === "cancelado",
    },
    {
      id: "cancelar",
      title: "Cancelar Trabajo",
      description: "Cancelar el trabajo y marcar como no realizado",
      icon: XCircleIcon,
      color: "red",
      disabled:
        trabajo.estado === "completado" || trabajo.estado === "cancelado",
    },
    {
      id: "reiniciar",
      title: "Reiniciar Trabajo",
      description: "Reiniciar el trabajo desde el estado pendiente",
      icon: ArrowPathIcon,
      color: "blue",
      disabled: trabajo.estado === "pendiente",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-50 border-green-200 text-green-800 hover:bg-green-100";
      case "red":
        return "bg-red-50 border-red-200 text-red-800 hover:bg-red-100";
      case "blue":
        return "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100";
      case "yellow":
        return "bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Acciones principales */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-blue-600" />
          Acciones del Trabajo
        </h3>

        {/* Mensaje de estado */}
        {actionMessage && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              actionMessage.includes("Error")
                ? "bg-red-50 border border-red-200 text-red-800"
                : "bg-green-50 border border-green-200 text-green-800"
            }`}
          >
            {actionMessage}
          </div>
        )}

        {/* Botones de acción */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                disabled={action.disabled || isLoading}
                className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 disabled:opacity-50 disabled:cursor-not-allowed ${getColorClasses(
                  action.color
                )}`}
              >
                <Icon className="h-8 w-8" />
                <div className="text-center">
                  <p className="font-semibold">{action.title}</p>
                  <p className="text-sm opacity-75">{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Acciones secundarias */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Acciones Secundarias
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Duplicar trabajo */}
          <button className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <DocumentDuplicateIcon className="h-6 w-6 text-gray-600" />
              <div>
                <p className="font-semibold text-gray-900">Duplicar Trabajo</p>
                <p className="text-sm text-gray-600">
                  Crear una copia de este trabajo
                </p>
              </div>
            </div>
          </button>

          {/* Compartir trabajo */}
          <button className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <ShareIcon className="h-6 w-6 text-gray-600" />
              <div>
                <p className="font-semibold text-gray-900">Compartir</p>
                <p className="text-sm text-gray-600">
                  Compartir información del trabajo
                </p>
              </div>
            </div>
          </button>

          {/* Eliminar trabajo */}
          <button className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <TrashIcon className="h-6 w-6 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Eliminar Trabajo</p>
                <p className="text-sm text-red-600">Eliminar permanentemente</p>
              </div>
            </div>
          </button>

          {/* Exportar datos */}
          <button className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <DocumentDuplicateIcon className="h-6 w-6 text-gray-600" />
              <div>
                <p className="font-semibold text-gray-900">Exportar Datos</p>
                <p className="text-sm text-gray-600">
                  Exportar información en PDF
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Información de auditoría */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Información de Auditoría
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Creado por:</span>
              <span className="text-sm font-medium text-gray-900">Sistema</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Fecha de creación:</span>
              <span className="text-sm font-medium text-gray-900">
                {trabajo.createdAt
                  ? new Date(trabajo.createdAt).toLocaleString("es-ES")
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                Última modificación:
              </span>
              <span className="text-sm font-medium text-gray-900">
                {trabajo.updatedAt
                  ? new Date(trabajo.updatedAt).toLocaleString("es-ES")
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">ID del trabajo:</span>
              <span className="text-sm font-mono text-gray-900">
                {trabajo.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Versión:</span>
              <span className="text-sm font-medium text-gray-900">1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                Estado de sincronización:
              </span>
              <span className="text-sm font-medium text-green-600">
                Sincronizado
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 