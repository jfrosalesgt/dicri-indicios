import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Chip, Button, Alert, TextField, MenuItem, Grid } from '@mui/material';
import { tipoIndicioRepository } from '../../infrastructure/repositories/TipoIndicioRepository';
import type { TipoIndicio } from '../../domain/entities/TipoIndicio';

interface TipoIndicioFormData {
  nombre_tipo: string;
  descripcion: string;
  activo: boolean;
}

export const TipoIndicioDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<TipoIndicio | null>(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // ✅ React Hook Form
  const { control, handleSubmit, formState: { errors, isValid }, setValue } = useForm<TipoIndicioFormData>({
    mode: 'onChange',
    defaultValues: {
      nombre_tipo: '',
      descripcion: '',
      activo: true,
    },
  });

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true); 
      setError('');
      try {
        const res = await tipoIndicioRepository.getById(Number(id));
        if (res.success && res.data) {
          setItem(res.data);
          // ✅ Cargar datos en el formulario
          setValue('nombre_tipo', res.data.nombre_tipo);
          setValue('descripcion', res.data.descripcion || '');
          setValue('activo', res.data.activo);
        } else {
          setError(res.message || 'Error');
        }
      } catch(e: any) { 
        setError(e.message || 'Error'); 
      } finally { 
        setLoading(false); 
      }
    };
    load();
  }, [id, setValue]);

  const onSubmit = async (data: TipoIndicioFormData) => {
    if (!item) return;
    
    setSaving(true);
    setError('');

    try {
      const res = await tipoIndicioRepository.update(item.id_tipo_indicio, {
        nombre_tipo: data.nombre_tipo.trim(),
        descripcion: data.descripcion.trim() || undefined,
        activo: data.activo,
      });

      if (!res.success) throw new Error(res.message || 'Error al actualizar');
      
      setEdit(false);
      
      // Refrescar datos
      const refreshed = await tipoIndicioRepository.getById(item.id_tipo_indicio);
      if (refreshed.success && refreshed.data) {
        setItem(refreshed.data);
      }
    } catch(e: any) { 
      setError(e.message || 'Error'); 
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item || !confirm('¿Está seguro de eliminar este tipo de indicio?')) return;

    try {
      const res = await tipoIndicioRepository.delete(item.id_tipo_indicio);
      if (!res.success) throw new Error(res.message || 'Error al eliminar');
      navigate('/dashboard/tipos-indicio');
    } catch(e: any) { 
      setError(e.message || 'Error al eliminar'); 
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  
  if (error && !item) return (
    <Box>
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      <Button variant="outlined" onClick={() => navigate('/dashboard/tipos-indicio')}>Volver</Button>
    </Box>
  );

  if (!item) return null;

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Button variant="outlined" onClick={() => navigate('/dashboard/tipos-indicio')}>
          ← Volver
        </Button>
        <Typography variant="h5" fontWeight={600}>Detalle de Tipo de Indicio</Typography>
        <Box width={80} />
      </Box>

      <Card sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        {!edit ? (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ bgcolor: '#f5f7fa', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                    Nombre
                  </Typography>
                  <Typography variant="h6" mt={0.5}>
                    {item.nombre_tipo}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ bgcolor: '#f5f7fa', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                    Descripción
                  </Typography>
                  <Typography variant="body2" mt={0.5} sx={{ whiteSpace: 'pre-wrap' }}>
                    {item.descripcion || '—'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ bgcolor: '#f5f7fa', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                    Estado
                  </Typography>
                  <Box mt={0.5}>
                    <Chip 
                      size="small" 
                      label={item.activo ? 'Activo' : 'Inactivo'} 
                      color={item.activo ? 'success' : 'default'} 
                      sx={{ width: 'fit-content' }}
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ bgcolor: '#f5f7fa', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                    ID
                  </Typography>
                  <Typography variant="body2" mt={0.5}>
                    {item.id_tipo_indicio}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Box mt={3} display="flex" gap={2} flexWrap="wrap">
              <Button variant="contained" onClick={() => setEdit(true)}>
                Editar
              </Button>
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Eliminar
              </Button>
            </Box>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="nombre_tipo"
                  control={control}
                  rules={{ 
                    required: 'Nombre es requerido',
                    minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre del Tipo de Indicio"
                      error={!!errors.nombre_tipo}
                      helperText={errors.nombre_tipo?.message}
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
                  rules={{
                    minLength: { value: 10, message: 'Mínimo 10 caracteres si se proporciona' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Descripción"
                      error={!!errors.descripcion}
                      helperText={errors.descripcion?.message}
                      multiline
                      minRows={4}
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
              <Button 
                type="submit" 
                variant="contained" 
                disabled={saving || !isValid}
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              
              <Button 
                variant="text" 
                onClick={() => {
                  setEdit(false);
                  setError('');
                  // ✅ Restaurar valores originales
                  if (item) {
                    setValue('nombre_tipo', item.nombre_tipo);
                    setValue('descripcion', item.descripcion || '');
                    setValue('activo', item.activo);
                  }
                }} 
                disabled={saving}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        )}
        
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Card>
    </Box>
  );
};
