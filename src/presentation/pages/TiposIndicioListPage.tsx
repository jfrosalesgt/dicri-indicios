import { useEffect, useState } from 'react';
import { Box, Card, Typography, Chip, Button, TextField, MenuItem } from '@mui/material';
import { tipoIndicioRepository } from '../../infrastructure/repositories/TipoIndicioRepository';
import type { TipoIndicio } from '../../domain/entities/TipoIndicio';
import { useNavigate } from 'react-router-dom';

export const TiposIndicioListPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<TipoIndicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [activo, setActivo] = useState<string>('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await tipoIndicioRepository.getAll({ activo: activo === '' ? undefined : activo === 'true' });
      if (res.success && res.data) setItems(res.data);
      else setError(res.message || 'Error');
    } catch (e:any) { setError(e.message || 'Error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h5" fontWeight={600}>Tipos de Indicio</Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard/tipos-indicio/new')}>Nuevo Tipo</Button>
      </Box>
      <Card sx={{ p:2, mb:3 }}>
        <TextField
          select
          label="Activo"
          size="small"
          value={activo}
          onChange={e => setActivo(e.target.value)}
          sx={{ width:180, mr:2 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="true">Activos</MenuItem>
          <MenuItem value="false">Inactivos</MenuItem>
        </TextField>
        <Button variant="outlined" disabled={loading} onClick={load}>Filtrar</Button>
      </Card>
      <Card sx={{ p:0 }}>
        <Box overflow="auto">
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead style={{ background:'#1a2b4a', color:'#fff' }}>
              <tr>
                <th style={{ padding:12, textAlign:'left' }}>ID</th>
                <th style={{ padding:12, textAlign:'left' }}>Nombre</th>
                <th style={{ padding:12, textAlign:'left' }}>Descripción</th>
                <th style={{ padding:12, textAlign:'left' }}>Estado</th>
                <th style={{ padding:12, textAlign:'left' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={5} style={{ padding:20 }}>Cargando...</td></tr> :
               error ? <tr><td colSpan={5} style={{ padding:20, color:'#b00020' }}>{error}</td></tr> :
               items.length === 0 ? <tr><td colSpan={5} style={{ padding:20, fontStyle:'italic' }}>Sin tipos de indicio</td></tr> :
               items.map(t => (
                <tr key={t.id_tipo_indicio} style={{ borderBottom:'1px solid #e0e0e0' }}>
                  <td style={{ padding:10 }}>{t.id_tipo_indicio}</td>
                  <td style={{ padding:10 }}>{t.nombre_tipo}</td>
                  <td style={{ padding:10, maxWidth:260 }}>{t.descripcion || '—'}</td>
                  <td style={{ padding:10 }}>
                    <Chip size="small" label={t.activo ? 'Activo':'Inactivo'} color={t.activo ? 'success':'default'} />
                  </td>
                  <td style={{ padding:10 }}>
                    <Button size="small" variant="outlined" onClick={() => navigate(`/dashboard/tipos-indicio/${t.id_tipo_indicio}`)}>Ver</Button>
                  </td>
                </tr>
               ))}
            </tbody>
          </table>
        </Box>
      </Card>
    </Box>
  );
};
