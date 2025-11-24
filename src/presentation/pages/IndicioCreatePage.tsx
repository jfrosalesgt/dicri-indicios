import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, Typography, TextField, Button, Alert, MenuItem, Grid } from '@mui/material';
import { indicioRepository } from '../../infrastructure/repositories/IndicioRepository';
import { escenaRepository } from '../../infrastructure/repositories/EscenaRepository';
import { tipoIndicioRepository } from '../../infrastructure/repositories/TipoIndicioRepository';

interface FormData {
  codigo: string;
  escena: string;
  tipoIndicio: string;
  descripcion: string;
  ubicacion: string;
  fechaRecoleccion: string;
}

export const IndicioCreatePage = () => {
  const { id, escenaId } = useParams<{ id: string; escenaId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromRevision = (location.state as any)?.fromRevision === true;

  const [escenas, setEscenas] = useState<{ id_escena: number; nombre_escena: string }[]>([]);
  const [tipos, setTipos] = useState<{ id_tipo_indicio: number; nombre_tipo: string }[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, formState: { errors, isValid }, setValue } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      codigo: '',
      escena: escenaId || '',
      tipoIndicio: '',
      descripcion: '',
      ubicacion: '',
      fechaRecoleccion: '',
    },
  });

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const [escRes, tipRes] = await Promise.all([
          escenaRepository.getByExpediente(Number(id)),
          tipoIndicioRepository.getAll({ activo: true })
        ]);

        if (escRes.success && escRes.data) {
          const mapped = escRes.data.map(e => ({ 
            id_escena: e.id_escena, 
            nombre_escena: e.nombre_escena 
          }));
          setEscenas(mapped);

          // Preseleccionar escena
          if (escenaId) {
            setValue('escena', escenaId);
            if (!mapped.some(m => String(m.id_escena) === escenaId)) {
              setEscenas(prev => [...prev, { 
                id_escena: Number(escenaId), 
                nombre_escena: `Escena ${escenaId}` 
              }]);
            }
          }
        }

        if (tipRes.success && tipRes.data) {
          setTipos(tipRes.data.map(t => ({ 
            id_tipo_indicio: t.id_tipo_indicio, 
            nombre_tipo: t.nombre_tipo 
          })));
        }
      } catch (err) {
        console.error('Error cargando listas:', err);
      } finally {
        setLoadingLists(false);
      }
    };
    load();
  }, [id, escenaId, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    setError('');
    setSaving(true);

    try {
      const res = await indicioRepository.createForExpediente(Number(id), {
        codigo_indicio: data.codigo.trim(),
        id_escena: Number(data.escena),
        id_tipo_indicio: Number(data.tipoIndicio),
        descripcion_corta: data.descripcion.trim(),
        ubicacion_especifica: data.ubicacion.trim() || undefined,
        fecha_hora_recoleccion: data.fechaRecoleccion || undefined
      });

      if (!res.success || !res.data) throw new Error(res.message || 'Error');

      navigate(
        escenaId
          ? `/dashboard/expedientes/${id}/escenas/${escenaId}/indicios`
          : `/dashboard/expedientes/${id}/indicios`,
        { state: fromRevision ? { fromRevision: true } : undefined }
      );
    } catch (e: any) {
      setError(e.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Button
          variant="outlined"
          onClick={() => navigate(
            escenaId
              ? `/dashboard/expedientes/${id}/escenas/${escenaId}/indicios`
              : `/dashboard/expedientes/${id}/indicios`,
            { state: fromRevision ? { fromRevision: true } : undefined }
          )}
        >
          ← Volver
        </Button>
        <Typography variant="h5" fontWeight={600}>Nuevo Indicio</Typography>
        <Box width={80} />
      </Box>

      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={3}>
          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Controller
                name="codigo"
                control={control}
                rules={{ 
                  required: 'Código es requerido',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Código Indicio"
                    error={!!errors.codigo}
                    helperText={errors.codigo?.message}
                    disabled={saving}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="escena"
                control={control}
                rules={{ required: 'Escena es requerida' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Escena"
                    error={!!errors.escena}
                    helperText={errors.escena?.message}
                    disabled={saving || loadingLists || !!escenaId}
                    fullWidth
                  >
                    {escenas.map(sc => (
                      <MenuItem key={sc.id_escena} value={sc.id_escena}>
                        {sc.nombre_escena}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
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
                    disabled={saving || loadingLists}
                    fullWidth
                  >
                    {tipos.map(tp => (
                      <MenuItem key={tp.id_tipo_indicio} value={tp.id_tipo_indicio}>
                        {tp.nombre_tipo}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
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
                name="fechaRecoleccion"
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
          </Grid>

          <Box display="flex" gap={2} flexWrap="wrap">
            <Button type="submit" variant="contained" disabled={saving || !isValid}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button
              variant="text"
              disabled={saving}
              onClick={() => navigate(
                escenaId
                  ? `/dashboard/expedientes/${id}/escenas/${escenaId}/indicios`
                  : `/dashboard/expedientes/${id}/indicios`,
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
