import type { IIndicioRepository, CreateIndicioRequest, UpdateIndicioRequest } from '../../domain/repositories/IIndicioRepository';
import type { Indicio, EstadoIndicio } from '../../domain/entities/Indicio';
import type { ApiResponse } from '../../domain/entities/ApiResponse';
import { httpClient } from '../http/HttpClient';

class IndicioRepository implements IIndicioRepository {
  private baseUrl = '/indicios';

  async getAll(params?: { id_escena?: number; id_tipo_indicio?: number; estado?: EstadoIndicio; activo?: boolean }): Promise<ApiResponse<Indicio[]>> {
    const qs = new URLSearchParams();
    if (params?.id_escena !== undefined) qs.append('id_escena', String(params.id_escena));
    if (params?.id_tipo_indicio !== undefined) qs.append('id_tipo_indicio', String(params.id_tipo_indicio));
    if (params?.estado) qs.append('estado', params.estado);
    if (params?.activo !== undefined) qs.append('activo', String(params.activo));
    const url = `${this.baseUrl}${qs.toString() ? `?${qs.toString()}` : ''}`;
    const res = await httpClient.get<ApiResponse<Indicio[]>>(url);
    return res.data;
  }

  async getById(id: number): Promise<ApiResponse<Indicio>> {
    const res = await httpClient.get<ApiResponse<Indicio>>(`${this.baseUrl}/${id}`);
    return res.data;
  }

  async create(data: CreateIndicioRequest): Promise<ApiResponse<Indicio>> {
    const res = await httpClient.post<ApiResponse<Indicio>>(this.baseUrl, data);
    return res.data;
  }

  async update(id: number, data: UpdateIndicioRequest): Promise<ApiResponse<void>> {
    const res = await httpClient.put<ApiResponse<void>>(`${this.baseUrl}/${id}`, data);
    return res.data;
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    const res = await httpClient.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
    return res.data;
  }
}

export const indicioRepository = new IndicioRepository();
