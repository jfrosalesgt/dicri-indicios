import type { IFiscaliaRepository, CreateFiscaliaRequest, UpdateFiscaliaRequest } from '../../domain/repositories/IFiscaliaRepository';
import type { Fiscalia } from '../../domain/entities/Fiscalia';
import type { ApiResponse } from '../../domain/entities/ApiResponse';
import { httpClient } from '../http/HttpClient';

class FiscaliaRepository implements IFiscaliaRepository {
  private baseUrl = '/fiscalias';

  async getAll(params?: { activo?: boolean }): Promise<ApiResponse<Fiscalia[]>> {
    const qs = new URLSearchParams();
    if (params?.activo !== undefined) qs.append('activo', String(params.activo));
    const url = `${this.baseUrl}${qs.toString() ? `?${qs.toString()}` : ''}`;
    const res = await httpClient.get<ApiResponse<Fiscalia[]>>(url);
    return res.data;
  }

  async getById(id: number): Promise<ApiResponse<Fiscalia>> {
    const res = await httpClient.get<ApiResponse<Fiscalia>>(`${this.baseUrl}/${id}`);
    return res.data;
  }

  async create(data: CreateFiscaliaRequest): Promise<ApiResponse<Fiscalia>> {
    const res = await httpClient.post<ApiResponse<Fiscalia>>(this.baseUrl, data);
    return res.data;
  }

  async update(id: number, data: UpdateFiscaliaRequest): Promise<ApiResponse<void>> {
    const res = await httpClient.put<ApiResponse<void>>(`${this.baseUrl}/${id}`, data);
    return res.data;
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    const res = await httpClient.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
    return res.data;
  }
}

export const fiscaliaRepository = new FiscaliaRepository();
