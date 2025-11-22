export interface User {
  id_usuario: number;
  nombre_usuario: string;
  nombre: string;
  apellido: string;
  email: string;
  activo: boolean;
  cambiar_clave: boolean;
  intentos_fallidos: number;
  fecha_ultimo_acceso: string | null;
  usuario_creacion: string;
  fecha_creacion: string;
  usuario_actualizacion: string | null;
  fecha_actualizacion: string | null;
}

export interface Perfil {
  id_perfil: number;
  nombre_perfil: string;
  descripcion: string;
  activo: boolean;
  usuario_creacion: string;
  fecha_creacion: string;
  usuario_actualizacion: string | null;
  fecha_actualizacion: string | null;
}

export interface Role {
  id_role: number;
  nombre_role: string;
  descripcion: string;
  activo: boolean;
  usuario_creacion: string;
  fecha_creacion: string;
  usuario_actualizacion: string | null;
  fecha_actualizacion: string | null;
}
