import { useState } from 'react';
import { Box, Card, Typography, TextField, Button, Alert } from '@mui/material';
import { fiscaliaRepository } from '../../infrastructure/repositories/FiscaliaRepository';
import { useNavigate } from 'react-router-dom';

export const FiscaliaCreatePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre_fiscalia:'', direccion:'', telefono:'' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    setError(''); setDone(false);
    if (!form.nombre_fiscalia.trim()) { setError('Nombre requerido'); return; }
    setLoading(true);
    try {
      const res = await fiscaliaRepository.create({
        nombre_fiscalia: form.nombre_fiscalia.trim(),
        direccion: form.direccion.trim() || undefined,
        telefono: form.telefono.trim() || undefined
      });
      if (!res.success || !res.data) throw new Error(res.message || 'Error');
      setDone(true);
      navigate(`/dashboard/fiscalias/${res.data.id_fiscalia}`);
    } catch(e:any){ setError(e.message || 'Error'); } finally { setLoading(false); }
  };

  return (
    <Box maxWidth={600}>
      <Typography variant="h5" mb={3} fontWeight={600}>Nueva Fiscalía</Typography>
      <Card sx={{ p:3 }}>
        <Box component="form" display="flex" flexDirection="column" gap={2} onSubmit={submit}>
          {error && <Alert severity="error">{error}</Alert>}
          {done && <Alert severity="success">Creada</Alert>}
          <TextField label="Nombre Fiscalía" value={form.nombre_fiscalia} onChange={e=>setForm({...form,nombre_fiscalia:e.target.value})} required disabled={loading} />
          <TextField label="Dirección" value={form.direccion} onChange={e=>setForm({...form,direccion:e.target.value})} disabled={loading} />
            <TextField label="Teléfono" value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})} disabled={loading} />
          <Button type="submit" variant="contained" disabled={loading || !form.nombre_fiscalia.trim()}>{loading?'Guardando...':'Guardar'}</Button>
          <Button variant="text" onClick={()=>navigate('/dashboard/fiscalias')} disabled={loading}>Cancelar</Button>
        </Box>
      </Card>
    </Box>
  );
};
