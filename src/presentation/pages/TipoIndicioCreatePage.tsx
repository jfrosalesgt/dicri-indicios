import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Card, Typography, TextField, Button, Alert, Grid } from '@mui/material';
import { tipoIndicioRepository } from '../../infrastructure/repositories/TipoIndicioRepository';
import { useNavigate } from 'react-router-dom';

interface TipoIndicioFormData {
  nombre_tipo: string;
  descripcion: string;
}

export const TipoIndicioCreatePage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<TipoIndicioFormData>({
    mode: 'onChange',
    defaultValues: {
      nombre_tipo: '',
      descripcion: '',
    },
  });

  const onSubmit = async (data: TipoIndicioFormData) => {
    setError(''); 
    setDone(false);
    setLoading(true);

    try {
      const res = await tipoIndicioRepository.create({
        nombre_tipo: data.nombre_tipo.trim(),
        descripcion: data.descripcion.trim() || undefined,
      });

      if (!res.success || !res.data) throw new Error(res.message || 'Error');
      
      setDone(true);
      navigate(`/dashboard/tipos-indicio/${res.data.id_tipo_indicio}`);
    } catch(e: any) { 
      setError(e.message || 'Error'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Button variant="outlined" onClick={() => navigate('/dashboard/tipos-indicio')}>
          ← Volver
        </Button>
        <Typography variant="h5" fontWeight={600}>Nuevo Tipo de Indicio</Typography>
        <Box width={80} />
      </Box>
      
      <Card sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, maxWidth: 800, mx: 'auto' }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={3}>
          {error && <Alert severity="error">{error}</Alert>}
          {done && <Alert severity="success">Tipo de indicio creado exitosamente</Alert>}
          
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
                    disabled={loading}
                    placeholder="Ej: Arma de fuego, Documento, Huella digital"
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
                    helperText={errors.descripcion?.message || 'Descripción detallada del tipo de indicio'}
                    multiline
                    minRows={4}
                    disabled={loading}
                    placeholder="Describa las características y detalles del tipo de indicio..."
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
              onClick={() => navigate('/dashboard/tipos-indicio')} 
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
