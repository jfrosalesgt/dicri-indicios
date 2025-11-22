export type EstadoRevisionDicri = 'EN_REGISTRO' | 'PENDIENTE_REVISION' | 'APROBADO' | 'RECHAZADO';

export interface Investigacion {
  id_investigacion: number;
  codigo_caso: string;
  nombre_caso: string;
  fecha_inicio: string; // YYYY-MM-DD
  id_fiscalia: number;
  nombre_fiscalia?: string;
  descripcion_hechos?: string;
  estado_revision_dicri: EstadoRevisionDicri;
  id_usuario_registro?: number;
  id_usuario_revision?: number | null;
  justificacion_revision?: string | null;
  fecha_revision?: string | null;
  activo: boolean;
  usuario_creacion?: string;
  fecha_creacion?: string;
  usuario_actualizacion?: string | null;
  fecha_actualizacion?: string | null;
}
