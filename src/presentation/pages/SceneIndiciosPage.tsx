import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, Typography, Chip, Button } from '@mui/material';
import { indicioRepository } from '../../infrastructure/repositories/IndicioRepository';
import type { Indicio } from '../../domain/entities/Indicio';
import { useAuth } from '../context/AuthContext';

export const SceneIndiciosPage = () => {
  const { id, escenaId } = useParams<{ id:string; escenaId:string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromRevision = (location.state as any)?.fromRevision === true;
  const [items, setItems] = useState<Indicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, isLoading } = useAuth();

  const load = async () => {
    if (!escenaId) return;
    setLoading(true); setError('');
    try {
      const res = await indicioRepository.getAll({ id_escena: Number(escenaId) });
      if (res.success && res.data) setItems(res.data); else setError(res.message || 'Error');
    } catch(e:any){ setError(e.message || 'Error'); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, [escenaId]);
  useEffect(()=>{
    if (!isLoading) {
      const token = localStorage.getItem('dicri_auth_token');
      if (!user && !token) navigate('/login');
    }
  }, [user, isLoading, navigate]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Button variant="outlined" onClick={()=>navigate(
          `/dashboard/expedientes/${id}/escenas`,
          { state: fromRevision ? { fromRevision:true } : undefined }
        )}>← Escenas</Button>
        <Typography variant="h5" fontWeight={600}>Indicios de Escena {escenaId}</Typography>
        <Button variant="contained" onClick={()=>navigate(
          `/dashboard/expedientes/${id}/escenas/${escenaId}/indicios/new`,
          { state: fromRevision ? { fromRevision:true } : undefined }
        )}>Nuevo Indicio</Button>
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
                <th style={{ padding:12, textAlign:'left' }}>Fecha Recolección</th>
                <th style={{ padding:12, textAlign:'left' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={6} style={{ padding:20 }}>Cargando...</td></tr> :
              error ? <tr><td colSpan={6} style={{ padding:20, color:'#b00020' }}>{error}</td></tr> :
              items.length === 0 ? <tr><td colSpan={6} style={{ padding:20, fontStyle:'italic' }}>Sin indicios</td></tr> :
              items.map(i=>(
                <tr key={i.id_indicio} style={{ borderBottom:'1px solid #e0e0e0' }}>
                  <td style={{ padding:10 }}>{i.id_indicio}</td>
                  <td style={{ padding:10 }}>{i.codigo_indicio}</td>
                  <td style={{ padding:10, maxWidth:240 }}>{i.descripcion_corta}</td>
                  <td style={{ padding:10 }}>
                    <Chip size="small" label={i.estado_actual} color={
                      i.estado_actual === 'ANALIZADO' ? 'success' :
                      i.estado_actual === 'RECOLECTADO' ? 'warning' : 'info'
                    } />
                  </td>
                  <td style={{ padding:10 }}>{i.fecha_hora_recoleccion ? new Date(i.fecha_hora_recoleccion).toLocaleString('es-GT') : '—'}</td>
                  <td style={{ padding:10 }}>
                    <Button size="small" variant="outlined" onClick={()=>navigate(
                      `/dashboard/expedientes/${id}/indicios/${i.id_indicio}/edit`,
                      { state: fromRevision ? { fromRevision:true } : undefined }
                    )}>Editar</Button>
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
