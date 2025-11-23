import type { User, Perfil, Role } from './User';
import type { Module } from './Module';

export interface LoginCredentials {
  nombre_usuario: string;
  clave: string;
}

export interface LoginResponse {
  token: string;
  usuario: User;
  perfiles: Perfil[];
  roles: Role[];
  modulos: Module[];
}

export interface AuthUser {
  id_usuario: number;
  nombre_usuario: string;
  email: string;
  perfiles: number[];
  roles: string[];
  modulos: number[];
  iat: number;
  exp: number;
}

export interface ChangePasswordRequest {
  clave_actual: string;
  clave_nueva: string;
}
