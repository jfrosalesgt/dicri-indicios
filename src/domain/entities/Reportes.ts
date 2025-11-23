export interface ReporteRevisionExpediente {
  codigo_caso: string;
  nombre_caso: string;
  nombre_fiscalia: string;
  fecha_registro: string;
  tecnico_registra: string;
  estado_actual: string;
  fecha_revision: string;
  coordinador_revision: string;
  justificacion_revision: string;
}

export interface EstadisticasGenerales {
  total_expedientes: number;
  en_registro: number;
  pendiente_revision: number;
  aprobados: number;
  rechazados: number;
  total_indicios: number;
  expedientes_por_fiscalia: { nombre_fiscalia: string; total: number }[];
}
