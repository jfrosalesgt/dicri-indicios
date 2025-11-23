export interface Escena {
  id_escena: number;
  id_investigacion: number;
  nombre_escena: string;
  direccion_escena?: string | null;
  fecha_hora_inicio: string;
  fecha_hora_fin?: string | null;
  descripcion?: string | null;
  activo: boolean;
  usuario_creacion?: string;
  fecha_creacion?: string;
  usuario_actualizacion?: string | null;
  fecha_actualizacion?: string | null;
}
