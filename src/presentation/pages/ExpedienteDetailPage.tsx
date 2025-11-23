import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, Typography, Chip, Button, Alert, Grid, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Snackbar, TextField } from '@mui/material';
import { expedienteRepository } from '../../infrastructure/repositories/ExpedienteRepository';
import type { Expediente } from '../../domain/entities/Expediente';
import { escenaRepository } from '../../infrastructure/repositories/EscenaRepository';
import { indicioRepository } from '../../infrastructure/repositories/IndicioRepository';
import { useAuth } from '../context/AuthContext';

export const ExpedienteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromRevision = (location.state as any)?.fromRevision === true;
  const { roles, isLoading: rolesLoading, user, isLoading } = useAuth();
  const canReview = roles?.some(r => r.nombre_role === 'COORDINADOR_DICRI' || r.nombre_role === 'ADMIN');
  const canSendReview = roles?.some(r => r.nombre_role === 'TECNICO_DICRI' || r.nombre_role === 'ADMIN');

  const [expediente, setExpediente] = useState<Expediente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [scenesCount, setScenesCount] = useState(0);
  const [indiciosCount, setIndiciosCount] = useState(0);
  const [sending, setSending] = useState(false);
  const [sentNotifyOpen, setSentNotifyOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectJust, setRejectJust] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [rejectError, setRejectError] = useState('');
  const [approveOpen, setApproveOpen] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const minReject = 10;

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

  // Nuevo: cargar conteos para permitir validar eliminación
  useEffect(() => {
    const loadCounts = async () => {
      if (!expediente) return;
      if (expediente.estado_revision_dicri !== 'EN_REGISTRO') return;
      try {
        const [scRes, inRes] = await Promise.all([
          escenaRepository.getByExpediente(expediente.id_investigacion),
          indicioRepository.getByExpediente(expediente.id_investigacion)
        ]);
        if (scRes.success && scRes.data) setScenesCount(scRes.data.length);
        if (inRes.success && inRes.data) setIndiciosCount(inRes.data.length);
      } catch {
        // silencioso
      }
    };
    loadCounts();
  }, [expediente]);

  const canDelete =
    expediente &&
    expediente.estado_revision_dicri === 'EN_REGISTRO' &&
    scenesCount === 0 &&
    indiciosCount === 0 &&
    !expediente.justificacion_revision;

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

  const openReviewDialog = async () => {
    if (!expediente) return;
    setReviewOpen(true);
    setReviewLoading(true);
    setReviewError('');
    try {
      const [scRes, inRes] = await Promise.all([
        escenaRepository.getByExpediente(expediente.id_investigacion),
        indicioRepository.getByExpediente(expediente.id_investigacion)
      ]);
      if (scRes.success && scRes.data) setScenesCount(scRes.data.length);
      if (inRes.success && inRes.data) setIndiciosCount(inRes.data.length);
      if (!scRes.success) setReviewError(scRes.message || 'Error al cargar escenas');
      if (!inRes.success) setReviewError(inRes.message || 'Error al cargar indicios');
    } catch (e:any) {
      setReviewError(e.message || 'Error al cargar resumen');
    } finally {
      setReviewLoading(false);
    }
  };

  const sendToReview = async () => {
    if (!expediente) return;
    setSending(true);
    setReviewError('');
    try {
      const res = await expedienteRepository.enviarRevision(expediente.id_investigacion);
      if (!res.success) throw new Error(res.message || 'Error al enviar a revisión');
      setExpediente({ ...expediente, estado_revision_dicri: 'PENDIENTE_REVISION' });
      setReviewOpen(false);
      setSentNotifyOpen(true);
    } catch (e:any) {
      setReviewError(e.message || 'Error al enviar a revisión');
    } finally {
      setSending(false);
    }
  };

  const openApproveDialog = async () => {
    if (!expediente) return;
    setApproveOpen(true);
    setApproveLoading(true);
    try {
      const [scRes, inRes] = await Promise.all([
        escenaRepository.getByExpediente(expediente.id_investigacion),
        indicioRepository.getByExpediente(expediente.id_investigacion)
      ]);
      if (scRes.success && scRes.data) setScenesCount(scRes.data.length);
      if (inRes.success && inRes.data) setIndiciosCount(inRes.data.length);
    } catch { /* silencioso */ }
    finally { setApproveLoading(false); }
  };

  const approve = async () => {
    if (!expediente) return;
    setApproving(true);
    try {
      const res = await expedienteRepository.aprobar(expediente.id_investigacion);
      if (!res.success) throw new Error(res.message || 'Error al aprobar');
      setExpediente({ ...expediente, estado_revision_dicri: 'APROBADO' });
      setApproveOpen(false);
      setSentNotifyOpen(true);
    } catch(e:any){
      setError(e.message || 'Error al aprobar');
    } finally {
      setApproving(false);
    }
  };

  const openRejectDialog = async () => {
    if (!expediente) return;
    setRejectOpen(true);
    setRejectLoading(true);
    setRejectError('');
    try {
      const [scRes, inRes] = await Promise.all([
        escenaRepository.getByExpediente(expediente.id_investigacion),
        indicioRepository.getByExpediente(expediente.id_investigacion)
      ]);
      if (scRes.success && scRes.data) setScenesCount(scRes.data.length);
      if (inRes.success && inRes.data) setIndiciosCount(inRes.data.length);
      if (!scRes.success) setRejectError(scRes.message || 'Error escenas');
      if (!inRes.success) setRejectError(inRes.message || 'Error indicios');
    } catch(e:any) {
      setRejectError(e.message || 'Error al cargar resumen');
    } finally {
      setRejectLoading(false);
    }
  };

  const confirmReject = async () => {
    if (!expediente) return;
    if (rejectJust.trim().length < minReject) return;
    setRejecting(true);
    setRejectError('');
    try {
      const res = await expedienteRepository.rechazar(expediente.id_investigacion, { justificacion: rejectJust.trim() });
      if (!res.success) throw new Error(res.message || 'Error al rechazar');
      setExpediente({
        ...expediente,
        estado_revision_dicri: 'RECHAZADO',
        justificacion_revision: rejectJust.trim()
      });
      setRejectOpen(false);
      setSentNotifyOpen(true);
      setRejectJust('');
    } catch(e:any) {
      setRejectError(e.message || 'Error al rechazar');
    } finally {
      setRejecting(false);
    }
  };

  useEffect(()=>{
    if (!isLoading) {
      const token = localStorage.getItem('dicri_auth_token');
      if (!user && !token) navigate('/login');
    }
  }, [user, isLoading, navigate]);

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
        <Button
          variant="outlined"
          onClick={() => navigate(fromRevision ? '/dashboard/revision' : '/dashboard/expedientes')}
        >← Volver</Button>
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
        <Box mt={4} display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            onClick={() => navigate(`/dashboard/expedientes/${expediente.id_investigacion}/edit`)}
            disabled={!['EN_REGISTRO','RECHAZADO'].includes(expediente.estado_revision_dicri)}
          >Editar</Button>
          {canDelete && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => setConfirmOpen(true)}
              disabled={deleting}
            >Eliminar</Button>
          )}
          {(['EN_REGISTRO','RECHAZADO'].includes(expediente.estado_revision_dicri) || fromRevision) && (
            <>
              <Button variant="outlined" onClick={() => navigate(
                `/dashboard/expedientes/${expediente.id_investigacion}/escenas`,
                { state: fromRevision ? { fromRevision:true } : undefined }
              )}>Ver Escenas</Button>
              <Button variant="outlined" onClick={() => navigate(
                `/dashboard/expedientes/${expediente.id_investigacion}/indicios`,
                { state: fromRevision ? { fromRevision:true } : undefined }
              )}>Ver Indicios</Button>
            </>
          )}
          {['EN_REGISTRO','RECHAZADO'].includes(expediente.estado_revision_dicri) && canSendReview && (
            <Button variant="contained" color="warning" sx={{ ml:'auto' }} onClick={openReviewDialog}>
              Enviar a Revisión
            </Button>
          )}
          {expediente.estado_revision_dicri === 'PENDIENTE_REVISION' && fromRevision && (
            <Box sx={{ ml:'auto', display:'flex', gap:2 }}>
              {rolesLoading ? (
                <Button variant="outlined" disabled>Cargando roles...</Button>
              ) : canReview ? (
                <>
                  <Button variant="contained" color="success" onClick={openApproveDialog}>Aprobar</Button>
                  <Button variant="outlined" color="error" onClick={openRejectDialog}>Rechazar</Button>
                </>
              ) : (
                <Chip label="Sin permisos" size="small" />
              )}
            </Box>
          )}
        </Box>
      </Card>
      {/* Diálogo de eliminación mejorado */}
      <Dialog open={confirmOpen} onClose={() => !deleting && setConfirmOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Eliminar Expediente</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={1} py={1}>
            <Typography variant="body2"><strong>Código Caso:</strong> {expediente.codigo_caso}</Typography>
            <Typography variant="body2"><strong>Nombre Caso:</strong> {expediente.nombre_caso}</Typography>
            <Typography variant="body2"><strong>Estado:</strong> {expediente.estado_revision_dicri}</Typography>
            <Typography variant="body2"><strong>Escenas registradas:</strong> {scenesCount}</Typography>
            <Typography variant="body2"><strong>Indicios registrados:</strong> {indiciosCount}</Typography>
            <Typography variant="caption" color="text.secondary">
              Solo se puede eliminar porque no tiene escenas, indicios ni justificación. Esta acción es definitiva.
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mt:1 }}>{error}</Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Eliminando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={reviewOpen} onClose={() => !sending && setReviewOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Enviar a Revisión</DialogTitle>
        <DialogContent>
          {reviewLoading ? (
            <Box display="flex" alignItems="center" gap={2} py={2}>
              <CircularProgress size={24} />
              <Typography variant="body2">Cargando resumen...</Typography>
            </Box>
          ) : reviewError ? (
            <Alert severity="error" sx={{ mb:2 }}>{reviewError}</Alert>
          ) : (
            <Box display="flex" flexDirection="column" gap={1} py={1}>
              <Typography variant="body2"><strong>Código Caso:</strong> {expediente?.codigo_caso}</Typography>
              <Typography variant="body2"><strong>Nombre Caso:</strong> {expediente?.nombre_caso}</Typography>
              <Typography variant="body2"><strong>Fiscalía:</strong> {expediente?.nombre_fiscalia || expediente?.id_fiscalia}</Typography>
              <Typography variant="body2"><strong>Estado Actual:</strong> {expediente?.estado_revision_dicri}</Typography>
              <Typography variant="body2"><strong>Escenas Registradas:</strong> {scenesCount}</Typography>
              <Typography variant="body2"><strong>Indicios Registrados:</strong> {indiciosCount}</Typography>
              <Typography variant="caption" color="text.secondary">
                Al enviar a revisión no podrá editar el expediente hasta que sea aprobado o rechazado.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewOpen(false)} disabled={sending || reviewLoading}>Cancelar</Button>
          <Button
            variant="contained"
            color="warning"
            onClick={sendToReview}
            disabled={sending || reviewLoading || !!reviewError}
          >
            {sending ? 'Enviando...' : 'Enviar a Revisión'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={rejectOpen} onClose={() => !rejecting && setRejectOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Rechazar Expediente</DialogTitle>
        <DialogContent>
          {rejectLoading ? (
            <Box display="flex" alignItems="center" gap={2} py={2}>
              <CircularProgress size={24} />
              <Typography variant="body2">Cargando resumen...</Typography>
            </Box>
          ) : rejectError ? (
            <Alert severity="error" sx={{ mb:2 }}>{rejectError}</Alert>
          ) : (
            <Box display="flex" flexDirection="column" gap={1} py={1}>
              <Typography variant="body2"><strong>Código Caso:</strong> {expediente?.codigo_caso}</Typography>
              <Typography variant="body2"><strong>Nombre Caso:</strong> {expediente?.nombre_caso}</Typography>
              <Typography variant="body2"><strong>Escenas Registradas:</strong> {scenesCount}</Typography>
              <Typography variant="body2"><strong>Indicios Registrados:</strong> {indiciosCount}</Typography>
              <Typography variant="caption" color="text.secondary">
                Al rechazar el expediente quedará en estado RECHAZADO para correcciones del técnico.
              </Typography>
            </Box>
          )}
          <Box mt={2}>
            <TextField
              label="Justificación del Rechazo"
              value={rejectJust}
              onChange={e=>setRejectJust(e.target.value)}
              fullWidth
              multiline
              minRows={3}
              disabled={rejectLoading || rejecting}
              error={rejectJust.trim().length > 0 && rejectJust.trim().length < minReject}
              helperText={rejectJust.trim().length > 0 && rejectJust.trim().length < minReject
                ? `Debe tener al menos ${minReject} caracteres`
                : ' '}
              placeholder="Describa claramente los motivos del rechazo..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectOpen(false)} disabled={rejecting || rejectLoading}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmReject}
            disabled={rejecting || rejectLoading || rejectJust.trim().length < minReject || !!rejectError}
          >
            {rejecting ? 'Rechazando...' : 'Confirmar Rechazo'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={approveOpen} onClose={() => !approving && setApproveOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Confirmar Aprobación</DialogTitle>
        <DialogContent>
          {approveLoading ? (
            <Box display="flex" alignItems="center" gap={2} py={2}>
              <CircularProgress size={24} />
              <Typography variant="body2">Preparando resumen...</Typography>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={1} py={1}>
              <Typography variant="body2"><strong>Código Caso:</strong> {expediente?.codigo_caso}</Typography>
              <Typography variant="body2"><strong>Nombre Caso:</strong> {expediente?.nombre_caso}</Typography>
              <Typography variant="body2"><strong>Escenas Registradas:</strong> {scenesCount}</Typography>
              <Typography variant="body2"><strong>Indicios Registrados:</strong> {indiciosCount}</Typography>
              <Typography variant="caption" color="text.secondary">
                Al aprobar este expediente quedará bloqueado para futuras ediciones.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveOpen(false)} disabled={approving || approveLoading}>Cancelar</Button>
          <Button
            variant="contained"
            color="success"
            onClick={approve}
            disabled={approving || approveLoading}
          >
            {approving ? 'Aprobando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={sentNotifyOpen}
        autoHideDuration={5000}
        onClose={() => setSentNotifyOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSentNotifyOpen(false)} severity="success" variant="filled" sx={{ boxShadow: 3 }}>
          Operación realizada correctamente.
        </Alert>
      </Snackbar>
    </Box>
  );
};