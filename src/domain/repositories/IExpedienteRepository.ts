import type { Expediente, EstadoRevisionDicri } from '../entities/Expediente';
import type { ApiResponse, PaginatedResponse } from '../entities/ApiResponse';

export interface CreateExpedienteRequest {
  codigo_caso: string;
  nombre_caso: string;
  fecha_inicio: string;        // YYYY-MM-DD
  id_fiscalia: number;
  descripcion_hechos?: string;
}

export interface UpdateExpedienteRequest {
  nombre_caso?: string;
  fecha_inicio?: string;
  id_fiscalia?: number;
  descripcion_hechos?: string;
  estado_revision_dicri?: EstadoRevisionDicri;
  activo?: boolean;
}

export interface IExpedienteRepository {
  getAll(params?: {
    estado_revision_dicri?: EstadoRevisionDicri;
    id_fiscalia?: number;
    id_usuario_registro?: number;
    activo?: boolean;
  }): Promise<ApiResponse<Expediente[]>>;
  getById(id: number): Promise<ApiResponse<Expediente>>;
  create(data: CreateExpedienteRequest): Promise<ApiResponse<Expediente>>;
  update(id: number, data: UpdateExpedienteRequest): Promise<ApiResponse<void>>;
  delete(id: number): Promise<ApiResponse<void>>;
  // Post actions for review workflow
  enviarRevision(id: number): Promise<ApiResponse<void>>;
  aprobar(id: number): Promise<ApiResponse<void>>;
  rechazar(id: number, data: { justificacion: string }): Promise<ApiResponse<void>>;
  getPaged(params: {
    page: number;
    pageSize: number;
    estado_revision_dicri?: EstadoRevisionDicri;
    id_fiscalia?: number;
    id_usuario_registro?: number;
    activo?: boolean;
  }): Promise<PaginatedResponse<Expediente>>;
}