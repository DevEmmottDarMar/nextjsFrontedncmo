# CMO Dashboard - Frontend

Sistema de gestión de permisos de trabajo con dashboards específicos por rol de usuario. Aplicación web desarrollada en Next.js 15 con TypeScript, Tailwind CSS y comunicación en tiempo real via WebSockets.

## 🚀 Características Principales

### 🔐 Sistema de Autenticación

- Login con JWT tokens
- Manejo de sesiones persistentes
- Verificación automática de tokens
- Logout seguro
- Manejo de errores de servidor y reconexión automática

### 👥 Dashboards por Rol

- **Admin**: Gestión completa del sistema, usuarios y configuraciones
- **Supervisor**: Autorización de permisos, supervisión de técnicos conectados
- **Planificador**: Creación de trabajos, asignación de recursos y planificación
- **Técnico**: Visualización de órdenes de trabajo y actualización de estados

### 🔔 Sistema de Notificaciones

- Notificaciones en tiempo real via WebSockets
- Notificaciones nativas del navegador
- Gestión de estados de notificaciones
- Indicadores visuales de conexión

### 🌐 Comunicación en Tiempo Real

- WebSocket para comunicación bidireccional
- Lista de usuarios conectados en tiempo real
- Reconexión automática en caso de pérdida de conexión
- Manejo robusto de errores de conexión

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **Iconos**: Heroicons React
- **Comunicación**: WebSockets nativos
- **Autenticación**: JWT tokens
- **Estado**: React Hooks (useState, useEffect, custom hooks)

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal con lógica de autenticación
├── components/            # Componentes React
│   ├── dashboards/        # Dashboards específicos por rol
│   │   ├── AdminDashboard.tsx
│   │   ├── SupervisorDashboard.tsx
│   │   ├── PlanificadorDashboard.tsx
│   │   └── TecnicoDashboard.tsx
│   ├── Dashboard.tsx      # Dashboard principal con header
│   ├── DashboardLayout.tsx # Layout común para dashboards
│   ├── LoginForm.tsx      # Formulario de login
│   ├── NotificationBar.tsx # Barra de notificaciones
│   ├── NotificationContainer.tsx # Contenedor de notificaciones
│   ├── NotificationManager.tsx # Gestor de notificaciones
│   ├── NotificationToast.tsx # Toast de notificaciones
│   ├── WebSocketDebug.tsx # Debug de WebSocket
│   └── WebSocketStatus.tsx # Estado de conexión WebSocket
├── hooks/                 # Custom React Hooks
│   ├── useNotifications.ts # Hook para manejo de notificaciones
│   ├── useWebSocket.ts    # Hook principal de WebSocket
│   └── useWebSocketSimple.ts # Hook simplificado de WebSocket
└── services/              # Servicios y utilidades
    └── authService.ts     # Servicio de autenticación
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm, yarn, pnpm o bun

### 1. Instalar dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` basado en `env-template.txt`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

Para producción:

```env
NEXT_PUBLIC_API_URL=https://cmobackendnest-production.up.railway.app
NEXT_PUBLIC_WS_URL=wss://cmobackendnest-production.up.railway.app
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo con Turbopack
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en modo producción
- `npm run lint` - Ejecuta el linter de código

## 🏗️ Arquitectura y Patrones

### Componentes Principales

#### 1. **HomePage** (`src/app/page.tsx`)

- Componente principal que maneja la lógica de autenticación
- Verifica tokens al cargar la página
- Maneja estados de carga y errores de servidor
- Renderiza LoginForm o Dashboard según el estado de autenticación

#### 2. **Dashboard** (`src/components/Dashboard.tsx`)

- Header común con información del usuario y tiempo actual
- Renderiza el dashboard específico según el rol del usuario
- Maneja el logout y actualización de tiempo en tiempo real

#### 3. **AuthService** (`src/services/authService.ts`)

- Servicio centralizado para manejo de autenticación
- Métodos para login, logout, obtener perfil
- Manejo de tokens JWT y localStorage
- Verificación de autenticación y headers para requests

#### 4. **useWebSocket** (`src/hooks/useWebSocket.ts`)

- Hook personalizado para manejo de WebSockets
- Conexión automática y reconexión en caso de errores
- Manejo de usuarios conectados y notificaciones
- Soporte para notificaciones nativas del navegador

### Patrones de Diseño Utilizados

- **Custom Hooks**: Para lógica reutilizable (WebSocket, notificaciones)
- **Service Layer**: Para separar lógica de negocio (authService)
- **Component Composition**: Dashboards específicos por rol
- **Error Boundaries**: Manejo robusto de errores
- **Responsive Design**: Diseño adaptable con Tailwind CSS

## 🔐 Autenticación y Autorización

### Flujo de Autenticación

1. Usuario ingresa credenciales en LoginForm
2. AuthService envía request al backend
3. Backend retorna JWT token y datos del usuario
4. Token se guarda en localStorage
5. Dashboard se renderiza según el rol del usuario

### Manejo de Sesiones

- Verificación automática de token al cargar la página
- Renovación silenciosa de sesión
- Manejo de tokens expirados
- Logout automático en caso de errores de autenticación

### Roles y Permisos

- **Admin**: Acceso completo al sistema
- **Supervisor**: Autorización de permisos, supervisión
- **Planificador**: Creación y asignación de trabajos
- **Técnico**: Visualización y actualización de órdenes

## 🌐 Comunicación WebSocket

### Características

- Conexión automática al autenticarse
- Reconexión automática con backoff exponencial
- Manejo de múltiples tipos de mensajes
- Notificaciones en tiempo real

### Eventos Soportados

- `connectedUsers`: Lista de usuarios conectados
- `userConnected`: Nuevo usuario conectado
- `userDisconnected`: Usuario desconectado
- `permisoNotification`: Notificaciones de permisos
- `authenticated`: Confirmación de autenticación

## 🎨 Diseño y UX

### Principios de Diseño

- **Responsive First**: Diseño móvil primero
- **Accesibilidad**: Cumple estándares WCAG
- **Consistencia**: Componentes reutilizables
- **Feedback Visual**: Estados de carga y errores claros

### Paleta de Colores

- **Primario**: Indigo (600, 700)
- **Secundario**: Gray (50, 100, 600, 900)
- **Estados**: Green (éxito), Red (error), Yellow (advertencia)
- **Gradientes**: Blue to Indigo para fondos

## 🚀 Despliegue

### Desarrollo Local

```bash
npm run dev
```

### Construcción para Producción

```bash
npm run build
npm run start
```

### Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Vercel desplegará automáticamente

### Variables de Entorno para Producción

```env
NEXT_PUBLIC_API_URL=https://tu-backend.com
NEXT_PUBLIC_WS_URL=wss://tu-backend.com
```

## 🐛 Debugging y Desarrollo

### Herramientas de Debug

- **WebSocketDebug**: Componente para debug de WebSocket
- **Console Logs**: Logs detallados en desarrollo
- **Error Boundaries**: Captura de errores en componentes

### Problemas Comunes

1. **WebSocket no conecta**: Verificar URL y CORS del backend
2. **Token expirado**: Implementar renovación automática
3. **Hidratación**: Usar `useState` para detectar cliente

## 📚 Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.
