"use client";

import { useState, useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import Dashboard from "@/components/Dashboard";
import { authService } from "@/services/authService";
import { useWebSocket } from "@/hooks/useWebSocket";
import NotificationManager from "@/components/NotificationManager";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Usar el hook principal de WebSocket que maneja todo
  const { isConnected, connectedUsers, lastMessage } = useWebSocket();

  useEffect(() => {
    // Marcar que el componente se ha montado (client-side)
    setIsMounted(true);

    // Verificar si el usuario está autenticado al cargar la página
    const checkAuth = async () => {
      try {
        // Solo verificar localStorage en el cliente
        if (typeof window === "undefined") {
          setIsLoading(false);
          return;
        }

        const token = authService.getToken();
        const user = authService.getUser();

        if (token && user) {
          try {
            // Intentar verificar que el token sea válido obteniendo el perfil
            await authService.getProfile();
            setIsAuthenticated(true);
            setServerError(null);
          } catch (profileError) {
            console.warn("Error al verificar perfil:", profileError);

            // Si es error del servidor (500), mantener la sesión pero mostrar error
            if (
              profileError instanceof Error &&
              profileError.message === "SERVER_ERROR"
            ) {
              setIsAuthenticated(true); // Mantener autenticado
              setServerError(
                "El servidor está experimentando problemas. Reintenta en unos momentos."
              );
              console.log(
                "Error del servidor detectado, manteniendo sesión activa"
              );
            }
            // Si es error de token inválido, cerrar sesión
            else if (
              profileError instanceof Error &&
              profileError.message === "TOKEN_INVALID"
            ) {
              console.log("Token inválido, cerrando sesión");
              authService.logout();
              setIsAuthenticated(false);
              setServerError(null);
            }
            // Para otros errores, usar el usuario del localStorage
            else {
              console.log(
                "Usando datos del localStorage debido a error de red"
              );
              setIsAuthenticated(true);
              setServerError(
                "No se pudo verificar con el servidor. Usando datos guardados."
              );
            }
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.warn("Error de autenticación:", error);
        // Solo limpiar si es un error crítico
        authService.logout();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setServerError(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setServerError(null);
  };

  const handleRetryConnection = async () => {
    setServerError(null);
    try {
      await authService.getProfile();
      setServerError(null);
    } catch (error) {
      if (error instanceof Error && error.message === "SERVER_ERROR") {
        setServerError(
          "El servidor sigue experimentando problemas. Reintenta más tarde."
        );
      } else {
        setServerError("Error de conexión. Verifica tu red.");
      }
    }
  };

  // Evitar hidratación hasta que el componente esté montado
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-600">
            Cargando CMO Dashboard...
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de carga mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-600">
            Verificando sesión...
          </div>
        </div>
      </div>
    );
  }

  // Mostrar login o dashboard según el estado de autenticación
  return (
    <>
      {serverError && isAuthenticated && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-100 border-b border-yellow-300 px-4 py-3 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-yellow-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span className="text-yellow-800 font-medium">{serverError}</span>
            </div>
            <button
              onClick={handleRetryConnection}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      <div className={serverError && isAuthenticated ? "pt-16" : ""}>
        {isAuthenticated ? (
          <Dashboard onLogout={handleLogout} />
        ) : (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        )}
      </div>

      {/* Las notificaciones se manejan en el Dashboard */}
    </>
  );
}
