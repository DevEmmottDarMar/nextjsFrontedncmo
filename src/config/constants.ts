// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// WebSocket Configuration
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000';

// App Constants
export const APP_NAME = 'CMO - Centro de Operaciones Móvil';

// Notification Types
export const NOTIFICATION_TYPES = {
  TRABAJO_INICIADO: 'trabajo_iniciado',
  TRABAJO_APROBADO: 'trabajo_aprobado',
  TRABAJO_RECHAZADO: 'trabajo_rechazado',
  PERMISO_SOLICITADO: 'permiso_solicitado',
  PERMISO_APROBADO: 'permiso_aprobado',
  PERMISO_RECHAZADO: 'permiso_rechazado',
} as const;

// Work States
export const WORK_STATES = {
  PENDIENTE: 'pendiente',
  ASIGNADO: 'asignado',
  PENDIENTE_APROBACION: 'pendiente_aprobacion',
  EN_PROCESO: 'en_proceso',
  EN_PROGRESO: 'en_progreso',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  TECNICO: 'tecnico',
} as const; 