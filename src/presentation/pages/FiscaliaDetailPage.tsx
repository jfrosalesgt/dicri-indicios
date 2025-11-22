import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Chip, Button, Alert, TextField } from '@mui/material';
import { fiscaliaRepository } from '../../infrastructure/repositories/FiscaliaRepository';
import type { Fiscalia } from '../../domain/entities/Fiscalia';

export const FiscaliaDetailPage = () => {
  const { id } = useParams<{ id:string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Fiscalia | null>(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ nombre_fiscalia:'', direccion:'', telefono:'', activo:true });
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true); setError('');
      try {
        const res = await fiscaliaRepository.getById(Number(id));
        if (res.success && res.data) {
          setItem(res.data);
          setForm({
            nombre_fiscalia: res.data.nombre_fiscalia,
            direccion: res.data.direccion || '',
            telefono: res.data.telefono || '',
            activo: res.data.activo,
          });
        } else setError(res.message || 'Error');
      } catch (e:any) { setError(e.message || 'Error'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const save = async () => {
    if (!item) return;
    try {
      const res = await fiscaliaRepository.update(item.id_fiscalia, form);
      if (!res.success) throw new Error(res.message || 'Error al actualizar');
      setEdit(false);
      const refreshed = await fiscaliaRepository.getById(item.id_fiscalia);
      if (refreshed.success && refreshed.data) setItem(refreshed.data);
    } catch (e:any) { setError(e.message || 'Error'); }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (error || !item) return <Alert severity="error">{error || 'No encontrado'}</Alert>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Button variant="outlined" onClick={() => navigate('/dashboard/fiscalias')}>← Volver</Button>
        <Typography variant="h5" fontWeight={600}>Fiscalía</Typography>
      </Box>
      <Card sx={{ p:3, borderRadius:3 }}>
        {!edit ? (
          <Box display="grid" gap={2}>
            <Typography variant="h6">{item.nombre_fiscalia}</Typography>
            <Typography variant="body2">Dirección: {item.direccion || '—'}</Typography>
            <Typography variant="body2">Teléfono: {item.telefono || '—'}</Typography>
            <Chip size="small" label={item.activo ? 'Activo' : 'Inactivo'} color={item.activo ? 'success':'default'} />
            <Box mt={2} display="flex" gap={2}>
              <Button variant="contained" onClick={() => setEdit(true)}>Editar</Button>
              <Button variant="outlined" color="error" onClick={async () => {
                try {
                  const res = await fiscaliaRepository.delete(item.id_fiscalia);
                  if (!res.success) throw new Error(res.message);
                  navigate('/dashboard/fiscalias');
                } catch (e:any) { setError(e.message || 'Error'); }
              }}>Eliminar</Button>
            </Box>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField label="Nombre" value={form.nombre_fiscalia} onChange={e=>setForm({...form,nombre_fiscalia:e.target.value})} required />
            <TextField label="Dirección" value={form.direccion} onChange={e=>setForm({...form,direccion:e.target.value})} />
            <TextField label="Teléfono" value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})} />
            <TextField select label="Activo" value={form.activo ? 'true':'false'} onChange={e=>setForm({...form, activo: e.target.value === 'true'})}>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </TextField>
            <Box display="flex" gap={2}>
              <Button variant="contained" onClick={save}>Guardar</Button>
              <Button variant="text" onClick={()=>setEdit(false)}>Cancelar</Button>
            </Box>
          </Box>
        )}
        {error && <Alert severity="error" sx={{ mt:2 }}>{error}</Alert>}
      </Card>
    </Box>
  );
};
