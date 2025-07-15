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

  // Obtener información del usuario desde el token JWT
  private getUserIdFromToken(token: string): string | null {
    try {
      // Decodificar la parte payload del JWT (base64)
      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.sub || null; // 'sub' contiene el ID del usuario
    } catch (error) {
      console.error("Error al decodificar token:", error);
      return null;
    }
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

      // Verificar si el token es válido antes de hacer la petición
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = payload.exp * 1000; // Convertir a milisegundos
        const currentTime = Date.now();

        if (currentTime > expirationTime) {
          console.log("Token expirado, limpiando datos de sesión");
          this.logout();
          throw new Error("TOKEN_EXPIRED");
        }
      } catch (tokenError) {
        console.error("Error al verificar token:", tokenError);
        this.logout();
        throw new Error("TOKEN_INVALID");
      }

      // Primero intentar el nuevo endpoint /users/profile
      try {
        const response = await fetch(`${API_URL}/users/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const user = await response.json();
          if (this.isClient()) {
            localStorage.setItem("user", JSON.stringify(user));
          }
          return user;
        }

        // Si el endpoint /users/profile no existe (404), usar método alternativo
        if (response.status === 404) {
          console.log(
            "Endpoint /users/profile no disponible, usando método alternativo"
          );
          throw new Error("ENDPOINT_NOT_FOUND");
        }

        // Para otros errores, manejar normalmente
        if (response.status === 500) {
          throw new Error("SERVER_ERROR");
        }

        if (response.status === 401 || response.status === 403) {
          console.log("Token inválido, limpiando datos de sesión");
          this.logout();
          throw new Error("TOKEN_INVALID");
        }

        throw new Error(`Error al obtener perfil: ${response.status}`);
      } catch (profileError) {
        // Si el endpoint no existe, usar método alternativo con el ID del token
        if (
          profileError instanceof Error &&
          profileError.message === "ENDPOINT_NOT_FOUND"
        ) {
          console.log("Usando método alternativo: GET /users/:id");

          const userId = this.getUserIdFromToken(token);
          if (!userId) {
            throw new Error("No se pudo obtener ID del usuario del token");
          }

          const response = await fetch(`${API_URL}/users/${userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error al obtener perfil (método alternativo):", {
              status: response.status,
              text: errorText,
            });

            if (response.status === 500) {
              throw new Error("SERVER_ERROR");
            }

            if (response.status === 401 || response.status === 403) {
              console.log("Token inválido, limpiando datos de sesión");
              this.logout();
              throw new Error("TOKEN_INVALID");
            }

            throw new Error(`Error al obtener perfil: ${response.status}`);
          }

          const user = await response.json();
          if (this.isClient()) {
            localStorage.setItem("user", JSON.stringify(user));
          }
          return user;
        }

        // Re-lanzar otros errores
        throw profileError;
      }
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
