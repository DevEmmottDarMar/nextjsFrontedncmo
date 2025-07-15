"use client";

import React, { useState, useEffect } from "react";
import {
  PhotoIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface TrabajoImagesSectionProps {
  trabajoId: string;
}

export default function TrabajoImagesSection({
  trabajoId,
}: TrabajoImagesSectionProps) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    cargarImagenes();
  }, [trabajoId]);

  const cargarImagenes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://cmobackendnest-production.up.railway.app/images?trabajoId=${trabajoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error("Error al cargar imágenes:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (image: any) => {
    setSelectedImage(image);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedImage(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <PhotoIcon className="h-5 w-5 text-blue-600" />
            Galería de Imágenes
          </h3>
          <button
            onClick={cargarImagenes}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Actualizar
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{images.length}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {images.filter((img) => img.tipo === "antes").length}
            </p>
            <p className="text-sm text-gray-600">Antes</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {images.filter((img) => img.tipo === "despues").length}
            </p>
            <p className="text-sm text-gray-600">Después</p>
          </div>
        </div>
      </div>

      {/* Galería */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Cargando imágenes...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay imágenes
            </h3>
            <p className="text-gray-500">
              Este trabajo no tiene imágenes asociadas
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id || index}
                className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200"
                onClick={() => openLightbox(image)}
              >
                <img
                  src={image.url || image.imageUrl || ""}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e5e7eb'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E";
                  }}
                />

                {/* Overlay con información */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-center">
                    <MagnifyingGlassIcon className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Ver imagen</p>
                  </div>
                </div>

                {/* Badge de tipo */}
                {image.tipo && (
                  <div className="absolute top-2 left-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        image.tipo === "antes"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {image.tipo}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {showLightbox && selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <img
              src={selectedImage.url || selectedImage.imageUrl || ""}
              alt="Imagen ampliada"
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
              <p className="text-sm">
                {selectedImage.tipo && (
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                      selectedImage.tipo === "antes"
                        ? "bg-yellow-600"
                        : "bg-green-600"
                    }`}
                  >
                    {selectedImage.tipo}
                  </span>
                )}
                {selectedImage.descripcion || "Sin descripción"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
