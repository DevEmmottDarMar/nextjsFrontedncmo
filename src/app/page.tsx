"use client";

import { useState, useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import Dashboard from "@/components/Dashboard";
import { authService } from "@/services/authService";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

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
        if (token) {
          // Verificar que el token sea válido obteniendo el perfil
          await authService.getProfile();
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.warn("Error de autenticación:", error);
        // Si hay error, limpiar localStorage y mostrar login
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
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
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
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}
