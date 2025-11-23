import type { Fiscalia } from '../entities/Fiscalia';
import type { ApiResponse } from '../entities/ApiResponse';

export interface CreateFiscaliaRequest {
  nombre_fiscalia: string;
  direccion?: string;
  telefono?: string;
}

export interface UpdateFiscaliaRequest {
  nombre_fiscalia?: string;
  direccion?: string;
  telefono?: string;
  activo?: boolean;
}

export interface IFiscaliaRepository {
  getAll(params?: { activo?: boolean }): Promise<ApiResponse<Fiscalia[]>>;
  getById(id: number): Promise<ApiResponse<Fiscalia>>;
  create(data: CreateFiscaliaRequest): Promise<ApiResponse<Fiscalia>>;
  update(id: number, data: UpdateFiscaliaRequest): Promise<ApiResponse<void>>;
  delete(id: number): Promise<ApiResponse<void>>;
}
