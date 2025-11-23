import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, Typography, TextField, Button, Alert, Grid } from '@mui/material';
import { escenaRepository } from '../../infrastructure/repositories/EscenaRepository';

export const SceneCreatePage = () => {
  const { id } = useParams<{ id:string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromRevision = (location.state as any)?.fromRevision === true;
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError(''); setSaving(true);
    try {
      const res = await escenaRepository.createForExpediente(Number(id), {
        id_investigacion: Number(id),
        nombre_escena: nombre.trim(),
        direccion_escena: direccion.trim() || undefined,
        fecha_hora_inicio: inicio,
        fecha_hora_fin: fin || null,
        descripcion: descripcion.trim() || undefined
      });
      if (!res.success || !res.data) throw new Error(res.message || 'Error');
      navigate(`/dashboard/expedientes/${id}/escenas`, { state: fromRevision ? { fromRevision:true } : undefined });
    } catch(e:any){ setError(e.message || 'Error'); }
    finally { setSaving(false); }
  };

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Button variant="outlined" onClick={()=>navigate(
          `/dashboard/expedientes/${id}/escenas`,
          { state: fromRevision ? { fromRevision:true } : undefined }
        )}>← Volver</Button>
        <Typography variant="h5" fontWeight={600}>Nueva Escena</Typography>
      </Box>
      <Card sx={{ p:3, borderRadius:3, width:'100%', boxSizing:'border-box' }}>
        <Box component="form" display="flex" flexDirection="column" gap={3} onSubmit={submit}>
          {error && <Alert severity="error">{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="Nombre Escena" value={nombre} onChange={e=>setNombre(e.target.value)} required disabled={saving} fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Dirección" value={direccion} onChange={e=>setDireccion(e.target.value)} disabled={saving} fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Fecha/Hora Inicio" type="datetime-local" value={inicio} onChange={e=>setInicio(e.target.value)} required InputLabelProps={{ shrink:true }} disabled={saving} fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Fecha/Hora Fin" type="datetime-local" value={fin} onChange={e=>setFin(e.target.value)} InputLabelProps={{ shrink:true }} disabled={saving} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Descripción" value={descripcion} onChange={e=>setDescripcion(e.target.value)} multiline minRows={3} disabled={saving} fullWidth />
            </Grid>
          </Grid>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button type="submit" variant="contained" disabled={saving || !nombre.trim() || !inicio}>{saving?'Guardando...':'Guardar'}</Button>
            <Button variant="text" disabled={saving} onClick={()=>navigate(
              `/dashboard/expedientes/${id}/escenas`,
              { state: fromRevision ? { fromRevision:true } : undefined }
            )}>Cancelar</Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
