export interface Fiscalia {
  id_fiscalia: number;
  nombre_fiscalia: string;
  direccion?: string | null;
  telefono?: string | null;
  activo: boolean;
  usuario_creacion?: string;
  fecha_creacion?: string;
  usuario_actualizacion?: string | null;
  fecha_actualizacion?: string | null;
}
