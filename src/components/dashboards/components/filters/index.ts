export { default as AdvancedFiltersPanel } from "./AdvancedFiltersPanel";
export { default as DateRangeFilter } from "./DateRangeFilter";
export { default as TechnicianFilter } from "./TechnicianFilter";
export { default as StatusFilter } from "./StatusFilter";
export { default as PriorityFilter } from "./PriorityFilter";
export { default as SearchFilter } from "./SearchFilter";

// Tipos comunes para los filtros
export interface FilterState {
  dateRange: {
    start: Date | null;
    end: Date | null;
    preset: string;
  };
  technicians: string[];
  statuses: string[];
  priorities: string[];
  search: {
    text: string;
    fields: string[];
  };
  showOverdue: boolean;
  showUnassigned: boolean;
  showWithImages: boolean;
}

// Función utilitaria para aplicar filtros
export const applyFilters = (trabajos: any[], filters: FilterState) => {
  return trabajos.filter((trabajo) => {
    // Filtro por fecha
    if (filters.dateRange.start || filters.dateRange.end) {
      const trabajoDate = new Date(
        trabajo.fechaProgramada || trabajo.fechaCreacion || trabajo.createdAt
      );
      if (filters.dateRange.start && trabajoDate < filters.dateRange.start)
        return false;
      if (filters.dateRange.end && trabajoDate > filters.dateRange.end)
        return false;
    }

    // Filtro por técnicos (por nombre)
    if (filters.technicians.length > 0) {
      const tecnicoNombre =
        trabajo.tecnicoAsignado?.nombre || trabajo.tecnico?.nombre;
      if (!tecnicoNombre || !filters.technicians.includes(tecnicoNombre))
        return false;
    }

    // Filtro por áreas (usando statuses para áreas)
    if (filters.statuses.length > 0) {
      const areaNombre = trabajo.area?.nombre;
      if (!areaNombre || !filters.statuses.includes(areaNombre)) return false;
    }

    // Filtro por prioridad (calculada dinámicamente)
    if (filters.priorities.length > 0) {
      let prioridadCalculada = "Baja";

      if (trabajo.estado === "pendiente" && trabajo.fechaProgramada) {
        const fechaProgramada = new Date(trabajo.fechaProgramada);
        const hoy = new Date();
        const diasDiferencia = Math.ceil(
          (fechaProgramada.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diasDiferencia < 0) {
          prioridadCalculada = "Crítica";
        } else if (diasDiferencia <= 2) {
          prioridadCalculada = "Alta";
        } else if (diasDiferencia <= 7) {
          prioridadCalculada = "Media";
        }
      }

      if (!filters.priorities.includes(prioridadCalculada)) return false;
    }

    // Filtro de búsqueda
    if (filters.search.text) {
      const searchText = filters.search.text.toLowerCase();
      const titulo = trabajo.titulo?.toLowerCase() || "";
      const descripcion = trabajo.descripcion?.toLowerCase() || "";
      const tecnico = trabajo.tecnicoAsignado?.nombre?.toLowerCase() || "";
      const area = trabajo.area?.nombre?.toLowerCase() || "";

      if (
        !titulo.includes(searchText) &&
        !descripcion.includes(searchText) &&
        !tecnico.includes(searchText) &&
        !area.includes(searchText)
      ) {
        return false;
      }
    }

    // Filtro de trabajos atrasados
    if (filters.showOverdue) {
      if (trabajo.estado === "completado") return false;
      const fechaProgramada = new Date(trabajo.fechaProgramada || "");
      const hoy = new Date();
      if (fechaProgramada >= hoy) return false;
    }

    // Filtro de trabajos sin asignar
    if (filters.showUnassigned) {
      if (trabajo.tecnicoAsignado?.nombre) return false;
    }

    // Filtro de trabajos con imágenes (simulado)
    if (filters.showWithImages) {
      if (!trabajo.descripcion || trabajo.descripcion.length < 10) return false;
    }

    return true;
  });
};
