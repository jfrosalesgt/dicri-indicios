import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Card, Typography, TextField, Button, Alert, MenuItem, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { expedienteRepository } from '../../infrastructure/repositories/ExpedienteRepository';
import { fiscaliaRepository } from '../../infrastructure/repositories/FiscaliaRepository';

interface FormData {
  codigoCaso: string;
  nombreCaso: string;
  fechaInicio: string;
  idFiscalia: number | '';
  descripcionHechos: string;
  activo: boolean;
}

export const ExpedienteCreatePage = () => {
  const navigate = useNavigate();
  const [fiscalias, setFiscalias] = useState<{ id_fiscalia: number; nombre_fiscalia: string }[]>([]);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingFiscalias, setLoadingFiscalias] = useState(false);

  // ✅ React Hook Form
  const { control, handleSubmit, formState: { errors, isValid }, watch } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      codigoCaso: '',
      nombreCaso: '',
      fechaInicio: '',
      idFiscalia: '',
      descripcionHechos: '',
      activo: true,
    },
  });

  useEffect(() => {
    const loadFiscalias = async () => {
      setLoadingFiscalias(true);
      try {
        const res = await fiscaliaRepository.getAll({ activo: true });
        if (res.success && res.data) {
          setFiscalias(res.data.map(f => ({ 
            id_fiscalia: f.id_fiscalia, 
            nombre_fiscalia: f.nombre_fiscalia 
          })));
        }
      } catch (err) {
        console.error('Error cargando fiscalías:', err);
      } finally {
        setLoadingFiscalias(false);
      }
    };
    loadFiscalias();
  }, []);

  const onSubmit = async (data: FormData) => {
    setError('');
    setDone(false);
    setSaving(true);

    try {
      const res = await expedienteRepository.create({
        codigo_caso: data.codigoCaso.trim(),
        nombre_caso: data.nombreCaso.trim(),
        fecha_inicio: data.fechaInicio,
        id_fiscalia: Number(data.idFiscalia),
        descripcion_hechos: data.descripcionHechos.trim() || undefined,
      });

      if (!res.success || !res.data) {
        setError(res.message || 'Error al registrar');
      } else {
        setDone(true);
        navigate(`/dashboard/expedientes/${res.data.id_investigacion}`);
      }
    } catch (e: any) {
      setError(e.message || 'Error al registrar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Button variant="outlined" onClick={() => navigate('/dashboard/expedientes')}>
          ← Volver
        </Button>
        <Typography variant="h5" fontWeight={600}>Nuevo Expediente</Typography>
        <Box width={80} />
      </Box>

      <Card sx={{ p: 3, borderRadius: 3, width: '100%', boxSizing: 'border-box' }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={3}>
          {error && <Alert severity="error">{error}</Alert>}
          {done && <Alert severity="success">Expediente creado exitosamente</Alert>}

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Controller
                name="codigoCaso"
                control={control}
                rules={{ 
                  required: 'Código es requerido',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Código Caso"
                    error={!!errors.codigoCaso}
                    helperText={errors.codigoCaso?.message}
                    disabled={saving}
                    placeholder="MP001-2025-1001"
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="nombreCaso"
                control={control}
                rules={{ 
                  required: 'Nombre es requerido',
                  minLength: { value: 5, message: 'Mínimo 5 caracteres' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre del Caso"
                    error={!!errors.nombreCaso}
                    helperText={errors.nombreCaso?.message}
                    disabled={saving}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="fechaInicio"
                control={control}
                rules={{ required: 'Fecha es requerida' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fecha de Inicio"
                    type="date"
                    error={!!errors.fechaInicio}
                    helperText={errors.fechaInicio?.message}
                    disabled={saving}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="idFiscalia"
                control={control}
                rules={{ required: 'Fiscalía es requerida' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Fiscalía"
                    error={!!errors.idFiscalia}
                    helperText={errors.idFiscalia?.message}
                    disabled={saving || loadingFiscalias}
                    fullWidth
                  >
                    {fiscalias.map((f) => (
                      <MenuItem key={f.id_fiscalia} value={f.id_fiscalia}>
                        {f.nombre_fiscalia}
                      </MenuItem>
                    ))}
                    {loadingFiscalias && <MenuItem disabled>Cargando...</MenuItem>}
                  </TextField>
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

            <Grid item xs={12}>
              <Controller
                name="descripcionHechos"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descripción de los Hechos"
                    multiline
                    minRows={3}
                    fullWidth
                    disabled={saving}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box display="flex" gap={2} flexWrap="wrap" justifyContent="flex-start">
            <Button
              type="submit"
              variant="contained"
              disabled={saving || !isValid}
            >
              {saving ? 'Guardando...' : 'Guardar Expediente'}
            </Button>
            <Button
              variant="text"
              onClick={() => navigate('/dashboard/expedientes')}
              disabled={saving}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};