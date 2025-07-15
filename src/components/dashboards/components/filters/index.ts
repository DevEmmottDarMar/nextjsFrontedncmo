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
      const trabajoDate = new Date(trabajo.fechaCreacion || trabajo.createdAt);
      if (filters.dateRange.start && trabajoDate < filters.dateRange.start)
        return false;
      if (filters.dateRange.end && trabajoDate > filters.dateRange.end)
        return false;
    }

    // Filtro por técnicos
    if (filters.technicians.length > 0) {
      const tecnicoId = trabajo.tecnico?.id || trabajo.tecnicoId;
      if (!filters.technicians.includes(tecnicoId)) return false;
    }

    // Filtro por estados
    if (filters.statuses.length > 0) {
      const estado =
        trabajo.estado?.toLowerCase() || trabajo.status?.toLowerCase();
      if (!filters.statuses.includes(estado)) return false;
    }

    // Filtro por prioridad
    if (filters.priorities.length > 0) {
      const prioridad =
        trabajo.prioridad?.toLowerCase() || trabajo.priority?.toLowerCase();
      if (!filters.priorities.includes(prioridad)) return false;
    }

    // Filtro de búsqueda
    if (filters.search.text && filters.search.fields.length > 0) {
      const searchText = filters.search.text.toLowerCase();
      const hasMatch = filters.search.fields.some((field) => {
        const fieldValue = trabajo[field]?.toString().toLowerCase() || "";
        return fieldValue.includes(searchText);
      });
      if (!hasMatch) return false;
    }

    // Filtro de trabajos atrasados
    if (filters.showOverdue) {
      const fechaLimite = new Date(trabajo.fechaLimite || trabajo.dueDate);
      if (fechaLimite > new Date()) return false;
    }

    // Filtro de trabajos sin asignar
    if (filters.showUnassigned) {
      if (trabajo.tecnico || trabajo.tecnicoId) return false;
    }

    // Filtro de trabajos con imágenes
    if (filters.showWithImages) {
      if (!trabajo.imagenes || trabajo.imagenes.length === 0) return false;
    }

    return true;
  });
};
