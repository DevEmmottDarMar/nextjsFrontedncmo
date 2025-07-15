import { API_BASE_URL } from "../config/constants";

export interface TrabajoInicio {
  id: string;
  titulo: string;
  estado: string;
  estaAprobado: boolean;
  estaRechazado: boolean;
  motivoRechazo?: string;
  fechaSolicitud: string;
  comentarios?: string;
  tecnicoAsignado?: {
    id: string;
    nombre: string;
    email: string;
  };
  area?: {
    id: string;
    nombre: string;
  };
}

export interface IniciarTrabajoRequest {
  tecnicoId: string;
  fotoInicial: string;
  comentarios?: string;
}

export interface AprobarTrabajoRequest {
  supervisorId: string;
  aprobado: boolean;
  comentarios?: string;
}

class TrabajosService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // Obtener trabajos pendientes de aprobación
  async getTrabajosPendientesAprobacion(): Promise<TrabajoInicio[]> {
    try {
      const headers = await this.getAuthHeaders();
      const token = localStorage.getItem("token");

      console.log("🔍 Llamando a trabajos pendientes de aprobación...");
      console.log("🔑 Token presente:", !!token);
      console.log("🌐 URL:", `${API_BASE_URL}/trabajos/pendientes-aprobacion`);

      const response = await fetch(
        `${API_BASE_URL}/trabajos/pendientes-aprobacion`,
        {
          method: "GET",
          headers,
        }
      );

      console.log("📊 Response status:", response.status);
      console.log("📊 Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);

        if (response.status === 401) {
          throw new Error(
            "No autorizado. Verifica que hayas iniciado sesión correctamente."
          );
        } else if (response.status === 500) {
          throw new Error(
            "Error interno del servidor. Contacta al administrador."
          );
        } else {
          throw new Error(
            `Error del servidor: ${response.status} - ${errorText}`
          );
        }
      }

      const data = await response.json();
      console.log("✅ Datos recibidos:", data);
      return data;
    } catch (error) {
      console.error("❌ Error obteniendo trabajos pendientes:", error);
      throw error;
    }
  }

  // Obtener estado de aprobación de un trabajo
  async getEstadoAprobacion(trabajoId: string): Promise<TrabajoInicio> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/trabajos/${trabajoId}/estado-aprobacion`,
        {
          method: "GET",
          headers: await this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error obteniendo estado de aprobación:", error);
      throw error;
    }
  }

  // Aprobar o rechazar un trabajo
  async aprobarTrabajo(
    trabajoId: string,
    request: AprobarTrabajoRequest
  ): Promise<TrabajoInicio> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/trabajos/${trabajoId}/aprobar`,
        {
          method: "PATCH",
          headers: await this.getAuthHeaders(),
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error aprobando trabajo:", error);
      throw error;
    }
  }

  // Iniciar un trabajo (para técnicos)
  async iniciarTrabajo(
    trabajoId: string,
    request: IniciarTrabajoRequest
  ): Promise<TrabajoInicio> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/trabajos/${trabajoId}/iniciar`,
        {
          method: "POST",
          headers: await this.getAuthHeaders(),
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error iniciando trabajo:", error);
      throw error;
    }
  }
}

export const trabajosService = new TrabajosService();
