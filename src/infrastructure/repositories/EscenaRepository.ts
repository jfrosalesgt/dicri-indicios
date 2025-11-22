import type { IEscenaRepository, CreateEscenaRequest, UpdateEscenaRequest } from '../../domain/repositories/IEscenaRepository';
import type { Escena } from '../../domain/entities/Escena';
import type { ApiResponse } from '../../domain/entities/ApiResponse';
import { httpClient } from '../http/HttpClient';

class EscenaRepository implements IEscenaRepository {
  async getByExpediente(expedienteId: number): Promise<ApiResponse<Escena[]>> {
    const res = await httpClient.get<ApiResponse<Escena[]>>(`/expedientes/${expedienteId}/escenas`);
    return res.data;
  }
  async createForExpediente(expedienteId: number, data: CreateEscenaRequest): Promise<ApiResponse<Escena>> {
    const res = await httpClient.post<ApiResponse<Escena>>(`/expedientes/${expedienteId}/escenas`, data);
    return res.data;
  }
  async getById(id: number): Promise<ApiResponse<Escena>> {
    const res = await httpClient.get<ApiResponse<Escena>>(`/escenas/${id}`);
    return res.data;
  }
  async update(id: number, data: UpdateEscenaRequest): Promise<ApiResponse<void>> {
    const res = await httpClient.put<ApiResponse<void>>(`/escenas/${id}`, data);
    return res.data;
  }
  async delete(id: number): Promise<ApiResponse<void>> {
    const res = await httpClient.delete<ApiResponse<void>>(`/escenas/${id}`);
    return res.data;
  }
}
export const escenaRepository = new EscenaRepository();
