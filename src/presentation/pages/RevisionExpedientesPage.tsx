import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Card, Typography, Button, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { expedienteRepository } from '../../infrastructure/repositories/ExpedienteRepository';
import type { Expediente } from '../../domain/entities/Expediente';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface RejectFormData {
  justificacion: string;
}

export const RevisionExpedientesPage = () => {
  const { roles } = useAuth();
  const navigate = useNavigate();
  const canReview = roles?.some(r => r.nombre_role === 'COORDINADOR_DICRI' || r.nombre_role === 'ADMIN');
  const [items, setItems] = useState<Expediente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rejectOpen, setRejectOpen] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const minJust = 10;

  // ✅ React Hook Form para el formulario de rechazo
  const { control, handleSubmit, formState: { errors, isValid }, reset } = useForm<RejectFormData>({
    mode: 'onChange',
    defaultValues: {
      justificacion: '',
    },
  });

  const load = async () => {
    setLoading(true); 
    setError('');
    try {
      const res = await expedienteRepository.getAll({ estado_revision_dicri: 'PENDIENTE_REVISION' });
      if (res.success && res.data) {
        setItems(res.data);
      } else {
        setError(res.message || 'Error');
      }
    } catch (e: any) { 
      setError(e.message || 'Error'); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { load(); }, []);

  if (!canReview) {
    return (
      <Card sx={{ p: 3 }}>
        <Alert severity="warning">Acceso restringido. Requiere rol COORDINADOR_DICRI o ADMIN.</Alert>
      </Card>
    );
  }

  const aprobar = async (id: number) => {
    try {
      const res = await expedienteRepository.aprobar(id);
      if (!res.success) throw new Error(res.message || 'Error al aprobar');
      load();
    } catch (e: any) { 
      setError(e.message || 'Error al aprobar'); 
    }
  };

  const openReject = (id: number) => {
    setCurrentId(id);
    reset(); // ✅ Limpiar formulario
    setRejectOpen(true);
  };

  const onSubmitReject = async (data: RejectFormData) => {
    if (!currentId) return;
    
    setRejecting(true);
    try {
      const res = await expedienteRepository.rechazar(currentId, { 
        justificacion: data.justificacion.trim() 
      });
      
      if (!res.success) throw new Error(res.message || 'Error al rechazar');
      
      setRejectOpen(false);
      reset(); // ✅ Limpiar formulario
      load();
    } catch (e: any) { 
      setError(e.message || 'Error al rechazar'); 
    } finally { 
      setRejecting(false); 
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h5" fontWeight={600}>Revisión de Expedientes</Typography>
        <Button variant="outlined" onClick={load} disabled={loading}>
          {loading ? 'Cargando...' : 'Refrescar'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card sx={{ p: 0 }}>
        <Box overflow="auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#1a2b4a', color: '#fff' }}>
              <tr>
                <th style={{ padding: 12, textAlign: 'left' }}>ID</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Código</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Nombre Caso</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Fiscalía</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Estado</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: 20 }}>Cargando...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 20, fontStyle: 'italic' }}>Sin expedientes pendientes</td></tr>
              ) : (
                items.map(e => (
                  <tr key={e.id_investigacion} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: 10 }}>{e.id_investigacion}</td>
                    <td style={{ padding: 10 }}>{e.codigo_caso}</td>
                    <td style={{ padding: 10 }}>{e.nombre_caso}</td>
                    <td style={{ padding: 10 }}>{e.nombre_fiscalia || e.id_fiscalia}</td>
                    <td style={{ padding: 10 }}>
                      <Chip size="small" label={e.estado_revision_dicri} color="warning" />
                    </td>
                    <td style={{ padding: 10 }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => navigate(`/dashboard/expedientes/${e.id_investigacion}`, { 
                          state: { fromRevision: true } 
                        })}
                      >
                        Revisar
                      </Button>{' '}
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error" 
                        onClick={() => openReject(e.id_investigacion)}
                      >
                        Rechazar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Box>
      </Card>

      {/* ✅ Dialog con React Hook Form */}
      <Dialog 
        open={rejectOpen} 
        onClose={() => !rejecting && setRejectOpen(false)} 
        fullWidth 
        maxWidth="sm"
      >
        <DialogTitle>Rechazar Expediente</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmitReject)}>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Ingrese una justificación detallada del rechazo (mínimo {minJust} caracteres):
            </Typography>
            
            <Controller
              name="justificacion"
              control={control}
              rules={{ 
                required: 'Justificación es requerida',
                minLength: { 
                  value: minJust, 
                  message: `Debe tener al menos ${minJust} caracteres` 
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  minRows={4}
                  placeholder="Describa claramente los motivos del rechazo..."
                  error={!!errors.justificacion}
                  helperText={errors.justificacion?.message}
                  disabled={rejecting}
                />
              )}
            />
          </DialogContent>
          
          <DialogActions>
            <Button 
              onClick={() => {
                setRejectOpen(false);
                reset();
              }} 
              disabled={rejecting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              color="error" 
              variant="contained" 
              disabled={rejecting || !isValid}
            >
              {rejecting ? 'Rechazando...' : 'Confirmar Rechazo'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};
