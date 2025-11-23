import type { IInvestigacionRepository, CreateInvestigacionRequest, UpdateInvestigacionRequest } from '../../domain/repositories/IInvestigacionRepository';
import type { Investigacion, EstadoRevisionDicri } from '../../domain/entities/Investigacion';
import type { ApiResponse } from '../../domain/entities/ApiResponse';
import { httpClient } from '../http/HttpClient';

class InvestigacionRepository implements IInvestigacionRepository {
  private baseUrl = '/investigaciones';

  async getAll(params?: { estado?: EstadoRevisionDicri; id_fiscalia?: number; activo?: boolean }): Promise<ApiResponse<Investigacion[]>> {
    const qs = new URLSearchParams();
    if (params?.estado) qs.append('estado', params.estado);
    if (params?.id_fiscalia !== undefined) qs.append('id_fiscalia', String(params.id_fiscalia));
    if (params?.activo !== undefined) qs.append('activo', String(params.activo));
    const url = `${this.baseUrl}${qs.toString() ? `?${qs.toString()}` : ''}`;
    const res = await httpClient.get<ApiResponse<Investigacion[]>>(url);
    return res.data;
  }

  async getById(id: number): Promise<ApiResponse<Investigacion>> {
    const res = await httpClient.get<ApiResponse<Investigacion>>(`${this.baseUrl}/${id}`);
    return res.data;
  }

  async create(data: CreateInvestigacionRequest): Promise<ApiResponse<Investigacion>> {
    const res = await httpClient.post<ApiResponse<Investigacion>>(this.baseUrl, data);
    return res.data;
  }

  async update(id: number, data: UpdateInvestigacionRequest): Promise<ApiResponse<void>> {
    const res = await httpClient.put<ApiResponse<void>>(`${this.baseUrl}/${id}`, data);
    return res.data;
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    const res = await httpClient.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
    return res.data;
  }
}

export const investigacionRepository = new InvestigacionRepository();
