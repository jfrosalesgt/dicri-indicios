export interface Module {
  id_modulo: number;
  nombre_modulo: string;
  descripcion: string;
  ruta: string;
  icono: string;
  orden: number;
  id_modulo_padre: number | null;
  activo: boolean;
  usuario_creacion: string;
  fecha_creacion: string;
  usuario_actualizacion: string | null;
  fecha_actualizacion: string | null;
}