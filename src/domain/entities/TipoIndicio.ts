export interface TipoIndicio {
  id_tipo_indicio: number;
  nombre_tipo: string;
  descripcion?: string | null;
  activo: boolean;
  usuario_creacion?: string;
  fecha_creacion?: string;
  usuario_actualizacion?: string | null;
  fecha_actualizacion?: string | null;
}
