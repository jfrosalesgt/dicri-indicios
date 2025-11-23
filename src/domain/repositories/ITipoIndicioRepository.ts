import type { TipoIndicio } from '../entities/TipoIndicio';
import type { ApiResponse } from '../entities/ApiResponse';

export interface CreateTipoIndicioRequest {
  nombre_tipo: string;
  descripcion?: string;
}

export interface UpdateTipoIndicioRequest {
  nombre_tipo?: string;
  descripcion?: string;
  activo?: boolean;
}

export interface ITipoIndicioRepository {
  getAll(params?: { activo?: boolean }): Promise<ApiResponse<TipoIndicio[]>>;
  getById(id: number): Promise<ApiResponse<TipoIndicio>>;
  create(data: CreateTipoIndicioRequest): Promise<ApiResponse<TipoIndicio>>;
  update(id: number, data: UpdateTipoIndicioRequest): Promise<ApiResponse<void>>;
  delete(id: number): Promise<ApiResponse<void>>;
}
