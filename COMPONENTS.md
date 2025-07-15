# Documentación de Componentes

## 📋 Visión General

Esta documentación describe todos los componentes del frontend CMO, sus props, estados y casos de uso. Los componentes están organizados por funcionalidad y nivel de abstracción.

## 🏠 Componentes Principales

### HomePage (`src/app/page.tsx`)

**Descripción**: Componente raíz que maneja la lógica de autenticación y renderiza LoginForm o Dashboard según el estado del usuario.

**Estados**:

```typescript
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [isMounted, setIsMounted] = useState(false);
const [serverError, setServerError] = useState<string | null>(null);
```

**Funcionalidades**:

- ✅ Verificación automática de autenticación al cargar
- ✅ Manejo de hidratación SSR/CSR
- ✅ Gestión de errores de servidor
- ✅ Pantallas de carga con spinners
- ✅ Barra de notificación de errores con retry

**Flujo de Estados**:

```
Loading → Verificar Token → Authenticated/Unauthenticated → Render Dashboard/Login
```

---

### Dashboard (`src/components/Dashboard.tsx`)

**Descripción**: Dashboard principal que contiene el header común y renderiza el dashboard específico según el rol del usuario.

**Props**:

```typescript
interface DashboardProps {
  onLogout: () => void;
}
```

**Estados**:

```typescript
const [user, setUser] = useState<User | null>(null);
const [currentTime, setCurrentTime] = useState(new Date());
```

**Funcionalidades**:

- ✅ Header con información del usuario y tiempo en tiempo real
- ✅ Renderizado condicional de dashboards por rol
- ✅ Botón de logout con confirmación
- ✅ Indicadores visuales de rol con colores y emojis

**Roles Soportados**:

- `admin` → AdminDashboard
- `supervisor` → SupervisorDashboard  
- `planificador` → PlanificadorDashboard
- `técnico` → TecnicoDashboard

---

## 🔐 Componentes de Autenticación

### LoginForm (`src/components/LoginForm.tsx`)

**Descripción**: Formulario de inicio de sesión con validación y manejo de errores.

**Props**:

```typescript
interface LoginFormProps {
  onLoginSuccess: () => void;
}
```

**Estados**:

```typescript
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Funcionalidades**:

- ✅ Validación de email en tiempo real
- ✅ Manejo de errores de autenticación
- ✅ Estados de carga con spinner
- ✅ Diseño responsive con gradientes
- ✅ Accesibilidad con labels y ARIA

**Validaciones**:

- Email requerido y formato válido
- Password requerido (mínimo 1 carácter)
- Manejo de errores de red y servidor

---

## 📊 Dashboards por Rol

### AdminDashboard (`src/components/dashboards/AdminDashboard.tsx`)

**Descripción**: Dashboard para administradores con acceso completo al sistema.

**Props**:

```typescript
interface AdminDashboardProps {
  user: User;
}
```

**Funcionalidades**:

- ✅ Gestión de usuarios (CRUD)
- ✅ Gestión de áreas
- ✅ Configuración del sistema
- ✅ Reportes y estadísticas
- ✅ Logs de auditoría

---

### SupervisorDashboard (`src/components/dashboards/SupervisorDashboard.tsx`)

**Descripción**: Dashboard para supervisores con capacidades de autorización.

**Props**:

```typescript
interface SupervisorDashboardProps {
  user: User;
}
```

**Funcionalidades**:

- ✅ Lista de permisos pendientes
- ✅ Autorización/rechazo de permisos
- ✅ Supervisión de técnicos conectados
- ✅ Historial de permisos
- ✅ Notificaciones en tiempo real

---

### PlanificadorDashboard (`src/components/dashboards/PlanificadorDashboard.tsx`)

**Descripción**: Dashboard para planificadores con herramientas de gestión de trabajos.

**Props**:

```typescript
interface PlanificadorDashboardProps {
  user: User;
}
```

**Funcionalidades**:

- ✅ Creación de trabajos
- ✅ Asignación de recursos
- ✅ Calendario de planificación
- ✅ Gestión de técnicos
- ✅ Reportes de productividad

---

### TecnicoDashboard (`src/components/dashboards/TecnicoDashboard.tsx`)

**Descripción**: Dashboard para técnicos con sus órdenes de trabajo y permisos.

**Props**:

```typescript
interface TecnicoDashboardProps {
  user: User;
}
```

**Funcionalidades**:

- ✅ Lista de órdenes de trabajo asignadas
- ✅ Solicitud de permisos
- ✅ Actualización de estado de trabajos
- ✅ Historial personal
- ✅ Notificaciones de nuevas asignaciones

---

## 🔔 Sistema de Notificaciones

### NotificationManager (`src/components/NotificationManager.tsx`)

**Descripción**: Gestor central de notificaciones que coordina todos los tipos de notificaciones.

**Funcionalidades**:

- ✅ Gestión centralizada de notificaciones
- ✅ Queue de notificaciones
- ✅ Priorización por tipo
- ✅ Auto-dismiss configurable

---

### NotificationContainer (`src/components/NotificationContainer.tsx`)

**Descripción**: Contenedor que renderiza las notificaciones activas.

**Props**:

```typescript
interface NotificationContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}
```

**Funcionalidades**:

- ✅ Posicionamiento fijo en pantalla
- ✅ Animaciones de entrada/salida
- ✅ Stack de notificaciones
- ✅ Responsive design

---

### NotificationToast (`src/components/NotificationToast.tsx`)

**Descripción**: Componente individual de notificación toast.

**Props**:

```typescript
interface NotificationToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  onDismiss: (id: string) => void;
}
```

**Funcionalidades**:

- ✅ Diferentes tipos visuales (success, error, warning, info)
- ✅ Auto-dismiss con countdown
- ✅ Botón de cierre manual
- ✅ Iconos por tipo
- ✅ Animaciones suaves

---

### NotificationBar (`src/components/NotificationBar.tsx`)

**Descripción**: Barra de notificación persistente para mensajes importantes.

**Props**:

```typescript
interface NotificationBarProps {
  type: 'error' | 'warning' | 'info';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}
```

**Funcionalidades**:

- ✅ Posición fija en top de pantalla
- ✅ Botón de acción opcional
- ✅ Colores por tipo de mensaje
- ✅ Dismissible opcional

---

### ActiveNotifications (`src/components/ActiveNotifications.tsx`)

**Descripción**: Indicador de notificaciones activas con contador.

**Props**:

```typescript
interface ActiveNotificationsProps {
  count: number;
  onClick: () => void;
}
```

**Funcionalidades**:

- ✅ Badge con contador
- ✅ Animación de pulso para nuevas notificaciones
- ✅ Click handler para abrir panel
- ✅ Estados vacío/con notificaciones

---

## 🌐 Componentes WebSocket

### WebSocketStatus (`src/components/WebSocketStatus.tsx`)

**Descripción**: Indicador visual del estado de conexión WebSocket.

**Props**:

```typescript
interface WebSocketStatusProps {
  isConnected: boolean;
  reconnectAttempts?: number;
  onReconnect?: () => void;
}
```

**Estados Visuales**:

- 🟢 Conectado: Verde con ícono de check
- 🟡 Reconectando: Amarillo con spinner
- 🔴 Desconectado: Rojo con ícono de error

**Funcionalidades**:

- ✅ Indicador visual claro del estado
- ✅ Tooltip con información detallada
- ✅ Botón de reconexión manual
- ✅ Contador de intentos de reconexión

---

### WebSocketDebug (`src/components/WebSocketDebug.tsx`)

**Descripción**: Panel de debug para desarrollo que muestra información detallada del WebSocket.

**Props**:

```typescript
interface WebSocketDebugProps {
  isConnected: boolean;
  lastMessage: any;
  connectedUsers: User[];
  messageHistory: any[];
}
```

**Funcionalidades** (Solo en desarrollo):

- ✅ Estado de conexión en tiempo real
- ✅ Último mensaje recibido
- ✅ Lista de usuarios conectados
- ✅ Historial de mensajes
- ✅ Botones para enviar mensajes de prueba

---

## 🎨 Componentes de Layout

### DashboardLayout (`src/components/DashboardLayout.tsx`)

**Descripción**: Layout común para todos los dashboards con sidebar y área de contenido.

**Props**:

```typescript
interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}
```

**Funcionalidades**:

- ✅ Sidebar colapsible
- ✅ Área de contenido responsive
- ✅ Header personalizable
- ✅ Navegación por teclado
- ✅ Breadcrumbs automáticos

---

## 🔧 Componentes Utilitarios

### LoadingSpinner

**Descripción**: Spinner de carga reutilizable.

**Props**:

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}
```

**Variantes**:

- `sm`: 16px - Para botones
- `md`: 32px - Para secciones
- `lg`: 64px - Para páginas completas

---

### ErrorBoundary

**Descripción**: Boundary para capturar errores de React.

**Props**:

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}
```

**Funcionalidades**:

- ✅ Captura errores de componentes hijos
- ✅ Fallback UI personalizable
- ✅ Logging de errores
- ✅ Botón de retry

---

## 📱 Responsive Design

### Breakpoints Utilizados

```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Tablets pequeñas */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Pantallas grandes */
```

### Patrones Responsive

```typescript
// Ejemplo de componente responsive
const ResponsiveComponent = () => (
  <div className="
    grid 
    grid-cols-1 
    sm:grid-cols-2 
    lg:grid-cols-3 
    xl:grid-cols-4 
    gap-4
  ">
    {/* Contenido */}
  </div>
);
```

## 🎯 Accesibilidad

### Estándares Implementados

- ✅ ARIA labels y roles
- ✅ Navegación por teclado
- ✅ Contraste de colores WCAG AA
- ✅ Focus management
- ✅ Screen reader support

### Ejemplos de Implementación

```typescript
// Botón accesible
<button
  aria-label="Cerrar notificación"
  aria-describedby="notification-content"
  className="focus:ring-2 focus:ring-blue-500"
  onClick={onClose}
>
  <XIcon className="h-4 w-4" aria-hidden="true" />
</button>

// Formulario accesible
<label htmlFor="email" className="sr-only">
  Correo electrónico
</label>
<input
  id="email"
  type="email"
  required
  aria-invalid={!!emailError}
  aria-describedby={emailError ? "email-error" : undefined}
/>
```

## 🧪 Testing

### Estrategias por Componente

#### Unit Tests

```typescript
// Ejemplo de test para LoginForm
describe('LoginForm', () => {
  it('should validate email format', () => {
    render(<LoginForm onLoginSuccess={jest.fn()} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
  });
});
```

#### Integration Tests

```typescript
// Ejemplo de test de integración
describe('Dashboard Integration', () => {
  it('should render correct dashboard for user role', () => {
    const adminUser = { rol: 'admin', nombre: 'Admin' };
    
    render(<Dashboard user={adminUser} onLogout={jest.fn()} />);
    
    expect(screen.getByText(/panel de administración/i)).toBeInTheDocument();
  });
});
```

## 🚀 Performance

### Optimizaciones Implementadas

#### Lazy Loading

```typescript
// Lazy loading de dashboards
const AdminDashboard = lazy(() => import('./dashboards/AdminDashboard'));
const SupervisorDashboard = lazy(() => import('./dashboards/SupervisorDashboard'));

// Uso con Suspense
<Suspense fallback={<LoadingSpinner size="lg" />}>
  <AdminDashboard user={user} />
</Suspense>
```

#### Memoización

```typescript
// Componente memoizado
const MemoizedNotificationToast = React.memo(NotificationToast, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id && 
         prevProps.message === nextProps.message;
});

// Hook memoizado
const memoizedUsers = useMemo(() => 
  users.filter(user => user.activo), 
  [users]
);
```

#### Virtual Scrolling

```typescript
// Para listas grandes de notificaciones
const VirtualizedNotificationList = ({ notifications }) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  
  const visibleNotifications = notifications.slice(
    visibleRange.start, 
    visibleRange.end
  );
  
  return (
    <div className="overflow-auto max-h-96">
      {visibleNotifications.map(notification => (
        <NotificationToast key={notification.id} {...notification} />
      ))}
    </div>
  );
};
```

## 📚 Guías de Uso

### Creando un Nuevo Dashboard

1. Crear archivo en `src/components/dashboards/`
2. Implementar interface con prop `user: User`
3. Agregar al switch en `Dashboard.tsx`
4. Exportar en `dashboards/index.ts`

### Agregando una Nueva Notificación

1. Definir tipo en `useNotifications.ts`
2. Crear handler en `NotificationManager.tsx`
3. Agregar estilos en `NotificationToast.tsx`
4. Implementar en componente que la necesite

### Integrando un Nuevo Endpoint

1. Agregar método en `authService.ts` o crear nuevo service
2. Definir tipos en interfaces
3. Implementar en componente con manejo de errores
4. Agregar tests unitarios
