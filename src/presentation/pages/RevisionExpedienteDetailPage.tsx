import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Button, Chip, Alert, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Snackbar, Grid } from '@mui/material';
import { expedienteRepository } from '../../infrastructure/repositories/ExpedienteRepository';
import { escenaRepository } from '../../infrastructure/repositories/EscenaRepository';
import { indicioRepository } from '../../infrastructure/repositories/IndicioRepository';
import type { Expediente } from '../../domain/entities/Expediente';
import type { Escena } from '../../domain/entities/Escena';
import type { Indicio } from '../../domain/entities/Indicio';
import { useAuth } from '../context/AuthContext';

export const RevisionExpedienteDetailPage = () => {
  const { id } = useParams<{ id:string }>();
  const navigate = useNavigate();
  const { roles } = useAuth();
  const canReview = roles?.some(r => r.nombre_role === 'COORDINADOR_DICRI' || r.nombre_role === 'ADMIN');

  const [expediente, setExpediente] = useState<Expediente | null>(null);
  const [escenas, setEscenas] = useState<Escena[]>([]);
  const [indicios, setIndicios] = useState<Indicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [notify, setNotify] = useState(false);
  const [loadExtra, setLoadExtra] = useState(false);

  useEffect(()=>{
    const load = async () => {
      if (!id) return;
      setLoading(true); setError('');
      try {
        const res = await expedienteRepository.getById(Number(id));
        if (res.success && res.data) setExpediente(res.data); else setError(res.message || 'No encontrado');
      } catch(e:any){ setError(e.message || 'Error'); }
      finally { setLoading(false); }
    };
    load();
  },[id]);

  const loadRelated = async () => {
    if (!expediente) return;
    setLoadExtra(true);
    try {
      const [scRes, inRes] = await Promise.all([
        escenaRepository.getByExpediente(expediente.id_investigacion),
        indicioRepository.getByExpediente(expediente.id_investigacion)
      ]);
      if (scRes.success && scRes.data) setEscenas(scRes.data);
      if (inRes.success && inRes.data) setIndicios(inRes.data);
    } finally { setLoadExtra(false); }
  };

  const openApproveDialog = async () => {
    await loadRelated();
    setDialogOpen(true);
  };

  const approve = async () => {
    if (!expediente) return;
    setApproving(true);
    try {
      const res = await expedienteRepository.aprobar(expediente.id_investigacion);
      if (!res.success) throw new Error(res.message || 'Error al aprobar');
      setNotify(true);
      setDialogOpen(false);
      navigate('/dashboard/revision');
    } catch(e:any){ setError(e.message || 'Error al aprobar'); }
    finally { setApproving(false); }
  };

  if (!canReview) return <Alert severity="warning">Acceso restringido.</Alert>;
  if (loading) return <Typography>Cargando...</Typography>;
  if (error || !expediente) return (
    <Box>
      <Alert severity="error" sx={{ mb:2 }}>{error || 'Expediente no encontrado'}</Alert>
      <Button variant="outlined" onClick={()=>navigate('/dashboard/revision')}>Volver</Button>
    </Box>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Button variant="outlined" onClick={()=>navigate('/dashboard/revision')}>← Volver</Button>
        <Typography variant="h5" fontWeight={600}>Revisión Expediente</Typography>
      </Box>
      <Card sx={{ p:3, borderRadius:3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Typography variant="h6" fontWeight={600}>{expediente.codigo_caso}</Typography>
          <Chip label={expediente.estado_revision_dicri} size="small" color="warning" />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}><Info label="Nombre Caso" value={expediente.nombre_caso} /></Grid>
          <Grid item xs={12} md={4}><Info label="Fiscalía" value={expediente.nombre_fiscalia || expediente.id_fiscalia} /></Grid>
          <Grid item xs={12} md={4}><Info label="Fecha Inicio" value={new Date(expediente.fecha_inicio).toLocaleDateString('es-GT')} /></Grid>
          <Grid item xs={12}><Info label="Descripción Hechos" value={expediente.descripcion_hechos || '—'} /></Grid>
        </Grid>
        <Box mt={4} display="flex" gap={2} flexWrap="wrap">
          <Button variant="outlined" onClick={()=>navigate(`/dashboard/expedientes/${expediente.id_investigacion}/escenas`)}>Ver Escenas</Button>
          <Button variant="outlined" onClick={()=>navigate(`/dashboard/expedientes/${expediente.id_investigacion}/indicios`)}>Ver Indicios</Button>
          {expediente.estado_revision_dicri === 'PENDIENTE_REVISION' && (
            <Button variant="contained" color="success" sx={{ ml:'auto' }} onClick={openApproveDialog}>Aprobar</Button>
          )}
        </Box>
      </Card>

      <Dialog open={dialogOpen} onClose={()=>!approving && setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Confirmar Aprobación</DialogTitle>
        <DialogContent>
          {loadExtra ? (
            <Box display="flex" alignItems="center" gap={2} py={2}>
              <CircularProgress size={24} />
              <Typography variant="body2">Preparando resumen...</Typography>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2"><strong>Código:</strong> {expediente.codigo_caso}</Typography>
              <Typography variant="body2"><strong>Nombre:</strong> {expediente.nombre_caso}</Typography>
              <Typography variant="body2"><strong>Escenas registradas:</strong> {escenas.length}</Typography>
              <Typography variant="body2"><strong>Indicios registrados:</strong> {indicios.length}</Typography>
              <Typography variant="caption" color="text.secondary">Al aprobar se bloquearán futuras ediciones.</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setDialogOpen(false)} disabled={approving || loadExtra}>Cancelar</Button>
          <Button variant="contained" color="success" onClick={approve} disabled={approving || loadExtra}>
            {approving ? 'Aprobando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notify}
        autoHideDuration={5000}
        onClose={()=>setNotify(false)}
        anchorOrigin={{ vertical:'top', horizontal:'right' }}
      >
        <Alert onClose={()=>setNotify(false)} severity="success" variant="filled" sx={{ boxShadow:3 }}>
          Expediente aprobado correctamente.
        </Alert>
      </Snackbar>
    </Box>
  );
};

const Info = ({ label, value }: { label:string; value:any }) => (
  <Box sx={{ bgcolor:'#f5f7fa', p:2, borderRadius:2 }}>
    <Typography variant="caption" fontWeight={600} color="text.secondary">{label}</Typography>
    <Typography variant="body2" mt={0.5} sx={{ wordBreak:'break-word' }}>{value}</Typography>
  </Box>
);
