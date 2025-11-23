import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, Typography, TextField, Button, Alert, MenuItem, Grid } from '@mui/material';
import { indicioRepository } from '../../infrastructure/repositories/IndicioRepository';
import { escenaRepository } from '../../infrastructure/repositories/EscenaRepository';
import { tipoIndicioRepository } from '../../infrastructure/repositories/TipoIndicioRepository';
import { useAuth } from '../context/AuthContext';

export const IndicioCreatePage = () => {
  const { id, escenaId } = useParams<{ id: string; escenaId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromRevision = (location.state as any)?.fromRevision === true;
  const [codigo, setCodigo] = useState('');
  const [escena, setEscena] = useState('');
  const [tipoIndicio, setTipoIndicio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fechaRecoleccion, setFechaRecoleccion] = useState('');
  const [escenas, setEscenas] = useState<{ id_escena:number; nombre_escena:string }[]>([]);
  const [tipos, setTipos] = useState<{ id_tipo_indicio:number; nombre_tipo:string }[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { user, isLoading } = useAuth();

  useEffect(()=>{
    if (!isLoading) {
      const token = localStorage.getItem('dicri_auth_token');
      if (!user && !token) navigate('/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const [escRes, tipRes] = await Promise.all([
          escenaRepository.getByExpediente(Number(id)),
          tipoIndicioRepository.getAll({ activo: true })
        ]);
        if (escRes.success && escRes.data) {
          const mapped = escRes.data.map(e => ({ id_escena: e.id_escena, nombre_escena: e.nombre_escena }));
          setEscenas(mapped);
          // Preseleccionar escena si viene desde flujo escena->indicios->new
          if (escenaId) {
            setEscena(escenaId);
            // Si la escena no está en el listado (caso raro), agregarla temporalmente
            if (!mapped.some(m => String(m.id_escena) === escenaId)) {
              setEscenas(prev => [...prev, { id_escena: Number(escenaId), nombre_escena: `Escena ${escenaId}` }]);
            }
          }
        }
        if (tipRes.success && tipRes.data) {
          setTipos(tipRes.data.map(t => ({ id_tipo_indicio: t.id_tipo_indicio, nombre_tipo: t.nombre_tipo })));
        }
      } catch {
        // silencioso
      } finally {
        setLoadingLists(false);
      }
    };
    load();
  }, [id, escenaId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError(''); setSaving(true);
    try {
      const res = await indicioRepository.createForExpediente(Number(id), {
        codigo_indicio: codigo.trim(),
        id_escena: Number(escena),
        id_tipo_indicio: Number(tipoIndicio),
        descripcion_corta: descripcion.trim(),
        ubicacion_especifica: ubicacion.trim() || undefined,
        fecha_hora_recoleccion: fechaRecoleccion || undefined
      });
      if (!res.success || !res.data) throw new Error(res.message || 'Error');
      navigate(
        escenaId
          ? `/dashboard/expedientes/${id}/escenas/${escenaId}/indicios`
          : `/dashboard/expedientes/${id}/indicios`,
        { state: fromRevision ? { fromRevision:true } : undefined }
      );
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
            escenaId
              ? `/dashboard/expedientes/${id}/escenas/${escenaId}/indicios`
              : `/dashboard/expedientes/${id}/indicios`,
            { state: fromRevision ? { fromRevision:true } : undefined }
          )}
        >← Volver</Button>
        <Typography variant="h5" fontWeight={600}>Nuevo Indicio</Typography>
      </Box>
      <Card sx={{ p:3, borderRadius:3, width:'100%', boxSizing:'border-box' }}>
        <Box component="form" display="flex" flexDirection="column" gap={3} onSubmit={submit}>
          {error && <Alert severity="error">{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField label="Código Indicio" value={codigo} onChange={e=>setCodigo(e.target.value)} required disabled={saving} fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Escena"
                value={escena}
                onChange={e=>setEscena(e.target.value)}
                required
                disabled={saving || loadingLists || !!escenaId}
                fullWidth
              >
                {escenas.map(sc => (
                  <MenuItem key={sc.id_escena} value={sc.id_escena}>{sc.nombre_escena}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Tipo Indicio"
                value={tipoIndicio}
                onChange={e=>setTipoIndicio(e.target.value)}
                required
                disabled={saving || loadingLists}
                fullWidth
              >
                {tipos.map(tp => (
                  <MenuItem key={tp.id_tipo_indicio} value={tp.id_tipo_indicio}>{tp.nombre_tipo}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Descripción Corta"
                value={descripcion}
                onChange={e=>setDescripcion(e.target.value)}
                required
                multiline
                minRows={2}
                disabled={saving}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Ubicación Específica"
                value={ubicacion}
                onChange={e=>setUbicacion(e.target.value)}
                disabled={saving}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Fecha/Hora Recolección"
                type="datetime-local"
                value={fechaRecoleccion}
                onChange={e=>setFechaRecoleccion(e.target.value)}
                InputLabelProps={{ shrink:true }}
                disabled={saving}
                fullWidth
              />
            </Grid>
          </Grid>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              type="submit"
              variant="contained"
              disabled={saving || loadingLists || !codigo.trim() || !escena || !tipoIndicio || !descripcion.trim()}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button
              variant="text"
              disabled={saving}
              onClick={() => navigate(
                escenaId
                  ? `/dashboard/expedientes/${id}/escenas/${escenaId}/indicios`
                  : `/dashboard/expedientes/${id}/indicios`,
                { state: fromRevision ? { fromRevision:true } : undefined }
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
