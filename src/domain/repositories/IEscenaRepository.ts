import type { Escena } from '../entities/Escena';
import type { ApiResponse } from '../entities/ApiResponse';

export interface CreateEscenaRequest {
  id_investigacion: number;
  nombre_escena: string;
  direccion_escena?: string;
  fecha_hora_inicio: string;
  fecha_hora_fin?: string | null;
  descripcion?: string;
}

export interface UpdateEscenaRequest {
  nombre_escena?: string;
  direccion_escena?: string;
  fecha_hora_inicio?: string;
  fecha_hora_fin?: string | null;
  descripcion?: string;
  activo?: boolean;
}

export interface IEscenaRepository {
  getByExpediente(expedienteId: number): Promise<ApiResponse<Escena[]>>;
  createForExpediente(expedienteId: number, data: CreateEscenaRequest): Promise<ApiResponse<Escena>>;
  getById(id: number): Promise<ApiResponse<Escena>>;
  update(id: number, data: UpdateEscenaRequest): Promise<ApiResponse<void>>;
  delete(id: number): Promise<ApiResponse<void>>;
}
