import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, Typography, TextField, Button, Alert, Grid } from '@mui/material';
import { escenaRepository } from '../../infrastructure/repositories/EscenaRepository';

interface FormData {
  nombre: string;
  direccion: string;
  inicio: string;
  fin: string;
  descripcion: string;
}

export const SceneCreatePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromRevision = (location.state as any)?.fromRevision === true;

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // ✅ React Hook Form
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      nombre: '',
      direccion: '',
      inicio: '',
      fin: '',
      descripcion: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    setError('');
    setSaving(true);

    try {
      const res = await escenaRepository.createForExpediente(Number(id), {
        id_investigacion: Number(id),
        nombre_escena: data.nombre.trim(),
        direccion_escena: data.direccion.trim() || undefined,
        fecha_hora_inicio: data.inicio,
        fecha_hora_fin: data.fin || null,
        descripcion: data.descripcion.trim() || undefined
      });

      if (!res.success || !res.data) throw new Error(res.message || 'Error');

      navigate(`/dashboard/expedientes/${id}/escenas`, { 
        state: fromRevision ? { fromRevision: true } : undefined 
      });
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
            `/dashboard/expedientes/${id}/escenas`,
            { state: fromRevision ? { fromRevision: true } : undefined }
          )}
        >
          ← Volver
        </Button>
        <Typography variant="h5" fontWeight={600}>Nueva Escena</Typography>
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

            <Grid item xs={12}>
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
          </Grid>

          <Box display="flex" gap={2} flexWrap="wrap">
            <Button type="submit" variant="contained" disabled={saving || !isValid}>
              {saving ? 'Guardando...' : 'Guardar'}
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
