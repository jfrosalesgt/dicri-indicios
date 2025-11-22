import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Chip, Button, Alert, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { expedienteRepository } from '../../infrastructure/repositories/ExpedienteRepository';
import type { Expediente } from '../../domain/entities/Expediente';

export const ExpedienteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expediente, setExpediente] = useState<Expediente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError('');
      try {
        const res = await expedienteRepository.getById(Number(id));
        if (res.success && res.data) setExpediente(res.data);
        else setError(res.message || 'No encontrado');
      } catch (e: any) {
        setError(e.message || 'Error al cargar');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!expediente) return;
    setDeleting(true);
    try {
      const res = await expedienteRepository.delete(expediente.id_investigacion);
      if (!res.success) throw new Error(res.message || 'Error al eliminar');
      navigate('/dashboard/expedientes');
    } catch (e: any) {
      setError(e.message || 'Error al eliminar');
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;

  if (error || !expediente) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb:2 }}>{error || 'Expediente no encontrado'}</Alert>
        <Button variant="outlined" onClick={() => navigate('/dashboard/expedientes')}>Volver</Button>
      </Box>
    );
  }

  const info = [
    { label:'ID Investigación', value: expediente.id_investigacion },
    { label:'Código Caso', value: expediente.codigo_caso },
    { label:'Nombre Caso', value: expediente.nombre_caso },
    { label:'Estado Revisión', value: expediente.estado_revision_dicri },
    { label:'Fiscalía', value: expediente.nombre_fiscalia || expediente.id_fiscalia },
    { label:'Fecha Inicio', value: new Date(expediente.fecha_inicio).toLocaleDateString('es-GT') },
    { label:'Descripción Hechos', value: expediente.descripcion_hechos || '—' },
    { label:'Justificación Revisión', value: expediente.justificacion_revision || '—' },
    { label:'Fecha Revisión', value: expediente.fecha_revision ? new Date(expediente.fecha_revision).toLocaleString('es-GT') : '—' },
    { label:'ID Usuario Registro', value: expediente.id_usuario_registro ?? '—' },
    { label:'ID Usuario Revisión', value: expediente.id_usuario_revision ?? '—' },
    { label:'Activo', value: expediente.activo ? 'Sí' : 'No' },
    { label:'Creado Por', value: expediente.usuario_creacion },
    { label:'Fecha Creación', value: new Date(expediente.fecha_creacion).toLocaleString('es-GT') },
    { label:'Actualizado Por', value: expediente.usuario_actualizacion || 'N/A' },
    { label:'Fecha Actualización', value: expediente.fecha_actualizacion ? new Date(expediente.fecha_actualizacion).toLocaleString('es-GT') : 'N/A' },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Button variant="outlined" onClick={() => navigate('/dashboard/expedientes')}>← Volver</Button>
        <Typography variant="h5" fontWeight={600}>Detalle de Expediente</Typography>
      </Box>
      <Card sx={{ p:{ xs:3, md:4 }, borderRadius:3 }}>
        <Box mb={3} display="flex" alignItems="center" gap={2}>
          <Typography variant="h6" fontWeight={600}>{expediente.codigo_caso}</Typography>
          <Chip
            label={expediente.estado_revision_dicri}
            color={expediente.estado_revision_dicri === 'APROBADO' ? 'success' : expediente.estado_revision_dicri === 'RECHAZADO' ? 'error' : 'warning'}
            size="small"
          />
        </Box>
        <Grid container spacing={2}>
          {info.map(row => (
            <Grid item xs={12} md={4} key={row.label}>
              <Box sx={{ bgcolor:'#f5f7fa', p:2, borderRadius:2 }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary">{row.label}</Typography>
                <Typography variant="body2" mt={0.5} sx={{ wordBreak:'break-word' }}>{row.value as any}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box mt={4} display="flex" gap={2}>
          <Button variant="contained" onClick={() => navigate(`/dashboard/expedientes/${expediente.id_investigacion}/edit`)}>Editar</Button>
          <Button variant="outlined" color="error" onClick={() => setConfirmOpen(true)} disabled={deleting}>Eliminar</Button>
        </Box>
      </Card>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body2">¿Desea eliminar la investigación {expediente?.codigo_caso}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>Cancelar</Button>
          <Button color="error" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};