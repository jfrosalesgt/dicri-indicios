import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Button, Chip } from '@mui/material';
import { indicioRepository } from '../../infrastructure/repositories/IndicioRepository';
import type { Indicio } from '../../domain/entities/Indicio';

export const IndiciosExpedientePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<Indicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    if (!id) return;
    setLoading(true); setError('');
    try {
      const res = await indicioRepository.getByExpediente(Number(id));
      if (res.success && res.data) setItems(res.data);
      else setError(res.message || 'Error al cargar indicios');
    } catch (e:any) {
      setError(e.message || 'Error al cargar indicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleDelete = async (indicioId: number) => {
    if (!confirm('¿Eliminar indicio?')) return;
    try {
      const res = await indicioRepository.delete(indicioId);
      if (!res.success) throw new Error(res.message || 'Error al eliminar');
      load();
    } catch (e:any) {
      alert(e.message || 'Error al eliminar');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Button variant="outlined" onClick={() => navigate(`/dashboard/expedientes/${id}`)}>← Volver</Button>
        <Typography variant="h5" fontWeight={600}>Indicios del Expediente {id}</Typography>
        <Button variant="contained" onClick={() => navigate(`/dashboard/expedientes/${id}/indicios/new`)}>Nuevo Indicio</Button>
      </Box>
      <Card sx={{ p:0 }}>
        <Box overflow="auto">
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead style={{ background:'#1a2b4a', color:'#fff' }}>
              <tr>
                <th style={{ padding:12, textAlign:'left' }}>ID</th>
                <th style={{ padding:12, textAlign:'left' }}>Código</th>
                <th style={{ padding:12, textAlign:'left' }}>Descripción</th>
                <th style={{ padding:12, textAlign:'left' }}>Estado</th>
                <th style={{ padding:12, textAlign:'left' }}>Escena</th>
                <th style={{ padding:12, textAlign:'left' }}>Fecha Recolección</th>
                <th style={{ padding:12, textAlign:'left' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding:20 }}>Cargando...</td></tr>
              ) : error ? (
                <tr><td colSpan={7} style={{ padding:20, color:'#b00020' }}>{error}</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={7} style={{ padding:20, fontStyle:'italic' }}>Sin indicios</td></tr>
              ) : items.map(ind => (
                <tr key={ind.id_indicio} style={{ borderBottom:'1px solid #e0e0e0' }}>
                  <td style={{ padding:10 }}>{ind.id_indicio}</td>
                  <td style={{ padding:10 }}>{ind.codigo_indicio}</td>
                  <td style={{ padding:10, maxWidth:240 }}>{ind.descripcion_corta}</td>
                  <td style={{ padding:10 }}>
                    <Chip size="small" label={ind.estado_actual} color={
                      ind.estado_actual === 'ANALIZADO' ? 'success' :
                      ind.estado_actual === 'RECOLECTADO' ? 'warning' : 'info'
                    } />
                  </td>
                  <td style={{ padding:10 }}>{ind.nombre_escena || '—'}</td>
                  <td style={{ padding:10 }}>{ind.fecha_hora_recoleccion ? new Date(ind.fecha_hora_recoleccion).toLocaleString('es-GT') : '—'}</td>
                  <td style={{ padding:10 }}>
                    <Button size="small" variant="outlined" onClick={() => navigate(`/dashboard/expedientes/${id}/indicios/${ind.id_indicio}/edit`)}>Editar</Button>{' '}
                    <Button size="small" variant="text" color="error" onClick={() => handleDelete(ind.id_indicio)}>Eliminar</Button>
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
