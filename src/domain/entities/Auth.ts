import type { User, Perfil, Role } from './User';

export interface LoginCredentials {
  nombre_usuario: string;
  clave: string;
}

export interface LoginResponse {
  token: string;
  usuario: User;
  perfiles: Perfil[];
  roles: Role[];
}

export interface AuthUser {
  id_usuario: number;
  nombre_usuario: string;
  email: string;
  perfiles: number[];
  roles: string[];
  iat: number;
  exp: number;
}

export interface ChangePasswordRequest {
  clave_actual: string;
  clave_nueva: string;
}
