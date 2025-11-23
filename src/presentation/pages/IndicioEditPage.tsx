import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, Typography, TextField, Button, Alert, MenuItem, Grid } from '@mui/material';
import { indicioRepository } from '../../infrastructure/repositories/IndicioRepository';
import { tipoIndicioRepository } from '../../infrastructure/repositories/TipoIndicioRepository';
import type { Indicio, EstadoIndicio } from '../../domain/entities/Indicio';

const estados: EstadoIndicio[] = ['RECOLECTADO', 'EN_CUSTODIA', 'EN_ANALISIS', 'ANALIZADO', 'DEVUELTO'];

interface FormData {
  descripcion: string;
  ubicacion: string;
  fechaReco: string;
  tipoIndicio: string;
  estado: EstadoIndicio;
}

export const IndicioEditPage = () => {
  const { id, indicioId } = useParams<{ id: string; indicioId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromRevision = (location.state as any)?.fromRevision === true;

  const [indicio, setIndicio] = useState<Indicio | null>(null);
  const [tipos, setTipos] = useState<{ id_tipo_indicio: number; nombre_tipo: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTipos, setLoadingTipos] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { control, handleSubmit, formState: { errors, isValid }, setValue } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      descripcion: '',
      ubicacion: '',
      fechaReco: '',
      tipoIndicio: '',
      estado: 'RECOLECTADO',
    },
  });

  useEffect(() => {
    const load = async () => {
      if (!indicioId) return;
      setLoading(true);
      setError('');
      try {
        const res = await indicioRepository.getById(Number(indicioId));
        if (res.success && res.data) {
          setIndicio(res.data);
          setValue('descripcion', res.data.descripcion_corta);
          setValue('ubicacion', res.data.ubicacion_especifica || '');
          setValue('fechaReco', res.data.fecha_hora_recoleccion ? res.data.fecha_hora_recoleccion.slice(0, 16) : '');
          setValue('tipoIndicio', String(res.data.id_tipo_indicio));
          setValue('estado', res.data.estado_actual);
        } else {
          setError(res.message || 'No encontrado');
        }
      } catch (e: any) {
        setError(e.message || 'Error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [indicioId, setValue]);

  useEffect(() => {
    const loadTipos = async () => {
      setLoadingTipos(true);
      try {
        const r = await tipoIndicioRepository.getAll({ activo: true });
        if (r.success && r.data) {
          setTipos(r.data.map(t => ({
            id_tipo_indicio: t.id_tipo_indicio,
            nombre_tipo: t.nombre_tipo
          })));
        }
      } catch (e: any) {
        setError(e.message || 'Error');
      } finally {
        setLoadingTipos(false);
      }
    };
    loadTipos();
  }, []);

  const onSubmit = async (data: FormData) => {
    if (!indicio) return;
    setSaving(true);
    setError('');

    try {
      const res = await indicioRepository.update(indicio.id_indicio, {
        descripcion_corta: data.descripcion.trim(),
        ubicacion_especifica: data.ubicacion.trim() || undefined,
        fecha_hora_recoleccion: data.fechaReco || undefined,
        id_tipo_indicio: data.tipoIndicio ? Number(data.tipoIndicio) : undefined,
        estado_actual: data.estado,
      });

      if (!res.success) throw new Error(res.message || 'Error al actualizar');

      navigate(`/dashboard/expedientes/${id}/indicios`, {
        state: fromRevision ? { fromRevision: true } : undefined
      });
    } catch (e: any) {
      setError(e.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (error && !indicio) return (
    <Box>
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      <Button variant="outlined" onClick={() => navigate(`/dashboard/expedientes/${id}/indicios`)}>Volver</Button>
    </Box>
  );

  return (
    <Box width="100%">
      <Typography variant="h5" mb={3} fontWeight={600}>
        Editar Indicio {indicio?.codigo_indicio}
      </Typography>

      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={3}>
          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Código"
                value={indicio?.codigo_indicio || ''}
                disabled
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <Controller
                name="descripcion"
                control={control}
                rules={{
                  required: 'Descripción es requerida',
                  minLength: { value: 10, message: 'Mínimo 10 caracteres' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descripción Corta"
                    error={!!errors.descripcion}
                    helperText={errors.descripcion?.message}
                    multiline
                    minRows={2}
                    disabled={saving}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="ubicacion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ubicación Específica"
                    disabled={saving}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="fechaReco"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fecha/Hora Recolección"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    disabled={saving}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="tipoIndicio"
                control={control}
                rules={{ required: 'Tipo es requerido' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Tipo Indicio"
                    error={!!errors.tipoIndicio}
                    helperText={errors.tipoIndicio?.message}
                    disabled={saving || loadingTipos}
                    fullWidth
                  >
                    {tipos.map(t => (
                      <MenuItem key={t.id_tipo_indicio} value={t.id_tipo_indicio}>
                        {t.nombre_tipo}
                      </MenuItem>
                    ))}
                    {!loadingTipos && tipos.length === 0 && (
                      <MenuItem value="" disabled>Sin tipos activos</MenuItem>
                    )}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="estado"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Estado"
                    disabled={saving}
                    fullWidth
                  >
                    {estados.map(es => (
                      <MenuItem key={es} value={es}>{es}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          <Box display="flex" gap={2} flexWrap="wrap">
            <Button type="submit" variant="contained" disabled={saving || !isValid}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
            <Button
              variant="text"
              disabled={saving}
              onClick={() => navigate(
                `/dashboard/expedientes/${id}/indicios`,
                { state: fromRevision ? { fromRevision: true } : undefined }
              )}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
