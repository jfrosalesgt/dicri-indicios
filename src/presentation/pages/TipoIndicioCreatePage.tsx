import { useState } from 'react';
import { Box, Card, Typography, TextField, Button, Alert } from '@mui/material';
import { tipoIndicioRepository } from '../../infrastructure/repositories/TipoIndicioRepository';
import { useNavigate } from 'react-router-dom';

export const TipoIndicioCreatePage = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    setError(''); setDone(false);
    if (!nombre.trim()) { setError('Nombre requerido'); return; }
    setLoading(true);
    try {
      const res = await tipoIndicioRepository.create({
        nombre_tipo: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
      });
      if (!res.success || !res.data) throw new Error(res.message || 'Error');
      setDone(true);
      navigate(`/dashboard/tipos-indicio/${res.data.id_tipo_indicio}`);
    } catch(e:any){ setError(e.message || 'Error'); } finally { setLoading(false); }
  };

  return (
    <Box maxWidth={600}>
      <Typography variant="h5" mb={3} fontWeight={600}>Nuevo Tipo de Indicio</Typography>
      <Card sx={{ p:3 }}>
        <Box component="form" display="flex" flexDirection="column" gap={2} onSubmit={submit}>
          {error && <Alert severity="error">{error}</Alert>}
          {done && <Alert severity="success">Creado</Alert>}
          <TextField label="Nombre Tipo" value={nombre} onChange={e=>setNombre(e.target.value)} required disabled={loading} />
          <TextField label="Descripción" value={descripcion} onChange={e=>setDescripcion(e.target.value)} multiline minRows={3} disabled={loading} />
          <Button type="submit" variant="contained" disabled={loading || !nombre.trim()}>{loading?'Guardando...':'Guardar'}</Button>
          <Button variant="text" onClick={()=>navigate('/dashboard/tipos-indicio')} disabled={loading}>Cancelar</Button>
        </Box>
      </Card>
    </Box>
  );
};
