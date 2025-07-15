# Integración con API Backend

## 🌐 Visión General

El frontend CMO se integra con el backend NestJS a través de una API REST y comunicación WebSocket en tiempo real. Esta documentación describe cómo se maneja la comunicación, autenticación y sincronización de datos.

## 🔗 Configuración de Endpoints

### Variables de Entorno

```env
# Desarrollo
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000

# Producción
NEXT_PUBLIC_API_URL=https://cmobackendnest-production.up.railway.app
NEXT_PUBLIC_WS_URL=wss://cmobackendnest-production.up.railway.app
```

### URLs Base

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cmobackendnest-production.up.railway.app";
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://cmobackendnest-production.up.railway.app";
```

## 🔐 Autenticación

### Flujo de Login

```typescript
// 1. Enviar credenciales
const response = await fetch(`${API_URL}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
});

// 2. Recibir token y datos de usuario
const { access_token, user } = await response.json();

// 3. Almacenar en localStorage
localStorage.setItem("token", access_token);
localStorage.setItem("user", JSON.stringify(user));
```

### Headers de Autenticación

```typescript
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  };
};
```

### Verificación de Perfil

```typescript
// Método principal - endpoint /users/profile
const getProfile = async (): Promise<User> => {
  const response = await fetch(`${API_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  // Fallback - endpoint /users/:id si profile no existe
  if (response.status === 404) {
    const userId = getUserIdFromToken(token);
    const fallbackResponse = await fetch(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return fallbackResponse.json();
  }
  
  return response.json();
};
```

## 📡 Endpoints REST Utilizados

### Autenticación

| Método | Endpoint | Descripción | Payload |
|--------|----------|-------------|---------|
| POST | `/auth/login` | Iniciar sesión | `{ email, password }` |
| GET | `/users/profile` | Obtener perfil actual | - |
| GET | `/users/:id` | Obtener usuario por ID | - |

### Usuarios

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/users` | Listar usuarios | Admin, Supervisor |
| POST | `/users` | Crear usuario | Admin |
| PUT | `/users/:id` | Actualizar usuario | Admin |
| DELETE | `/users/:id` | Eliminar usuario | Admin |

### Áreas

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/areas` | Listar áreas | Todos |
| POST | `/areas` | Crear área | Admin |
| PUT | `/areas/:id` | Actualizar área | Admin |

### Trabajos

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/trabajos` | Listar trabajos | Todos |
| POST | `/trabajos` | Crear trabajo | Planificador, Admin |
| PUT | `/trabajos/:id` | Actualizar trabajo | Planificador, Admin |
| GET | `/trabajos/tecnico/:id` | Trabajos de técnico | Técnico |

### Permisos

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/permisos` | Listar permisos | Supervisor, Admin |
| POST | `/permisos` | Crear permiso | Técnico |
| PUT | `/permisos/:id/autorizar` | Autorizar permiso | Supervisor |
| PUT | `/permisos/:id/rechazar` | Rechazar permiso | Supervisor |
| GET | `/permisos/tecnico/:id` | Permisos de técnico | Técnico |

## 🔌 Comunicación WebSocket

### Conexión y Autenticación

```typescript
const ws = new WebSocket(WS_URL);

ws.onopen = () => {
  // Enviar token para autenticación
  const token = localStorage.getItem("token");
  ws.send(JSON.stringify({ token }));
};
```

### Eventos WebSocket

#### Eventos de Conexión

```typescript
// Autenticación exitosa
{
  "event": "authenticated",
  "message": "Usuario autenticado correctamente"
}

// Error de autenticación
{
  "event": "authError",
  "message": "Token inválido"
}
```

#### Eventos de Usuarios

```typescript
// Lista de usuarios conectados
{
  "event": "connectedUsers",
  "users": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "rol": "técnico",
      "area": { "id": 1, "nombre": "Mantenimiento" }
    }
  ]
}

// Usuario conectado
{
  "event": "userConnected",
  "message": "Juan Pérez (técnico) se ha conectado",
  "user": { /* datos del usuario */ }
}

// Usuario desconectado
{
  "event": "userDisconnected",
  "message": "Juan Pérez se ha desconectado",
  "user": { /* datos del usuario */ }
}
```

#### Eventos de Permisos

```typescript
// Notificación de permiso
{
  "event": "permisoNotification",
  "message": "Nuevo permiso solicitado por Juan Pérez",
  "data": {
    "permisoId": 123,
    "tecnico": "Juan Pérez",
    "tipo": "Trabajo en Altura",
    "estado": "pendiente"
  }
}
```

### Manejo de Reconexión

```typescript
ws.onclose = (event) => {
  if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
    setTimeout(() => {
      reconnectAttempts++;
      connect();
    }, delay);
  }
};
```

## 🛡️ Manejo de Errores

### Errores HTTP

```typescript
const handleApiError = (response: Response) => {
  switch (response.status) {
    case 401:
      // Token inválido - logout automático
      authService.logout();
      throw new Error("TOKEN_INVALID");
    
    case 403:
      throw new Error("Sin permisos para esta acción");
    
    case 404:
      throw new Error("Recurso no encontrado");
    
    case 500:
      throw new Error("SERVER_ERROR");
    
    default:
      throw new Error(`Error ${response.status}`);
  }
};
```

### Errores de Red

```typescript
const makeApiCall = async (url: string, options: RequestInit) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) handleApiError(response);
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("No se puede conectar al servidor");
    }
    throw error;
  }
};
```

### Errores WebSocket

```typescript
ws.onerror = (error) => {
  console.error("Error en WebSocket:", error);
  // Mostrar notificación de error
  showNotification("Error de conexión", {
    body: "Se perdió la conexión en tiempo real",
    icon: "/favicon.ico"
  });
};
```

## 🔄 Sincronización de Datos

### Estrategias de Actualización

#### 1. Polling (No utilizado actualmente)

```typescript
// Para datos que cambian frecuentemente
useEffect(() => {
  const interval = setInterval(async () => {
    const data = await fetchData();
    setData(data);
  }, 5000);
  
  return () => clearInterval(interval);
}, []);
```

#### 2. WebSocket Push (Implementado)

```typescript
// Actualización en tiempo real via WebSocket
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  switch (message.event) {
    case "connectedUsers":
      setConnectedUsers(message.users);
      break;
    case "permisoNotification":
      // Actualizar lista de permisos
      refreshPermisos();
      break;
  }
};
```

#### 3. Optimistic Updates

```typescript
const updatePermiso = async (id: number, data: any) => {
  // Actualizar UI inmediatamente
  setPermisos(prev => prev.map(p => 
    p.id === id ? { ...p, ...data } : p
  ));
  
  try {
    // Enviar al servidor
    await api.updatePermiso(id, data);
  } catch (error) {
    // Revertir en caso de error
    setPermisos(prev => prev.map(p => 
      p.id === id ? originalPermiso : p
    ));
    throw error;
  }
};
```

## 📊 Tipos de Datos

### Interfaces Principales

```typescript
interface User {
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

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: User;
}

interface WebSocketMessage {
  event?: string;
  type?: string;
  data?: any;
  message?: string;
  users?: User[];
}
```

## 🚀 Optimizaciones

### Caché de Requests

```typescript
const cache = new Map();

const cachedFetch = async (url: string, options: RequestInit) => {
  const key = `${url}-${JSON.stringify(options)}`;
  
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const response = await fetch(url, options);
  const data = await response.json();
  
  cache.set(key, data);
  setTimeout(() => cache.delete(key), 5 * 60 * 1000); // 5 min TTL
  
  return data;
};
```

### Debounce para Búsquedas

```typescript
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

### Request Cancellation

```typescript
useEffect(() => {
  const controller = new AbortController();
  
  const fetchData = async () => {
    try {
      const response = await fetch(url, {
        signal: controller.signal
      });
      const data = await response.json();
      setData(data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Fetch error:', error);
      }
    }
  };
  
  fetchData();
  
  return () => controller.abort();
}, [url]);
```

## 🔍 Debugging

### Logs de API

```typescript
const logApiCall = (method: string, url: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🌐 API ${method} ${url}`);
    if (data) console.log('Payload:', data);
    console.groupEnd();
  }
};
```

### WebSocket Debug

```typescript
const WebSocketDebug = () => {
  const { isConnected, lastMessage, connectedUsers } = useWebSocket();
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded">
      <h3>WebSocket Debug</h3>
      <p>Conectado: {isConnected ? '✅' : '❌'}</p>
      <p>Usuarios: {connectedUsers.length}</p>
      <p>Último mensaje: {JSON.stringify(lastMessage)}</p>
    </div>
  );
};
```

## 📈 Monitoreo

### Métricas de API

- Tiempo de respuesta
- Tasa de errores
- Requests por minuto
- Uptime del servidor

### Métricas de WebSocket

- Tiempo de conexión
- Reconexiones por sesión
- Mensajes perdidos
- Latencia de mensajes

### Alertas

- Errores 5xx del servidor
- Tiempo de respuesta > 5s
- WebSocket desconectado > 30s
- Tasa de error > 5%
