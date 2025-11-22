import type { Indicio, EstadoIndicio } from '../entities/Indicio';
import type { ApiResponse } from '../entities/ApiResponse';

export interface CreateIndicioRequest {
  codigo_indicio: string;
  id_escena: number;
  id_tipo_indicio: number;
  descripcion_corta: string;
  ubicacion_especifica?: string;
  fecha_hora_recoleccion?: string;
}

export interface UpdateIndicioRequest {
  descripcion_corta?: string;
  ubicacion_especifica?: string;
  fecha_hora_recoleccion?: string;
  id_tipo_indicio?: number;
  estado_actual?: EstadoIndicio;
  activo?: boolean;
}

export interface IIndicioRepository {
  getAll(params?: { id_escena?: number; id_tipo_indicio?: number; estado?: EstadoIndicio; activo?: boolean }): Promise<ApiResponse<Indicio[]>>;
  getById(id: number): Promise<ApiResponse<Indicio>>;
  create(data: CreateIndicioRequest): Promise<ApiResponse<Indicio>>;
  update(id: number, data: UpdateIndicioRequest): Promise<ApiResponse<void>>;
  delete(id: number): Promise<ApiResponse<void>>;
}
