import { useEffect, useState } from 'react';
import { Box, Card, Typography, Chip, Button, TextField, MenuItem } from '@mui/material';
import { fiscaliaRepository } from '../../infrastructure/repositories/FiscaliaRepository';
import type { Fiscalia } from '../../domain/entities/Fiscalia';
import { useNavigate } from 'react-router-dom';

export const FiscaliasListPage = () => {
  const [items, setItems] = useState<Fiscalia[]>([]);
  const [loading, setLoading] = useState(false);
  const [activo, setActivo] = useState<string>('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await fiscaliaRepository.getAll({ activo: activo === '' ? undefined : activo === 'true' });
      if (res.success && res.data) setItems(res.data); else setError(res.message || 'Error');
    } catch (e:any) { setError(e.message || 'Error'); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h5" fontWeight={600}>Fiscalías</Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard/fiscalias/new')}>Nueva Fiscalía</Button>
      </Box>
      <Card sx={{ p:2, mb:3 }}>
        <TextField select label="Activo" size="small" value={activo} onChange={e => { setActivo(e.target.value); }} sx={{ width:180, mr:2 }} />
        <Button variant="outlined" disabled={loading} onClick={load}>Filtrar</Button>
      </Card>
      <Card sx={{ p:0 }}>
        <Box overflow="auto">
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead style={{ background:'#1a2b4a', color:'#fff' }}>
              <tr>
                <th style={{ padding:12, textAlign:'left' }}>ID</th>
                <th style={{ padding:12, textAlign:'left' }}>Nombre</th>
                <th style={{ padding:12, textAlign:'left' }}>Dirección</th>
                <th style={{ padding:12, textAlign:'left' }}>Teléfono</th>
                <th style={{ padding:12, textAlign:'left' }}>Estado</th>
                <th style={{ padding:12, textAlign:'left' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={6} style={{ padding:20 }}>Cargando...</td></tr> :
              error ? <tr><td colSpan={6} style={{ padding:20, color:'#b00020' }}>{error}</td></tr> :
              items.length === 0 ? <tr><td colSpan={6} style={{ padding:20, fontStyle:'italic' }}>Sin fiscalías</td></tr> :
              items.map(f => (
                <tr key={f.id_fiscalia} style={{ borderBottom:'1px solid #e0e0e0' }}>
                  <td style={{ padding:10 }}>{f.id_fiscalia}</td>
                  <td style={{ padding:10 }}>{f.nombre_fiscalia}</td>
                  <td style={{ padding:10 }}>{f.direccion || '—'}</td>
                  <td style={{ padding:10 }}>{f.telefono || '—'}</td>
                  <td style={{ padding:10 }}><Chip size="small" label={f.activo ? 'Activo' : 'Inactivo'} color={f.activo ? 'success':'default'} /></td>
                  <td style={{ padding:10 }}><Button size="small" variant="outlined" onClick={() => navigate(`/dashboard/fiscalias/${f.id_fiscalia}`)}>Ver</Button></td>
                </tr>
              )) }
            </tbody>
          </table>
        </Box>
      </Card>
    </Box>
  );
};
