const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://cmobackendnest-production.up.railway.app";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: "admin" | "supervisor" | "técnico" | "planificador";
  activo: boolean;
  area?: {
    id: number;
    nombre: string;
  };
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

class AuthService {
  // Verificar si estamos en el cliente
  private isClient(): boolean {
    return typeof window !== "undefined";
  }

  // Login del usuario
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log("Intentando login con:", {
        email: credentials.email,
        apiUrl: API_URL,
      });

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const responseText = await response.text();
      console.log("Respuesta del servidor:", {
        status: response.status,
        text: responseText,
      });

      if (!response.ok) {
        let errorMessage = "Error en el login";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Error ${response.status}: ${
            responseText || "Error de conexión"
          }`;
        }
        throw new Error(errorMessage);
      }

      const data = JSON.parse(responseText);

      // Guardar token en localStorage solo en el cliente
      if (data.access_token && this.isClient()) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("Login exitoso, datos guardados");
      }

      return data;
    } catch (error) {
      console.error("Error en login:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "No se puede conectar al servidor. Verifica tu conexión a internet."
        );
      }
      throw error;
    }
  }

  // Obtener perfil del usuario
  async getProfile(): Promise<User> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      console.log(
        "Obteniendo perfil con token:",
        token.substring(0, 20) + "..."
      );

      const response = await fetch(`${API_URL}/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al obtener perfil:", {
          status: response.status,
          text: errorText,
        });
        throw new Error(`Error al obtener perfil: ${response.status}`);
      }

      const user = await response.json();
      if (this.isClient()) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      return user;
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      throw error;
    }
  }

  // Obtener token del localStorage
  getToken(): string | null {
    if (!this.isClient()) {
      return null;
    }
    try {
      return localStorage.getItem("token");
    } catch (error) {
      console.error("Error al obtener token:", error);
      return null;
    }
  }

  // Obtener usuario del localStorage
  getUser(): User | null {
    if (!this.isClient()) {
      return null;
    }
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      return null;
    }
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Logout
  logout(): void {
    if (this.isClient()) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.log("Logout completado");
      } catch (error) {
        console.error("Error en logout:", error);
      }
    }
  }

  // Headers para requests autenticados
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }
}

export const authService = new AuthService();
