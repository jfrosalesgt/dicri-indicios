import type { Investigacion, EstadoRevisionDicri } from '../entities/Investigacion';
import type { ApiResponse } from '../entities/ApiResponse';

export interface CreateInvestigacionRequest {
  codigo_caso: string;
  nombre_caso: string;
  fecha_inicio: string;
  id_fiscalia: number;
  descripcion_hechos?: string;
}

export interface UpdateInvestigacionRequest {
  nombre_caso?: string;
  fecha_inicio?: string;
  id_fiscalia?: number;
  descripcion_hechos?: string;
  activo?: boolean;
}

export interface IInvestigacionRepository {
  getAll(params?: { estado?: EstadoRevisionDicri; id_fiscalia?: number; activo?: boolean }): Promise<ApiResponse<Investigacion[]>>;
  getById(id: number): Promise<ApiResponse<Investigacion>>;
  create(data: CreateInvestigacionRequest): Promise<ApiResponse<Investigacion>>;
  update(id: number, data: UpdateInvestigacionRequest): Promise<ApiResponse<void>>;
  delete(id: number): Promise<ApiResponse<void>>;
}
