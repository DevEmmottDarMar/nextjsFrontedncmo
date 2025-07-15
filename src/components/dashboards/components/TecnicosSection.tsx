"use client";

import { UsersIcon } from "@heroicons/react/24/outline";

interface TecnicosSectionProps {
  tecnicosConectados: any[];
}

export default function TecnicosSection({
  tecnicosConectados,
}: TecnicosSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Técnicos Conectados</h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">
            {tecnicosConectados.length} conectado
            {tecnicosConectados.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {tecnicosConectados.length === 0 ? (
        <div className="text-center py-8">
          <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No hay técnicos conectados</p>
          <p className="text-gray-400 text-sm mt-2">
            Los técnicos aparecerán aquí cuando se conecten desde sus
            dispositivos móviles
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tecnicosConectados.map((t) => (
            <div
              key={t.userId || t.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <UsersIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t.nombre}</h3>
                    <p className="text-sm text-gray-600">{t.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Área: {t.area?.nombre || "Sin área asignada"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                    Conectado
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Técnico</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
