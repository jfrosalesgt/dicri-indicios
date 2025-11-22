import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, TextField, Button, Alert, MenuItem, Grid } from '@mui/material';
import { indicioRepository } from '../../infrastructure/repositories/IndicioRepository';
import { tipoIndicioRepository } from '../../infrastructure/repositories/TipoIndicioRepository';
import type { Indicio, EstadoIndicio } from '../../domain/entities/Indicio';

const estados: EstadoIndicio[] = ['RECOLECTADO','EN_CUSTODIA','EN_ANALISIS','ANALIZADO','DEVUELTO'];

export const IndicioEditPage = () => {
  const { id, indicioId } = useParams<{ id:string; indicioId:string }>();
  const navigate = useNavigate();
  const [indicio, setIndicio] = useState<Indicio | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fechaReco, setFechaReco] = useState('');
  const [tipoIndicio, setTipoIndicio] = useState('');
  const [estado, setEstado] = useState<EstadoIndicio>('RECOLECTADO');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tipos, setTipos] = useState<{id_tipo_indicio:number; nombre_tipo:string}[]>([]);
  const [loadingTipos, setLoadingTipos] = useState(true);

  useEffect(()=>{
    const load = async () => {
      if (!indicioId) return;
      setLoading(true); setError('');
      try {
        const res = await indicioRepository.getById(Number(indicioId));
        if (res.success && res.data) {
          setIndicio(res.data);
          setDescripcion(res.data.descripcion_corta);
          setUbicacion(res.data.ubicacion_especifica || '');
          setFechaReco(res.data.fecha_hora_recoleccion ? res.data.fecha_hora_recoleccion.slice(0,16) : '');
          setTipoIndicio(String(res.data.id_tipo_indicio));
          setEstado(res.data.estado_actual);
        } else setError(res.message || 'No encontrado');
      } catch(e:any){ setError(e.message || 'Error'); }
      finally { setLoading(false); }
    };
    load();
  }, [indicioId]);

  useEffect(()=>{
    const loadTipos = async () => {
      setLoadingTipos(true);
      try {
        const r = await tipoIndicioRepository.getAll({ activo:true });
        if (r.success && r.data) {
          setTipos(r.data.map(t => ({ id_tipo_indicio: t.id_tipo_indicio, nombre_tipo: t.nombre_tipo })));
        }
      } catch(e:any){ setError(e.message || 'Error'); }
      finally { setLoadingTipos(false); }
    };
    loadTipos();
  }, [indicioId]);

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!indicio) return;
    setSaving(true); setError('');
    try {
      const res = await indicioRepository.update(indicio.id_indicio, {
        descripcion_corta: descripcion.trim(),
        ubicacion_especifica: ubicacion.trim() || undefined,
        fecha_hora_recoleccion: fechaReco || undefined,
        id_tipo_indicio: tipoIndicio ? Number(tipoIndicio) : undefined,
        estado_actual: estado,
      });
      if (!res.success) throw new Error(res.message || 'Error al actualizar');
      navigate(`/dashboard/expedientes/${id}/indicios`);
    } catch(e:any){ setError(e.message || 'Error'); }
    finally { setSaving(false); }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (error || !indicio) return (
    <Box>
      <Alert severity="error" sx={{ mb:2 }}>{error || 'Indicio no encontrado'}</Alert>
      <Button variant="outlined" onClick={()=>navigate(`/dashboard/expedientes/${id}/indicios`)}>Volver</Button>
    </Box>
  );

  return (
    <Box width="100%">
      <Typography variant="h5" mb={3} fontWeight={600}>Editar Indicio {indicio.codigo_indicio}</Typography>
      <Card sx={{ p:3, borderRadius:3, width:'100%', boxSizing:'border-box' }}>
        <Box component="form" display="flex" flexDirection="column" gap={3} onSubmit={submit}>
          {error && <Alert severity="error">{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField label="Código" value={indicio.codigo_indicio} disabled fullWidth />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField label="Descripción Corta" value={descripcion} onChange={e=>setDescripcion(e.target.value)} required disabled={saving} multiline minRows={2} fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Ubicación Específica" value={ubicacion} onChange={e=>setUbicacion(e.target.value)} disabled={saving} fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Fecha/Hora Recolección"
                type="datetime-local"
                value={fechaReco}
                onChange={e=>setFechaReco(e.target.value)}
                InputLabelProps={{ shrink:true }}
                disabled={saving}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Tipo Indicio"
                value={tipoIndicio}
                onChange={e=>setTipoIndicio(e.target.value)}
                disabled={saving || loadingTipos}
                fullWidth
                required
              >
                {tipos.map(t => (
                  <MenuItem key={t.id_tipo_indicio} value={t.id_tipo_indicio}>{t.nombre_tipo}</MenuItem>
                ))}
                {(!loadingTipos && tipos.length === 0) && (
                  <MenuItem value="" disabled>Sin tipos activos</MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Estado"
                value={estado}
                onChange={e=>setEstado(e.target.value as EstadoIndicio)}
                disabled={saving}
                fullWidth
              >
                {estados.map(es => <MenuItem key={es} value={es}>{es}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button type="submit" variant="contained" disabled={saving || !descripcion.trim()}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
            <Button variant="text" disabled={saving} onClick={()=>navigate(`/dashboard/expedientes/${id}/indicios`)}>Cancelar</Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
