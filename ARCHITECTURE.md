# Arquitectura del Frontend CMO

## 📋 Visión General

El frontend CMO está construido siguiendo principios de arquitectura limpia y patrones modernos de React/Next.js. La aplicación se estructura en capas bien definidas que separan las responsabilidades y facilitan el mantenimiento.

## 🏗️ Arquitectura por Capas

```
┌─────────────────────────────────────────┐
│              Presentation Layer          │
│  (Components, Pages, UI Logic)          │
├─────────────────────────────────────────┤
│              Business Layer             │
│  (Custom Hooks, State Management)       │
├─────────────────────────────────────────┤
│              Service Layer              │
│  (API Calls, External Services)         │
├─────────────────────────────────────────┤
│              Data Layer                 │
│  (Models, Types, Interfaces)            │
└─────────────────────────────────────────┘
```

## 🎯 Principios de Diseño

### 1. Separación de Responsabilidades

- **Componentes**: Solo lógica de presentación
- **Hooks**: Lógica de estado y efectos secundarios
- **Servicios**: Comunicación con APIs externas
- **Types**: Definiciones de tipos y contratos

### 2. Composición sobre Herencia

- Componentes pequeños y reutilizables
- Higher-Order Components (HOCs) cuando es necesario
- Render props para lógica compartida

### 3. Inmutabilidad

- Estado inmutable con React hooks
- Actualizaciones de estado predecibles
- Evitar mutaciones directas

## 📁 Estructura Detallada

### `/src/app` - App Router

```
app/
├── globals.css          # Estilos globales de Tailwind
├── layout.tsx          # Layout raíz con metadata
├── page.tsx            # Página principal (HomePage)
└── favicon.ico         # Favicon de la aplicación
```

**Responsabilidades:**

- Configuración de rutas con App Router
- Layout global y metadata
- Punto de entrada de la aplicación

### `/src/components` - Componentes UI

```
components/
├── dashboards/         # Dashboards específicos por rol
│   ├── components/     # Componentes compartidos entre dashboards
│   ├── AdminDashboard.tsx
│   ├── SupervisorDashboard.tsx
│   ├── PlanificadorDashboard.tsx
│   ├── TecnicoDashboard.tsx
│   └── index.ts        # Barrel exports
├── Dashboard.tsx       # Dashboard principal con header
├── DashboardLayout.tsx # Layout común para dashboards
├── LoginForm.tsx       # Formulario de autenticación
├── NotificationBar.tsx # Barra de notificaciones
├── NotificationContainer.tsx
├── NotificationManager.tsx
├── NotificationToast.tsx
├── WebSocketDebug.tsx  # Herramientas de debug
└── WebSocketStatus.tsx # Indicador de conexión
```

**Patrones Utilizados:**

- **Compound Components**: Para componentes complejos
- **Render Props**: Para lógica compartida
- **Controlled Components**: Para formularios

### `/src/hooks` - Custom Hooks

```
hooks/
├── useNotifications.ts    # Gestión de notificaciones
├── useWebSocket.ts       # WebSocket principal
└── useWebSocketSimple.ts # WebSocket simplificado
```

**Responsabilidades:**

- Encapsular lógica de estado compleja
- Reutilizar lógica entre componentes
- Manejar efectos secundarios

### `/src/services` - Capa de Servicios

```
services/
└── authService.ts        # Servicio de autenticación
```

**Responsabilidades:**

- Comunicación con APIs externas
- Transformación de datos
- Manejo de errores de red
- Caché y persistencia

## 🔄 Flujo de Datos

### 1. Flujo de Autenticación

```
LoginForm → authService.login() → JWT Token → localStorage → Dashboard
     ↓
HomePage verifica token → authService.getProfile() → Renderiza Dashboard
```

### 2. Flujo de WebSocket

```
useWebSocket Hook → WebSocket Connection → Message Handler → State Update → UI Update
     ↓
Reconnection Logic → Error Handling → Notification System
```

### 3. Flujo de Notificaciones

```
WebSocket Message → useNotifications Hook → Notification State → Toast Component
     ↓
Browser Notification API → Native Notification
```

## 🎨 Patrones de Componentes

### 1. Container/Presentational Pattern

```typescript
// Container Component (lógica)
function DashboardContainer() {
  const { user, isLoading } = useAuth();
  const { notifications } = useNotifications();
  
  return (
    <DashboardPresentation 
      user={user}
      isLoading={isLoading}
      notifications={notifications}
    />
  );
}

// Presentational Component (UI)
function DashboardPresentation({ user, isLoading, notifications }) {
  if (isLoading) return <LoadingSpinner />;
  return <div>{/* UI */}</div>;
}
```

### 2. Custom Hook Pattern

```typescript
function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // WebSocket logic
  }, []);
  
  return { isConnected, messages, sendMessage };
}
```

### 3. Service Pattern

```typescript
class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // API call logic
  }
  
  getToken(): string | null {
    // Token retrieval logic
  }
}

export const authService = new AuthService();
```

## 🔐 Gestión de Estado

### Estado Local (useState)

- Estado de componentes individuales
- Estados temporales (loading, error)
- Estados de UI (modales, formularios)

### Estado Compartido (Custom Hooks)

- Estado de autenticación (useAuth)
- Estado de WebSocket (useWebSocket)
- Estado de notificaciones (useNotifications)

### Estado Persistente (localStorage)

- JWT tokens
- Datos de usuario
- Preferencias de usuario

## 🚀 Optimizaciones de Rendimiento

### 1. Code Splitting

- Lazy loading de dashboards por rol
- Dynamic imports para componentes pesados

### 2. Memoización

```typescript
const MemoizedComponent = React.memo(Component);
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
```

### 3. Optimización de Re-renders

- Separación de estado por responsabilidad
- Uso de useCallback para funciones
- Uso de useMemo para cálculos costosos

## 🧪 Estrategia de Testing

### Unit Tests

- Componentes individuales
- Custom hooks
- Servicios

### Integration Tests

- Flujos de autenticación
- Comunicación WebSocket
- Interacciones entre componentes

### E2E Tests

- Flujos completos de usuario
- Casos de uso críticos

## 🔧 Herramientas de Desarrollo

### TypeScript

- Tipado estático fuerte
- Interfaces para contratos
- Generics para reutilización

### ESLint + Prettier

- Consistencia de código
- Detección de errores
- Formateo automático

### Next.js DevTools

- Hot reloading
- Error boundaries
- Performance insights

## 📈 Escalabilidad

### Horizontal

- Nuevos dashboards por rol
- Nuevos tipos de notificaciones
- Nuevos servicios

### Vertical

- Optimización de bundle size
- Lazy loading avanzado
- Service Workers para offline

## 🔒 Seguridad

### Autenticación

- JWT tokens con expiración
- Refresh token rotation
- Logout automático

### Autorización

- Rutas protegidas por rol
- Componentes condicionales
- Validación en cliente y servidor

### Datos Sensibles

- No almacenar datos sensibles en localStorage
- Sanitización de inputs
- Validación de tipos con TypeScript

## 🌐 Consideraciones de Despliegue

### Build Optimization

- Tree shaking automático
- Bundle splitting
- Asset optimization

### Environment Configuration

- Variables de entorno por ambiente
- Configuración de APIs
- Feature flags

### Monitoring

- Error tracking
- Performance monitoring
- User analytics
