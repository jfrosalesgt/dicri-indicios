import type { User } from '../entities/User';
import type { ApiResponse } from '../entities/ApiResponse';

export interface CreateUserRequest {
  nombre_usuario: string;
  clave: string;
  nombre: string;
  apellido: string;
  email: string;
}

export interface UpdateUserRequest {
  nombre?: string;
  apellido?: string;
  email?: string;
  activo?: boolean;
}

export interface IUserRepository {
  getUsers(): Promise<ApiResponse<User[]>>;
  getUserById(id: number): Promise<ApiResponse<User>>;
  createUser(data: CreateUserRequest): Promise<ApiResponse<User>>;
  updateUser(id: number, data: UpdateUserRequest): Promise<ApiResponse<User>>;
  deleteUser(id: number): Promise<ApiResponse<void>>;
}
