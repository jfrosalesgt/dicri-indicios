import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Chip, Button, Alert, TextField, MenuItem, Grid } from '@mui/material';
import { fiscaliaRepository } from '../../infrastructure/repositories/FiscaliaRepository';
import type { Fiscalia } from '../../domain/entities/Fiscalia';

interface FiscaliaFormData {
  nombre_fiscalia: string;
  direccion: string;
  telefono: string;
  activo: boolean;
}

export const FiscaliaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Fiscalia | null>(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, formState: { errors, isValid }, setValue } = useForm<FiscaliaFormData>({
    mode: 'onChange',
    defaultValues: {
      nombre_fiscalia: '',
      direccion: '',
      telefono: '',
      activo: true,
    },
  });

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true); 
      setError('');
      try {
        const res = await fiscaliaRepository.getById(Number(id));
        if (res.success && res.data) {
          setItem(res.data);
          setValue('nombre_fiscalia', res.data.nombre_fiscalia);
          setValue('direccion', res.data.direccion || '');
          setValue('telefono', res.data.telefono || '');
          setValue('activo', res.data.activo);
        } else {
          setError(res.message || 'Error');
        }
      } catch (e: any) { 
        setError(e.message || 'Error'); 
      } finally { 
        setLoading(false); 
      }
    };
    load();
  }, [id, setValue]);

  const onSubmit = async (data: FiscaliaFormData) => {
    if (!item) return;
    
    setSaving(true);
    setError('');

    try {
      const res = await fiscaliaRepository.update(item.id_fiscalia, {
        nombre_fiscalia: data.nombre_fiscalia.trim(),
        direccion: data.direccion.trim() || undefined,
        telefono: data.telefono.trim() || undefined,
        activo: data.activo,
      });

      if (!res.success) throw new Error(res.message || 'Error al actualizar');
      
      setEdit(false);
      
      // Refrescar datos
      const refreshed = await fiscaliaRepository.getById(item.id_fiscalia);
      if (refreshed.success && refreshed.data) {
        setItem(refreshed.data);
      }
    } catch (e: any) { 
      setError(e.message || 'Error'); 
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item || !confirm('¿Está seguro de eliminar esta fiscalía?')) return;

    try {
      const res = await fiscaliaRepository.delete(item.id_fiscalia);
      if (!res.success) throw new Error(res.message);
      navigate('/dashboard/fiscalias');
    } catch (e: any) { 
      setError(e.message || 'Error al eliminar'); 
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  
  if (error && !item) return (
    <Box>
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      <Button variant="outlined" onClick={() => navigate('/dashboard/fiscalias')}>Volver</Button>
    </Box>
  );

  if (!item) return null;

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Button variant="outlined" onClick={() => navigate('/dashboard/fiscalias')}>
          ← Volver
        </Button>
        <Typography variant="h5" fontWeight={600}>Detalle de Fiscalía</Typography>
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
                    {item.nombre_fiscalia}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ bgcolor: '#f5f7fa', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                    Dirección
                  </Typography>
                  <Typography variant="body2" mt={0.5}>
                    {item.direccion || '—'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ bgcolor: '#f5f7fa', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                    Teléfono
                  </Typography>
                  <Typography variant="body2" mt={0.5}>
                    {item.telefono || '—'}
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
                    {item.id_fiscalia}
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
                  name="nombre_fiscalia"
                  control={control}
                  rules={{ 
                    required: 'Nombre es requerido',
                    minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre Fiscalía"
                      error={!!errors.nombre_fiscalia}
                      helperText={errors.nombre_fiscalia?.message}
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
                  name="telefono"
                  control={control}
                  rules={{
                    pattern: {
                      value: /^[0-9\s\-+()]*$/,
                      message: 'Formato de teléfono inválido'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Teléfono"
                      error={!!errors.telefono}
                      helperText={errors.telefono?.message}
                      disabled={saving}
                      placeholder="Ej: +502 1234-5678"
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
                  if (item) {
                    setValue('nombre_fiscalia', item.nombre_fiscalia);
                    setValue('direccion', item.direccion || '');
                    setValue('telefono', item.telefono || '');
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
