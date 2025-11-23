import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, Typography, TextField, Button, Alert, Grid, MenuItem } from '@mui/material';
import { escenaRepository } from '../../infrastructure/repositories/EscenaRepository';
import type { Escena } from '../../domain/entities/Escena';

interface FormData {
  nombre: string;
  direccion: string;
  inicio: string;
  fin: string;
  descripcion: string;
  activo: boolean;
}

export const SceneEditPage = () => {
  const { id, escenaId } = useParams<{ id: string; escenaId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromRevision = (location.state as any)?.fromRevision === true;

  const { control, handleSubmit, formState: { errors, isValid }, setValue, watch } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      nombre: '',
      direccion: '',
      inicio: '',
      fin: '',
      descripcion: '',
      activo: true,
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [escena, setEscena] = useState<Escena | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!escenaId) return;
      setLoading(true);
      setError('');
      try {
        const res = await escenaRepository.getById(Number(escenaId));
        if (res.success && res.data) {
          setEscena(res.data);
          setValue('nombre', res.data.nombre_escena);
          setValue('direccion', res.data.direccion_escena || '');
          setValue('inicio', res.data.fecha_hora_inicio.slice(0, 16));
          setValue('fin', res.data.fecha_hora_fin ? res.data.fecha_hora_fin.slice(0, 16) : '');
          setValue('descripcion', res.data.descripcion || '');
          setValue('activo', res.data.activo);
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
  }, [escenaId, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!escena) return;
    setError('');
    setSaving(true);

    try {
      const res = await escenaRepository.update(escena.id_escena, {
        nombre_escena: data.nombre.trim(),
        direccion_escena: data.direccion.trim() || undefined,
        fecha_hora_inicio: data.inicio,
        fecha_hora_fin: data.fin || null,
        descripcion: data.descripcion.trim() || undefined,
        activo: data.activo,
      });

      if (!res.success) throw new Error(res.message || 'Error');

      navigate(`/dashboard/expedientes/${id}/escenas`, {
        state: fromRevision ? { fromRevision: true } : undefined
      });
    } catch (e: any) {
      setError(e.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (error && !escena) return (
    <Box>
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      <Button variant="outlined" onClick={() => navigate(`/dashboard/expedientes/${id}/escenas`)}>Volver</Button>
    </Box>
  );

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Button
          variant="outlined"
          onClick={() => navigate(
            `/dashboard/expedientes/${id}/escenas`,
            { state: fromRevision ? { fromRevision: true } : undefined }
          )}
        >
          ← Volver
        </Button>
        <Typography variant="h5" fontWeight={600}>Editar Escena</Typography>
        <Box width={80} />
      </Box>

      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={3}>
          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Controller
                name="nombre"
                control={control}
                rules={{
                  required: 'Nombre es requerido',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre Escena"
                    error={!!errors.nombre}
                    helperText={errors.nombre?.message}
                    disabled={saving}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="direccion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Dirección"
                    disabled={saving}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="inicio"
                control={control}
                rules={{ required: 'Fecha/Hora inicio es requerida' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fecha/Hora Inicio"
                    type="datetime-local"
                    error={!!errors.inicio}
                    helperText={errors.inicio?.message}
                    InputLabelProps={{ shrink: true }}
                    disabled={saving}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="fin"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fecha/Hora Fin"
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
                name="descripcion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descripción"
                    multiline
                    minRows={3}
                    disabled={saving}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="activo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Estado"
                    value={field.value ? 'true' : 'false'}
                    onChange={(e) => field.onChange(e.target.value === 'true')}
                    disabled={saving}
                    fullWidth
                  >
                    <MenuItem value="true">Activo</MenuItem>
                    <MenuItem value="false">Inactivo</MenuItem>
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
                `/dashboard/expedientes/${id}/escenas`,
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
