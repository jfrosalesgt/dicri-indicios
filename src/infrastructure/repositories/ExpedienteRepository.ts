import type { IExpedienteRepository, CreateExpedienteRequest, UpdateExpedienteRequest } from '../../domain/repositories/IExpedienteRepository';
import type { Expediente, EstadoRevisionDicri } from '../../domain/entities/Expediente';
import type { ApiResponse, PaginatedResponse } from '../../domain/entities/ApiResponse';
import { httpClient } from '../http/HttpClient';

class ExpedienteRepository implements IExpedienteRepository {
  private readonly baseUrl = '/expedientes';

  async create(data: CreateExpedienteRequest): Promise<ApiResponse<Expediente>> {
    const response = await httpClient.post<ApiResponse<Expediente>>(this.baseUrl, data);
    return response.data;
  }

  async getAll(params?: { estado_revision_dicri?: EstadoRevisionDicri; id_fiscalia?: number; id_usuario_registro?: number; activo?: boolean }): Promise<ApiResponse<Expediente[]>> {
    const q = new URLSearchParams();
    if (params?.estado_revision_dicri) q.append('estado_revision', params.estado_revision_dicri);
    if (params?.id_fiscalia !== undefined) q.append('id_fiscalia', String(params.id_fiscalia));
    if (params?.id_usuario_registro !== undefined) q.append('id_usuario_registro', String(params.id_usuario_registro));
    if (params?.activo !== undefined) q.append('activo', String(params.activo));
    const url = `${this.baseUrl}${q.toString() ? `?${q.toString()}` : ''}`;
    const response = await httpClient.get<ApiResponse<Expediente[]>>(url);
    return response.data;
  }

  async getById(id: number): Promise<ApiResponse<Expediente>> {
    const response = await httpClient.get<ApiResponse<Expediente>>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getPaged(params: { page: number; pageSize: number; estado_revision_dicri?: EstadoRevisionDicri; id_fiscalia?: number; id_usuario_registro?: number; activo?: boolean }): Promise<PaginatedResponse<Expediente>> {
    const base = await this.getAll({ estado_revision_dicri: params.estado_revision_dicri, id_fiscalia: params.id_fiscalia, id_usuario_registro: params.id_usuario_registro, activo: params.activo });
    return {
      success: base.success,
      message: base.message,
      data: {
        items: base.data || [],
        total: (base.data || []).length,
        page: 1,
        pageSize: (base.data || []).length,
        totalPages: 1,
      },
    };
  }

  async update(id: number, data: UpdateExpedienteRequest): Promise<ApiResponse<void>> {
    const response = await httpClient.put<ApiResponse<void>>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Acciones de flujo DICRI
  async enviarRevision(id: number): Promise<ApiResponse<void>> {
    const res = await httpClient.post<ApiResponse<void>>(`${this.baseUrl}/${id}/enviar-revision`, {});
    return res.data;
  }

  async aprobar(id: number): Promise<ApiResponse<void>> {
    const res = await httpClient.post<ApiResponse<void>>(`${this.baseUrl}/${id}/aprobar`, {});
    return res.data;
  }

  async rechazar(id: number, data: { justificacion: string }): Promise<ApiResponse<void>> {
    const res = await httpClient.post<ApiResponse<void>>(`${this.baseUrl}/${id}/rechazar`, data);
    return res.data;
  }
}

export const expedienteRepository = new ExpedienteRepository();