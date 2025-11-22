import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, TextField, Button, Alert, MenuItem, Grid } from '@mui/material';
import { escenaRepository } from '../../infrastructure/repositories/EscenaRepository';
import type { Escena } from '../../domain/entities/Escena';

export const SceneEditPage = () => {
  const { id, escenaId } = useParams<{ id:string; escenaId:string }>();
  const navigate = useNavigate();
  const [escena, setEscena] = useState<Escena | null>(null);
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [activo, setActivo] = useState('true');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const load = async () => {
      if (!escenaId) return;
      setLoading(true); setError('');
      try {
        const res = await escenaRepository.getById(Number(escenaId));
        if (res.success && res.data) {
          setEscena(res.data);
          setNombre(res.data.nombre_escena);
          setDireccion(res.data.direccion_escena || '');
          setInicio(res.data.fecha_hora_inicio.slice(0,16));
          setFin(res.data.fecha_hora_fin ? res.data.fecha_hora_fin.slice(0,16) : '');
          setDescripcion(res.data.descripcion || '');
          setActivo(res.data.activo ? 'true':'false');
        } else setError(res.message || 'No encontrado');
      } catch(e:any){ setError(e.message || 'Error'); }
      finally { setLoading(false); }
    };
    load();
  }, [escenaId]);

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!escena) return;
    setSaving(true); setError('');
    try {
      const res = await escenaRepository.update(escena.id_escena, {
        nombre_escena: nombre.trim(),
        direccion_escena: direccion.trim() || undefined,
        fecha_hora_inicio: inicio,
        fecha_hora_fin: fin || null,
        descripcion: descripcion.trim() || undefined,
        activo: activo === 'true'
      });
      if (!res.success) throw new Error(res.message || 'Error al actualizar');
      navigate(`/dashboard/expedientes/${id}/escenas`);
    } catch(e:any){ setError(e.message || 'Error'); }
    finally { setSaving(false); }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (error || !escena) return (
    <Box>
      <Alert severity="error" sx={{ mb:2 }}>{error || 'Escena no encontrada'}</Alert>
      <Button variant="outlined" onClick={()=>navigate(`/dashboard/expedientes/${id}/escenas`)}>Volver</Button>
    </Box>
  );

  return (
    <Box width="100%">
      <Typography variant="h5" mb={3} fontWeight={600}>Editar Escena {escena.id_escena}</Typography>
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
            <Grid item xs={12} md={4}>
              <TextField select label="Activo" value={activo} onChange={e=>setActivo(e.target.value)} disabled={saving} fullWidth>
                <MenuItem value="true">Activo</MenuItem>
                <MenuItem value="false">Inactivo</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button type="submit" variant="contained" disabled={saving || !nombre.trim() || !inicio}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
            <Button variant="text" disabled={saving} onClick={()=>navigate(`/dashboard/expedientes/${id}/escenas`)}>Cancelar</Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
