import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Chip, Button, Alert, TextField, MenuItem } from '@mui/material';
import { tipoIndicioRepository } from '../../infrastructure/repositories/TipoIndicioRepository';
import type { TipoIndicio } from '../../domain/entities/TipoIndicio';

export const TipoIndicioDetailPage = () => {
  const { id } = useParams<{ id:string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<TipoIndicio | null>(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ nombre_tipo:'', descripcion:'', activo:true });
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true); setError('');
      try {
        const res = await tipoIndicioRepository.getById(Number(id));
        if (res.success && res.data) {
          setItem(res.data);
          setForm({
            nombre_tipo: res.data.nombre_tipo,
            descripcion: res.data.descripcion || '',
            activo: res.data.activo,
          });
        } else setError(res.message || 'Error');
      } catch(e:any){ setError(e.message || 'Error'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const save = async () => {
    if (!item) return;
    try {
      const res = await tipoIndicioRepository.update(item.id_tipo_indicio, form);
      if (!res.success) throw new Error(res.message || 'Error al actualizar');
      setEdit(false);
      const refreshed = await tipoIndicioRepository.getById(item.id_tipo_indicio);
      if (refreshed.success && refreshed.data) setItem(refreshed.data);
    } catch(e:any){ setError(e.message || 'Error'); }
  };

  const remove = async () => {
    if (!item) return;
    try {
      const res = await tipoIndicioRepository.delete(item.id_tipo_indicio);
      if (!res.success) throw new Error(res.message || 'Error al eliminar');
      navigate('/dashboard/tipos-indicio');
    } catch(e:any){ setError(e.message || 'Error'); }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (error || !item) return (
    <Box>
      <Alert severity="error" sx={{ mb:2 }}>{error || 'No encontrado'}</Alert>
      <Button variant="outlined" onClick={()=>navigate('/dashboard/tipos-indicio')}>Volver</Button>
    </Box>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Button variant="outlined" onClick={()=>navigate('/dashboard/tipos-indicio')}>← Volver</Button>
        <Typography variant="h5" fontWeight={600}>Tipo de Indicio</Typography>
      </Box>
      <Card sx={{ p:3, borderRadius:3 }}>
        {!edit ? (
          <Box display="grid" gap={2}>
            <Typography variant="h6">{item.nombre_tipo}</Typography>
            <Typography variant="body2">Descripción: {item.descripcion || '—'}</Typography>
            <Chip size="small" label={item.activo ? 'Activo':'Inactivo'} color={item.activo ? 'success':'default'} />
            <Box mt={2} display="flex" gap={2}>
              <Button variant="contained" onClick={()=>setEdit(true)}>Editar</Button>
              <Button variant="outlined" color="error" onClick={remove}>Eliminar</Button>
            </Box>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField label="Nombre" value={form.nombre_tipo} onChange={e=>setForm({...form,nombre_tipo:e.target.value})} required />
            <TextField label="Descripción" value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} multiline minRows={3} />
            <TextField
              select
              label="Activo"
              value={form.activo ? 'true':'false'}
              onChange={e=>setForm({...form, activo: e.target.value === 'true'})}
            >
              <MenuItem value="true">Activo</MenuItem>
              <MenuItem value="false">Inactivo</MenuItem>
            </TextField>
            <Box display="flex" gap={2}>
              <Button variant="contained" onClick={save} disabled={!form.nombre_tipo.trim()}>Guardar</Button>
              <Button variant="text" onClick={()=>setEdit(false)}>Cancelar</Button>
            </Box>
          </Box>
        )}
        {error && <Alert severity="error" sx={{ mt:2 }}>{error}</Alert>}
      </Card>
    </Box>
  );
};
