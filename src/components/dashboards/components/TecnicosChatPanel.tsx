"use client";

import { useState } from "react";
import { UsersIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface TecnicosChatPanelProps {
  tecnicosConectados: any[];
}

export default function TecnicosChatPanel({ tecnicosConectados }: TecnicosChatPanelProps) {
  const [minimized, setMinimized] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-w-full">
      <div className="bg-white rounded-t-lg shadow-lg border border-gray-200">
        <div className="flex items-center justify-between px-4 py-2 bg-blue-600 rounded-t-lg cursor-pointer" onClick={() => setMinimized((m) => !m)}>
          <div className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-white" />
            <span className="text-white font-semibold">Técnicos conectados</span>
            <span className="ml-2 text-xs bg-white text-blue-600 rounded-full px-2 py-0.5 font-bold">{tecnicosConectados.length}</span>
          </div>
          {minimized ? (
            <ChevronUpIcon className="h-5 w-5 text-white" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-white" />
          )}
        </div>
        {!minimized && (
          <div className="max-h-72 overflow-y-auto p-2 bg-white">
            {tecnicosConectados.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-sm">
                <UsersIcon className="h-8 w-8 mx-auto mb-2 text-gray-200" />
                No hay técnicos conectados
              </div>
            ) : (
              <ul className="space-y-2">
                {tecnicosConectados.map((t) => (
                  <li key={t.userId || t.id} className="flex items-center gap-3 p-2 rounded hover:bg-blue-50 transition-colors">
                    <div className="relative">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <UsersIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{t.nombre}</div>
                      <div className="text-xs text-gray-500 truncate">{t.email}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 