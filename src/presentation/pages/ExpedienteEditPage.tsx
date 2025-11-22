import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MenuItem, TextField, Button, Alert, Card, Box, Typography, Grid } from '@mui/material';
import { expedienteRepository } from '../../infrastructure/repositories/ExpedienteRepository';
import { fiscaliaRepository } from '../../infrastructure/repositories/FiscaliaRepository';
import type { EstadoRevisionDicri, Expediente } from '../../domain/entities/Expediente';

const estados: EstadoRevisionDicri[] = ['EN_REGISTRO','PENDIENTE_REVISION','APROBADO','RECHAZADO'];

export const ExpedienteEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expediente, setExpediente] = useState<Expediente | null>(null);
  const [nombreCaso, setNombreCaso] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [idFiscalia, setIdFiscalia] = useState<number | ''>('');
  const [descripcionHechos, setDescripcionHechos] = useState('');
  const [estadoRev, setEstadoRev] = useState<EstadoRevisionDicri>('EN_REGISTRO');
  const [activo, setActivo] = useState<boolean>(true);
  const [fiscalias, setFiscalias] = useState<{id_fiscalia:number; nombre_fiscalia:string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true); setError('');
      try {
        const res = await expedienteRepository.getById(Number(id));
        if (res.success && res.data) {
          setExpediente(res.data);
          setNombreCaso(res.data.nombre_caso);
          setFechaInicio(res.data.fecha_inicio.slice(0,10));
          setIdFiscalia(res.data.id_fiscalia);
          setDescripcionHechos(res.data.descripcion_hechos || '');
          setEstadoRev(res.data.estado_revision_dicri);
          setActivo(res.data.activo);
        } else setError(res.message || 'No encontrado');
      } catch(e:any){ setError(e.message || 'Error al cargar'); }
      finally { setLoading(false); }
    };
    load();
    fiscaliaRepository.getAll({ activo:true }).then(r=>{
      if (r.success && r.data) setFiscalias(r.data.map(f=>({id_fiscalia:f.id_fiscalia,nombre_fiscalia:f.nombre_fiscalia})));
    }).catch(()=>{});
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expediente) return;
    setSaving(true); setError(''); setDone(false);
    try {
      const res = await expedienteRepository.update(expediente.id_investigacion, {
        nombre_caso: nombreCaso.trim(),
        fecha_inicio: fechaInicio,
        id_fiscalia: Number(idFiscalia),
        descripcion_hechos: descripcionHechos.trim() || undefined,
        estado_revision_dicri: estadoRev,
        activo,
      });
      if (!res.success) throw new Error(res.message || 'Error al actualizar'); // removido uso de res.data
      setDone(true);
      navigate(`/dashboard/expedientes/${expediente.id_investigacion}`);
    } catch(e:any){ setError(e.message || 'Error al actualizar'); }
    finally { setSaving(false); }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (error || !expediente) return (
    <Box>
      <Alert severity="error" sx={{ mb:2 }}>{error || 'Expediente no encontrado'}</Alert>
      <Button variant="outlined" onClick={() => navigate('/dashboard/expedientes')}>Volver</Button>
    </Box>
  );

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Button variant="outlined" onClick={() => navigate('/dashboard/expedientes')}>← Volver</Button>
        <Typography variant="h5" fontWeight={600}>Editar Expediente</Typography>
      </Box>
      <Card sx={{ p:3, borderRadius:3, width:'100%', boxSizing:'border-box' }}>
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={3}>
          {/* Alertas */}
          {error && <Alert severity="error">{error}</Alert>}
          {done && <Alert severity="success">Expediente actualizado</Alert>}
          {/* Grid de campos */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField label="Código Caso" value={expediente.codigo_caso} disabled fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Nombre Caso" value={nombreCaso} onChange={e=>setNombreCaso(e.target.value)} required disabled={saving} fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Fecha Inicio" type="date" value={fechaInicio} onChange={e=>setFechaInicio(e.target.value)} required disabled={saving} InputLabelProps={{ shrink:true }} fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField select label="Fiscalía" value={idFiscalia} onChange={e=>setIdFiscalia(Number(e.target.value))} required disabled={saving} fullWidth>
                {fiscalias.map(f=> <MenuItem key={f.id_fiscalia} value={f.id_fiscalia}>{f.nombre_fiscalia}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField select label="Estado Revisión" value={estadoRev} onChange={e=>setEstadoRev(e.target.value as EstadoRevisionDicri)} disabled={saving} fullWidth>
                {estados.map(es=> <MenuItem key={es} value={es}>{es}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField select label="Activo" value={activo ? 'true':'false'} onChange={e=>setActivo(e.target.value === 'true')} disabled={saving} fullWidth>
                <MenuItem value="true">Activo</MenuItem>
                <MenuItem value="false">Inactivo</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción Hechos"
                value={descripcionHechos}
                onChange={e=>setDescripcionHechos(e.target.value)}
                multiline
                minRows={3}
                fullWidth
                disabled={saving}
              />
            </Grid>
          </Grid>
          {/* Botones */}
          <Box display="flex" gap={2} flexWrap="wrap" justifyContent="flex-start">
            <Button type="submit" variant="contained" disabled={saving || !nombreCaso.trim() || !fechaInicio || !idFiscalia}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
            <Button variant="text" onClick={() => navigate(`/dashboard/expedientes/${expediente.id_investigacion}`)} disabled={saving}>
              Cancelar
            </Button>
            {estadoRev === 'EN_REGISTRO' && (
              <>
                <Button variant="outlined" onClick={() => navigate(`/dashboard/expedientes/${expediente.id_investigacion}/escenas`)} disabled={saving}>
                  Ver Escenas
                </Button>
                <Button variant="outlined" onClick={() => navigate(`/dashboard/expedientes/${expediente.id_investigacion}/indicios`)} disabled={saving}>
                  Ver Indicios
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
