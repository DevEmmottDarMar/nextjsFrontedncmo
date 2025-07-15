"use client";

import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  PencilIcon,
  CheckIcon,
  XCircleIcon,
  UserIcon,
  ClockIcon,
  PhotoIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

// Componentes modulares
import TrabajoInfoSection from "./trabajo-detail/TrabajoInfoSection";
import TrabajoStatusSection from "./trabajo-detail/TrabajoStatusSection";
import TrabajoTechnicianSection from "./trabajo-detail/TrabajoTechnicianSection";
import TrabajoImagesSection from "./trabajo-detail/TrabajoImagesSection";
import TrabajoCommentsSection from "./trabajo-detail/TrabajoCommentsSection";
import TrabajoTimelineSection from "./trabajo-detail/TrabajoTimelineSection";
import TrabajoActionsSection from "./trabajo-detail/TrabajoActionsSection";

interface Trabajo {
  id: string;
  titulo?: string;
  descripcion?: string;
  estado: string;
  fechaProgramada?: string;
  fechaInicioReal?: string;
  fechaFinReal?: string;
  tecnicoAsignado?: {
    id?: string;
    nombre?: string;
    email?: string;
  };
  area?: {
    id?: string;
    nombre?: string;
  };
  comentarios?: string;
  siguienteTipoPermiso?: string;
}

interface TrabajoDetailModalProps {
  trabajo: Trabajo | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (trabajoId: string, updates: any) => Promise<void>;
  onRefresh: () => void;
}

export default function TrabajoDetailModal({
  trabajo,
  isOpen,
  onClose,
  onUpdate,
  onRefresh,
}: TrabajoDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrabajo, setEditedTrabajo] = useState<Trabajo | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  // Inicializar datos editables cuando se abre el modal
  useEffect(() => {
    if (trabajo) {
      setEditedTrabajo({ ...trabajo });
      setIsEditing(false);
    }
  }, [trabajo]);

  // Tabs disponibles
  const tabs = [
    { id: "info", name: "Información", icon: DocumentTextIcon },
    { id: "status", name: "Estado", icon: CheckCircleIcon },
    { id: "technician", name: "Técnico", icon: UserIcon },
    { id: "images", name: "Imágenes", icon: PhotoIcon },
    { id: "comments", name: "Comentarios", icon: ChatBubbleLeftIcon },
    { id: "timeline", name: "Cronología", icon: ClockIcon },
    { id: "actions", name: "Acciones", icon: ExclamationTriangleIcon },
  ];

  // Guardar cambios
  const handleSave = async () => {
    if (!editedTrabajo || !trabajo) return;

    setIsSaving(true);
    try {
      await onUpdate(trabajo.id, editedTrabajo);
      setIsEditing(false);
      onRefresh();
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditedTrabajo(trabajo ? { ...trabajo } : null);
    setIsEditing(false);
  };

  // Actualizar campo editable
  const handleFieldChange = (field: keyof Trabajo, value: any) => {
    if (!editedTrabajo) return;
    setEditedTrabajo({ ...editedTrabajo, [field]: value });
  };

  if (!isOpen || !trabajo) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <DocumentTextIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                    {isEditing
                      ? "Editando Trabajo"
                      : trabajo.titulo || "Detalle del Trabajo"}
                  </h2>
                  <p className="text-blue-100 text-sm truncate">
                    ID: {trabajo.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="p-1.5 sm:p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50"
                      title="Guardar cambios"
                    >
                      <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                      title="Cancelar edición"
                    >
                      <XCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    title="Editar trabajo"
                  >
                    <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title="Cerrar"
                >
                  <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="flex space-x-1 p-2 sm:p-4 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="p-3 sm:p-4 lg:p-6">
              {activeTab === "info" && (
                <TrabajoInfoSection
                  trabajo={isEditing ? editedTrabajo! : trabajo}
                  isEditing={isEditing}
                  onFieldChange={handleFieldChange}
                />
              )}

              {activeTab === "status" && (
                <TrabajoStatusSection
                  trabajo={isEditing ? editedTrabajo! : trabajo}
                  isEditing={isEditing}
                  onFieldChange={handleFieldChange}
                />
              )}

              {activeTab === "technician" && (
                <TrabajoTechnicianSection
                  trabajo={isEditing ? editedTrabajo! : trabajo}
                  isEditing={isEditing}
                  onFieldChange={handleFieldChange}
                />
              )}

              {activeTab === "images" && (
                <TrabajoImagesSection trabajoId={trabajo.id} />
              )}

              {activeTab === "comments" && (
                <TrabajoCommentsSection
                  trabajo={isEditing ? editedTrabajo! : trabajo}
                  isEditing={isEditing}
                  onFieldChange={handleFieldChange}
                />
              )}

              {activeTab === "timeline" && (
                <TrabajoTimelineSection trabajo={trabajo} />
              )}

              {activeTab === "actions" && (
                <TrabajoActionsSection
                  trabajo={trabajo}
                  onRefresh={onRefresh}
                />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-2 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs sm:text-sm text-gray-600">
                Última actualización: {new Date().toLocaleString()}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onRefresh}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                >
                  <ArrowPathIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Actualizar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
