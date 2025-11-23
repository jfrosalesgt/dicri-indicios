import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Card, Typography, TextField, Button, Alert, Grid } from '@mui/material';
import { fiscaliaRepository } from '../../infrastructure/repositories/FiscaliaRepository';
import { useNavigate } from 'react-router-dom';

interface FiscaliaFormData {
  nombre_fiscalia: string;
  direccion: string;
  telefono: string;
}

export const FiscaliaCreatePage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ React Hook Form
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<FiscaliaFormData>({
    mode: 'onChange',
    defaultValues: {
      nombre_fiscalia: '',
      direccion: '',
      telefono: '',
    },
  });

  const onSubmit = async (data: FiscaliaFormData) => {
    setError(''); 
    setDone(false);
    setLoading(true);

    try {
      const res = await fiscaliaRepository.create({
        nombre_fiscalia: data.nombre_fiscalia.trim(),
        direccion: data.direccion.trim() || undefined,
        telefono: data.telefono.trim() || undefined
      });

      if (!res.success || !res.data) throw new Error(res.message || 'Error');
      
      setDone(true);
      navigate(`/dashboard/fiscalias/${res.data.id_fiscalia}`);
    } catch(e: any) { 
      setError(e.message || 'Error'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Button variant="outlined" onClick={() => navigate('/dashboard/fiscalias')}>
          ← Volver
        </Button>
        <Typography variant="h5" fontWeight={600}>Nueva Fiscalía</Typography>
        <Box width={80} />
      </Box>
      
      <Card sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, maxWidth: 800, mx: 'auto' }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={3}>
          {error && <Alert severity="error">{error}</Alert>}
          {done && <Alert severity="success">Fiscalía creada exitosamente</Alert>}
          
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                    placeholder="Ej: +502 1234-5678"
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box display="flex" gap={2} flexWrap="wrap">
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading || !isValid}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
            
            <Button 
              variant="text" 
              onClick={() => navigate('/dashboard/fiscalias')} 
              disabled={loading}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
