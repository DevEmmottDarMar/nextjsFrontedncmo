"use client";

import React, { useState, useEffect } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

interface TrabajoTechnicianSectionProps {
  trabajo: any;
  isEditing: boolean;
  onFieldChange: (field: string, value: any) => void;
}

export default function TrabajoTechnicianSection({
  trabajo,
  isEditing,
  onFieldChange,
}: TrabajoTechnicianSectionProps) {
  const [tecnicosDisponibles, setTecnicosDisponibles] = useState<any[]>([]);
  const [loadingTecnicos, setLoadingTecnicos] = useState(false);

  // Cargar técnicos disponibles
  useEffect(() => {
    if (isEditing) {
      cargarTecnicosDisponibles();
    }
  }, [isEditing]);

  const cargarTecnicosDisponibles = async () => {
    setLoadingTecnicos(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://cmobackendnest-production.up.railway.app/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Filtrar solo técnicos
        const tecnicos = data.filter(
          (user: any) =>
            user.role?.nombre?.toLowerCase() === "tecnico" ||
            user.rol?.toLowerCase() === "tecnico"
        );
        setTecnicosDisponibles(tecnicos);
      }
    } catch (error) {
      console.error("Error al cargar técnicos:", error);
    } finally {
      setLoadingTecnicos(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Técnico asignado actual */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-blue-600" />
          Técnico Asignado
        </h3>

        {trabajo.tecnicoAsignado ? (
          <div className="space-y-4">
            {/* Información del técnico */}
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">
                  {trabajo.tecnicoAsignado.nombre || "Sin nombre"}
                </h4>
                <p className="text-gray-600 flex items-center gap-2">
                  <EnvelopeIcon className="h-4 w-4" />
                  {trabajo.tecnicoAsignado.email || "Sin email"}
                </p>
              </div>
            </div>

            {/* Detalles del técnico */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  ID del Técnico
                </p>
                <p className="text-gray-900 font-mono text-sm">
                  {trabajo.tecnicoAsignado.id || "No disponible"}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Estado</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Asignado
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay técnico asignado</p>
          </div>
        )}

        {/* Selector de técnico (solo en modo edición) */}
        {isEditing && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-gray-900 mb-3">
              Cambiar Técnico Asignado
            </h4>

            {loadingTecnicos ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Cargando técnicos...</p>
              </div>
            ) : (
              <select
                value={trabajo.tecnicoAsignadoId || ""}
                onChange={(e) =>
                  onFieldChange("tecnicoAsignadoId", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar técnico</option>
                {tecnicosDisponibles.map((tecnico) => (
                  <option key={tecnico.id} value={tecnico.id}>
                    {tecnico.nombre} ({tecnico.email})
                  </option>
                ))}
              </select>
            )}

            <p className="text-sm text-gray-600 mt-2">
              Selecciona un técnico para asignar a este trabajo
            </p>
          </div>
        )}
      </div>

      {/* Información de contacto */}
      {trabajo.tecnicoAsignado && (
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información de Contacto
          </h3>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-gray-900">
                  {trabajo.tecnicoAsignado.email || "No disponible"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Teléfono</p>
                <p className="text-gray-900">
                  {trabajo.tecnicoAsignado.telefono || "No disponible"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Ubicación</p>
                <p className="text-gray-900">
                  {trabajo.tecnicoAsignado.ubicacion || "No disponible"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas del técnico */}
      {trabajo.tecnicoAsignado && (
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estadísticas del Técnico
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-600">Trabajos Activos</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">0</p>
              <p className="text-sm text-gray-600">Completados</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">0</p>
              <p className="text-sm text-gray-600">Pendientes</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">0</p>
              <p className="text-sm text-gray-600">Promedio</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
