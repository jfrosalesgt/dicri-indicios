import { httpClient } from '../http/HttpClient';
import type { ApiResponse } from '../../domain/entities/ApiResponse';
import type { ReporteRevisionExpediente, EstadisticasGenerales } from '../../domain/entities/Reportes';

class ReportesRepository {
  async getRevisionExpedientes(params: { fecha_inicio: string; fecha_fin: string; estado_revision?: string }) {
    const qs = new URLSearchParams();
    qs.append('fecha_inicio', params.fecha_inicio);
    qs.append('fecha_fin', params.fecha_fin);
    if (params.estado_revision) qs.append('estado_revision', params.estado_revision);
    const res = await httpClient.get<ApiResponse<ReporteRevisionExpediente[]>>(`/reportes/revision-expedientes?${qs.toString()}`);
    return res.data;
  }

  async getEstadisticasGenerales() {
    const res = await httpClient.get<ApiResponse<EstadisticasGenerales>>('/reportes/estadisticas-generales');
    return res.data;
  }
}

export const reportesRepository = new ReportesRepository();
