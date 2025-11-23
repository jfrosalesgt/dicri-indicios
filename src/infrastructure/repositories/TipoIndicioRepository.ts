import type { ITipoIndicioRepository, CreateTipoIndicioRequest, UpdateTipoIndicioRequest } from '../../domain/repositories/ITipoIndicioRepository';
import type { TipoIndicio } from '../../domain/entities/TipoIndicio';
import type { ApiResponse } from '../../domain/entities/ApiResponse';
import { httpClient } from '../http/HttpClient';

class TipoIndicioRepository implements ITipoIndicioRepository {
  private baseUrl = '/tipos-indicio';

  async getAll(params?: { activo?: boolean }): Promise<ApiResponse<TipoIndicio[]>> {
    const qs = new URLSearchParams();
    if (params?.activo !== undefined) qs.append('activo', String(params.activo));
    const url = `${this.baseUrl}${qs.toString() ? `?${qs.toString()}` : ''}`;
    const res = await httpClient.get<ApiResponse<TipoIndicio[]>>(url);
    return res.data;
  }

  async getById(id: number): Promise<ApiResponse<TipoIndicio>> {
    const res = await httpClient.get<ApiResponse<TipoIndicio>>(`${this.baseUrl}/${id}`);
    return res.data;
  }

  async create(data: CreateTipoIndicioRequest): Promise<ApiResponse<TipoIndicio>> {
    const res = await httpClient.post<ApiResponse<TipoIndicio>>(this.baseUrl, data);
    return res.data;
  }

  async update(id: number, data: UpdateTipoIndicioRequest): Promise<ApiResponse<void>> {
    const res = await httpClient.put<ApiResponse<void>>(`${this.baseUrl}/${id}`, data);
    return res.data;
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    const res = await httpClient.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
    return res.data;
  }
}

export const tipoIndicioRepository = new TipoIndicioRepository();
