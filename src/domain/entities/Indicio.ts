export type EstadoIndicio = 'RECOLECTADO' | 'EN_CUSTODIA' | 'EN_ANALISIS' | 'ANALIZADO' | 'DEVUELTO';

export interface Indicio {
  id_indicio: number;
  codigo_indicio: string;
  id_escena: number;
  id_tipo_indicio: number;
  descripcion_corta: string;
  ubicacion_especifica?: string;
  fecha_hora_recoleccion?: string;
  id_usuario_recolector?: number;
  estado_actual: EstadoIndicio;
  activo: boolean;
  // Campos adicionales en respuesta de creación vía /expedientes/{id}/indicios
  tipo_indicio?: string;
  nombre_escena?: string;
  direccion_escena?: string;
  codigo_caso?: string;
  nombre_caso?: string;
  nombre_fiscalia?: string;
  recolector_nombre?: string;
  recolector_apellido?: string;
  usuario_creacion?: string;
  fecha_creacion?: string;
  usuario_actualizacion?: string | null;
  fecha_actualizacion?: string | null;
}
