import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, Typography, Button, Chip } from '@mui/material';
import { escenaRepository } from '../../infrastructure/repositories/EscenaRepository';
import type { Escena } from '../../domain/entities/Escena';

export const ScenesExpedientePage = () => {
  const { id } = useParams<{ id:string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromRevision = (location.state as any)?.fromRevision === true;
  const [items, setItems] = useState<Escena[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    if (!id) return;
    setLoading(true); setError('');
    try {
      const res = await escenaRepository.getByExpediente(Number(id));
      if (res.success && res.data) setItems(res.data); else setError(res.message || 'Error');
    } catch(e:any){ setError(e.message || 'Error'); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, [id]);

  const remove = async (escenaId:number) => {
    if (!confirm('¿Eliminar escena?')) return;
    try {
      const res = await escenaRepository.delete(escenaId);
      if (!res.success) throw new Error(res.message || 'Error al eliminar');
      load();
    } catch(e:any){ alert(e.message || 'Error'); }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Button variant="outlined" onClick={()=>navigate(
          `/dashboard/expedientes/${id}`,
          { state: fromRevision ? { fromRevision:true } : undefined }
        )}>← Volver</Button>
        <Typography variant="h5" fontWeight={600}>Escenas del Expediente {id}</Typography>
        <Button variant="contained" onClick={()=>navigate(
          `/dashboard/expedientes/${id}/escenas/new`,
          { state: fromRevision ? { fromRevision:true } : undefined }
        )}>Nueva Escena</Button>
      </Box>
      <Card sx={{ p:0 }}>
        <Box overflow="auto">
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead style={{ background:'#1a2b4a', color:'#fff' }}>
              <tr>
                <th style={{ padding:12, textAlign:'left' }}>ID</th>
                <th style={{ padding:12, textAlign:'left' }}>Nombre</th>
                <th style={{ padding:12, textAlign:'left' }}>Dirección</th>
                <th style={{ padding:12, textAlign:'left' }}>Inicio</th>
                <th style={{ padding:12, textAlign:'left' }}>Fin</th>
                <th style={{ padding:12, textAlign:'left' }}>Activo</th>
                <th style={{ padding:12, textAlign:'left' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={7} style={{ padding:20 }}>Cargando...</td></tr> :
               error ? <tr><td colSpan={7} style={{ padding:20, color:'#b00020' }}>{error}</td></tr> :
               items.length === 0 ? <tr><td colSpan={7} style={{ padding:20, fontStyle:'italic' }}>Sin escenas</td></tr> :
               items.map(s=>(
                <tr key={s.id_escena} style={{ borderBottom:'1px solid #e0e0e0' }}>
                  <td style={{ padding:10 }}>{s.id_escena}</td>
                  <td style={{ padding:10 }}>{s.nombre_escena}</td>
                  <td style={{ padding:10, maxWidth:240 }}>{s.direccion_escena || '—'}</td>
                  <td style={{ padding:10 }}>{new Date(s.fecha_hora_inicio).toLocaleString('es-GT')}</td>
                  <td style={{ padding:10 }}>{s.fecha_hora_fin ? new Date(s.fecha_hora_fin).toLocaleString('es-GT') : '—'}</td>
                  <td style={{ padding:10 }}>
                    <Chip size="small" label={s.activo ? 'Activo':'Inactivo'} color={s.activo ? 'success':'default'} />
                  </td>
                  <td style={{ padding:10 }}>
                    <Button size="small" variant="outlined" onClick={()=>navigate(
                      `/dashboard/expedientes/${id}/escenas/${s.id_escena}/edit`,
                      { state: fromRevision ? { fromRevision:true } : undefined }
                    )}>Editar</Button>{' '}
                    <Button size="small" variant="text" onClick={()=>navigate(
                      `/dashboard/expedientes/${id}/escenas/${s.id_escena}/indicios`,
                      { state: fromRevision ? { fromRevision:true } : undefined }
                    )}>Indicios</Button>{' '}
                    <Button size="small" variant="text" color="error" onClick={()=>remove(s.id_escena)}>Eliminar</Button>
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
