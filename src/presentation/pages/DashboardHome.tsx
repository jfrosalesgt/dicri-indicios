import './DashboardHome.css';
import { useEffect, useState } from 'react';
import { Box, Typography, Card, Grid, Button, Alert } from '@mui/material';
import { reportesRepository } from '../../infrastructure/repositories/ReportesRepository';
import type { EstadisticasGenerales } from '../../domain/entities/Reportes';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { useAppSelector } from '../../store/store';

export const DashboardHome = () => {
  const [stats, setStats] = useState<EstadisticasGenerales | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); 
    setError('');
    try {
      const res = await reportesRepository.getEstadisticasGenerales();
      if (res.success && res.data) setStats(res.data); 
      else setError(res.message || 'Error al cargar estadísticas');
    } catch(e:any){ 
      setError(e.message || 'Error al cargar estadísticas'); 
    }
    finally { 
      setLoading(false); 
    }
  };
  
  useEffect(()=>{ 
    load(); 
  }, []);

  return (
    <Box className="dashboard-home">
      <Card sx={{ p:4, borderRadius:4 }}>
        <Box textAlign="center" mb={5}>
          <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={1}>
            <Typography variant="h3" fontWeight={700}>MP</Typography>
            <Typography variant="h3" fontWeight={700}>⚖️</Typography>
          </Box>
          <Typography variant="h5" fontWeight={600}>MINISTERIO PÚBLICO</Typography>
          <Typography variant="subtitle1" color="text.secondary" mt={1}>Panel General DICRI</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Typography variant="h6" fontWeight={600}>Indicadores</Typography>
          <Button variant="outlined" onClick={load} disabled={loading}>Refrescar</Button>
        </Box>

        {loading && <Typography>Cargando indicadores...</Typography>}
        {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}

        {!loading && !error && stats && (
          <Grid container spacing={2} mb={3}>
            <Stat label="Total Expedientes" value={stats.total_expedientes} color="#0d47a1" icon={<ListAltIcon fontSize="small" />} />
            <Stat label="En Registro" value={stats.en_registro} color="#1976d2" icon={<EditNoteIcon fontSize="small" />} />
            <Stat label="Pendiente Revisión" value={stats.pendiente_revision} color="#ff9800" icon={<PendingActionsIcon fontSize="small" />} />
            <Stat label="Aprobados" value={stats.aprobados} color="#2e7d32" icon={<CheckCircleIcon fontSize="small" />} />
            <Stat label="Rechazados" value={stats.rechazados} color="#d32f2f" icon={<CancelIcon fontSize="small" />} />
            <Stat label="Total Indicios" value={stats.total_indicios} color="#6a1b9a" icon={<Inventory2Icon fontSize="small" />} />
            <Grid item xs={12}>
              <Card sx={{ p:2.5, borderRadius:3, bgcolor:'#f5f7fa' }}>
                <Typography variant="subtitle2" fontWeight={600} mb={1.5}>Distribución por Fiscalía</Typography>
                {(() => {
                  const max = Math.max(1, ...stats.expedientes_por_fiscalia.map(f => f.total));
                  return (
                    <Box display="flex" flexDirection="column" gap={1}>
                      {stats.expedientes_por_fiscalia.map(f => {
                        const pct = (f.total / max) * 100;
                        return (
                          <Box key={f.nombre_fiscalia}>
                            <Box display="flex" justifyContent="space-between" mb={0.5}>
                              <Typography variant="caption" fontWeight={600}>{f.nombre_fiscalia}</Typography>
                              <Typography variant="caption" color="text.secondary">{f.total}</Typography>
                            </Box>
                            <Box sx={{
                              height:12,
                              borderRadius:6,
                              bgcolor:'#e0e3e7',
                              overflow:'hidden',
                              position:'relative'
                            }}>
                              <Box sx={{
                                position:'absolute',
                                inset:0,
                                width:`${pct}%`,
                                bgcolor:'linear-gradient(90deg, #0d47a1, #1976d2)',
                                background:`linear-gradient(90deg, #1565c0, #42a5f5)`,
                                transition:'width .6s'
                              }} />
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  );
                })()}
              </Card>
            </Grid>
          </Grid>
        )}
      </Card>
    </Box>
  );
};

const Stat = ({ label, value, color, icon }:{
  label:string; value:number; color:string; icon:React.ReactNode
}) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card
      sx={{
        p:2,
        borderRadius:3,
        display:'flex',
        flexDirection:'column',
        gap:0.5,
        minHeight:110,
        background:`linear-gradient(135deg, ${color}22, ${color}11)`,
        border:`1px solid ${color}33`
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Box
          sx={{
            width:32,
            height:32,
            borderRadius:'50%',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            bgcolor:`${color}33`,
            color:color
          }}
        >
          {icon}
        </Box>
        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ lineHeight:1.2 }}>
          {label}
        </Typography>
      </Box>
      <Typography variant="h5" fontWeight={700} sx={{ mt:1, color }}>
        {value}
      </Typography>
    </Card>
  </Grid>
);
