"use client";

import { useState } from "react";
import { CalendarIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface DateRangeFilterProps {
  value: {
    start: Date | null;
    end: Date | null;
    preset: string;
  };
  onChange: (dateRange: {
    start: Date | null;
    end: Date | null;
    preset: string;
  }) => void;
}

const datePresets = [
  { id: "today", name: "Hoy", days: 0 },
  { id: "yesterday", name: "Ayer", days: -1 },
  { id: "last7days", name: "Últimos 7 días", days: -7 },
  { id: "last30days", name: "Últimos 30 días", days: -30 },
  { id: "last90days", name: "Últimos 90 días", days: -90 },
  { id: "thisWeek", name: "Esta semana", days: -7 },
  { id: "thisMonth", name: "Este mes", days: -30 },
  { id: "overdue", name: "Vencidos", days: -999 },
];

export default function DateRangeFilter({
  value,
  onChange,
}: DateRangeFilterProps) {
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");

  const applyPreset = (preset: string) => {
    const today = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    switch (preset) {
      case "today":
        start = new Date(today);
        end = new Date(today);
        break;
      case "yesterday":
        start = new Date(today);
        start.setDate(start.getDate() - 1);
        end = new Date(start);
        break;
      case "last7days":
        start = new Date(today);
        start.setDate(start.getDate() - 7);
        end = new Date(today);
        break;
      case "last30days":
        start = new Date(today);
        start.setDate(start.getDate() - 30);
        end = new Date(today);
        break;
      case "last90days":
        start = new Date(today);
        start.setDate(start.getDate() - 90);
        end = new Date(today);
        break;
      case "thisWeek":
        start = new Date(today);
        start.setDate(start.getDate() - start.getDay());
        end = new Date(today);
        end.setDate(end.getDate() + (6 - end.getDay()));
        break;
      case "thisMonth":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "overdue":
        start = new Date(2000, 0, 1); // Fecha muy antigua
        end = new Date(today);
        end.setDate(end.getDate() - 1);
        break;
      case "custom":
        if (customStart && customEnd) {
          start = new Date(customStart);
          end = new Date(customEnd);
        }
        break;
    }

    onChange({ start, end, preset });
  };

  const clearDates = () => {
    onChange({ start: null, end: null, preset: "" });
    setCustomStart("");
    setCustomEnd("");
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Filtro por Fechas
        </h3>

        {/* Presets rápidos */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Presets Rápidos</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {datePresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  value.preset === preset.id
                    ? "bg-blue-100 border-blue-300 text-blue-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Fechas personalizadas */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">
            Rango Personalizado
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de inicio
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de fin
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => applyPreset("custom")}
              disabled={!customStart || !customEnd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Aplicar Rango
            </button>
            <button
              onClick={clearDates}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Fechas seleccionadas */}
        {(value.start || value.end) && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              Rango Seleccionado
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Desde: {formatDate(value.start)}</span>
              <span>•</span>
              <span>Hasta: {formatDate(value.end)}</span>
              {value.preset && (
                <>
                  <span>•</span>
                  <span className="text-blue-600 font-medium">
                    {datePresets.find((p) => p.id === value.preset)?.name}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
