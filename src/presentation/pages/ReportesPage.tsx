import { useEffect, useState } from 'react';
import { Box, Card, Typography, Grid, TextField, MenuItem, Button, Chip, Alert } from '@mui/material';
import { reportesRepository } from '../../infrastructure/repositories/ReportesRepository';
import type { ReporteRevisionExpediente, EstadisticasGenerales } from '../../domain/entities/Reportes';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import CancelIcon from '@mui/icons-material/Cancel';
import EditNoteIcon from '@mui/icons-material/EditNote';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useAppSelector } from '../../store/store';

const estados = ['EN_REGISTRO','PENDIENTE_REVISION','APROBADO','RECHAZADO'];

export const ReportesPage = () => {
  const hoy = new Date();
  const inicioDef = `${hoy.getFullYear()}-01-01`;
  const finDef = `${hoy.getFullYear()}-12-31`;

  const [fechaInicio, setFechaInicio] = useState(inicioDef);
  const [fechaFin, setFechaFin] = useState(finDef);
  const [estado, setEstado] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ReporteRevisionExpediente[]>([]);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<EstadisticasGenerales | null>(null);
  const [statsError, setStatsError] = useState('');
  const [statsLoading, setStatsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({}); // nuevo estado

  const loadStats = async () => {
    setStatsLoading(true); setStatsError('');
    try {
      const res = await reportesRepository.getEstadisticasGenerales();
      if (res.success && res.data) setStats(res.data); else setStatsError(res.message || 'Error');
    } catch(e:any){ setStatsError(e.message || 'Error'); }
    finally { setStatsLoading(false); }
  };

  const loadReporte = async () => {
    setLoading(true); setError('');
    try {
      const res = await reportesRepository.getRevisionExpedientes({
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        estado_revision: estado || undefined
      });
      if (res.success && res.data) setItems(res.data); else setError(res.message || 'Error');
    } catch(e:any){ setError(e.message || 'Error'); }
    finally { setLoading(false); }
  };

  useEffect(()=> { loadStats(); loadReporte(); }, []);

  const filteredItems = items.filter(r => {
    if (!searchText.trim()) return true;
    const q = searchText.toLowerCase();
    const safe = (v: any) => (v ?? '').toString().toLowerCase();
    return (
      safe(r.codigo_caso).includes(q) ||
      safe(r.nombre_caso).includes(q) ||
      safe(r.nombre_fiscalia).includes(q) ||
      safe(r.tecnico_registra).includes(q) ||
      safe(r.coordinador_revision).includes(q) ||
      safe(r.justificacion_revision).includes(q)
    );
  });

  const exportCsv = () => {
    if (filteredItems.length === 0) return;
    const header = ['codigo_caso','nombre_caso','nombre_fiscalia','fecha_registro','tecnico_registra','estado_actual','fecha_revision','coordinador_revision','justificacion_revision'];
    const rows = filteredItems.map(i => header.map(h => `"${(i as any)[h] ?? ''}"`).join(','));
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_revision_${fechaInicio}_${fechaFin}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleExpand = (codigo: string) => {
    setExpandedCards(prev => ({ ...prev, [codigo]: !prev[codigo] }));
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>Reportería DICRI</Typography>

      {/* Card: Reporte de Revisión (mantiene filtros + tabla) */}
      <Card sx={{ p:3, mb:4, borderRadius:4 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>Reporte de Revisión de Expedientes</Typography>
        {/* Filtros en 3 columnas */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={4}>
            <Box display="flex" gap={1} flexWrap="wrap">
              <TextField
                label="Fecha Inicio"
                type="date"
                value={fechaInicio}
                onChange={e=>setFechaInicio(e.target.value)}
                InputLabelProps={{ shrink:true }}
                size="small"
                sx={{ flex:1, minWidth:160 }}
              />
              <TextField
                label="Fecha Fin"
                type="date"
                value={fechaFin}
                onChange={e=>setFechaFin(e.target.value)}
                InputLabelProps={{ shrink:true }}
                size="small"
                sx={{ flex:1, minWidth:160 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" gap={1} flexWrap="wrap">
              <TextField
                select
                label="Estado"
                value={estado}
                onChange={e=>setEstado(e.target.value)}
                size="small"
                sx={{ flex:1, minWidth:140 }}
              >
                <MenuItem value="">Todos</MenuItem>
                {estados.map(es => <MenuItem key={es} value={es}>{es}</MenuItem>)}
              </TextField>
              <TextField
                label="Filtro texto"
                placeholder="Buscar (caso, fiscalía, técnico...)"
                value={searchText}
                onChange={e=>setSearchText(e.target.value)}
                size="small"
                sx={{ flex:1, minWidth:180 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" justifyContent="flex-end" gap={1} flexWrap="wrap">
              <Button variant="contained" onClick={loadReporte} disabled={loading}>Buscar</Button>
              <Button variant="outlined" onClick={exportCsv} disabled={filteredItems.length === 0 || loading}>Exportar</Button>
            </Box>
          </Grid>
        </Grid>

        {/* Data Iterator */}
        {loading && <Card sx={{ p:3 }}><Typography>Cargando...</Typography></Card>}
        {error && !loading && <Card sx={{ p:3 }}><Typography color="error">{error}</Typography></Card>}
        {!loading && !error && items.length === 0 && (
          <Card sx={{ p:3 }}><Typography fontStyle="italic">Sin datos para el rango seleccionado</Typography></Card>
        )}
        {!loading && !error && filteredItems.length === 0 && items.length > 0 && (
          <Card sx={{ p:3, mb:2 }}>
            <Typography fontStyle="italic">Sin coincidencias con el filtro de texto.</Typography>
          </Card>
        )}
        {!loading && !error && filteredItems.length > 0 && (
          <Grid container spacing={2}>
            {filteredItems.map(r => {
              const stateColor: Record<string,string> = {
                APROBADO: '#2e7d32',
                RECHAZADO: '#c62828',
                PENDIENTE_REVISION: '#ed6c02',
                EN_REGISTRO: '#1565c0'
              };
              const iconByState: Record<string, JSX.Element> = {
                APROBADO: <CheckCircleIcon fontSize="small" />,
                RECHAZADO: <CancelIcon fontSize="small" />,
                PENDIENTE_REVISION: <HourglassBottomIcon fontSize="small" />,
                EN_REGISTRO: <EditNoteIcon fontSize="small" />
              };
              const expanded = expandedCards[r.codigo_caso] === true;
              return (
                <Grid key={r.codigo_caso} item xs={12}>
                  <Card
                    sx={{
                      p:0,
                      borderRadius:3,
                      overflow:'hidden',
                      position:'relative',
                      bgcolor:'#ffffff',
                      color:'#0f1d33',
                      border:'1px solid #e0e6ed',
                      boxShadow:'0 3px 10px rgba(0,0,0,.12)',
                      background:'linear-gradient(135deg,#ffffff 0%,#f5f7fa 100%)',
                      '&:hover':{
                        boxShadow:'0 6px 16px rgba(0,0,0,.18)',
                        transform:'translateY(-2px)',
                        transition:'all .25s'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'space-between',
                        px:2.2,
                        py:1.1,
                        bgcolor:`${stateColor[r.estado_actual]}1A`,
                        borderBottom:`1px solid ${stateColor[r.estado_actual]}33`
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width:30,
                            height:30,
                            borderRadius:'50%',
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center',
                            bgcolor:`${stateColor[r.estado_actual]}33`,
                            color:stateColor[r.estado_actual]
                          }}
                        >
                          {iconByState[r.estado_actual] || <InfoOutlinedIcon fontSize="small" />}
                        </Box>
                        <Typography variant="subtitle2" fontWeight={700}>{r.codigo_caso}</Typography>
                      </Box>
                      <Chip
                        size="small"
                        label={r.estado_actual}
                        sx={{
                          bgcolor: stateColor[r.estado_actual],
                          color:'#fff',
                          fontSize:11,
                          fontWeight:600
                        }}
                      />
                    </Box>
                    <Box px={2.5} py={2} display="flex" flexDirection="column" gap={1.2}>
                      <Typography variant="body2" fontWeight={600}>{r.nombre_caso}</Typography>
                      <Typography variant="caption" color="text.secondary">Fiscalía: {r.nombre_fiscalia}</Typography>
                      <Grid container spacing={1} mt={0.5}>
                        <Grid item xs={6}>
                          <Typography variant="caption" fontWeight={600}>Registro</Typography>
                          <Typography variant="caption" display="block">
                            {new Date(r.fecha_registro).toLocaleDateString('es-GT')}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" fontWeight={600}>Revisión</Typography>
                          <Typography variant="caption" display="block">
                            {new Date(r.fecha_revision).toLocaleDateString('es-GT')}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" fontWeight={600}>Técnico</Typography>
                          <Typography variant="caption" display="block">{r.tecnico_registra}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" fontWeight={600}>Coordinador</Typography>
                          <Typography variant="caption" display="block">{r.coordinador_revision}</Typography>
                        </Grid>
                      </Grid>
                      <Box mt={0.5}>
                        <Typography variant="caption" fontWeight={600}>Justificación</Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display:'block',
                            mt:.25,
                            maxHeight: expanded ? 'none' : 48,
                            overflow:'hidden'
                          }}
                        >
                          {r.justificacion_revision || '—'}
                        </Typography>
                        {r.justificacion_revision && r.justificacion_revision.length > 90 && (
                          <Button
                            variant="text"
                            size="small"
                            sx={{ color:stateColor[r.estado_actual], textTransform:'none', fontSize:11, mt:.5, p:0, minWidth:0 }}
                            onClick={()=>toggleExpand(r.codigo_caso)}
                          >
                            {expanded ? 'Ver menos' : 'Ver más'}
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Card>
      {/* Indicadores Generales (Stat igual a dashboard) */}
      <Card sx={{ p:4, borderRadius:4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Typography variant="h6" fontWeight={600}>Indicadores Generales</Typography>
          <Button variant="outlined" onClick={loadStats} disabled={statsLoading}>Refrescar</Button>
        </Box>
        {statsLoading && <Typography>Cargando estadísticas...</Typography>}
        {statsError && <Alert severity="error" sx={{ mb:2 }}>{statsError}</Alert>}
        {!statsLoading && !statsError && stats && (
          <Grid container spacing={2}>
            <Stat label="Total Expedientes" value={stats.total_expedientes} color="#0d47a1" />
            <Stat label="En Registro" value={stats.en_registro} color="#1976d2" />
            <Stat label="Pendiente Revisión" value={stats.pendiente_revision} color="#ff9800" />
            <Stat label="Aprobados" value={stats.aprobados} color="#2e7d32" />
            <Stat label="Rechazados" value={stats.rechazados} color="#d32f2f" />
            <Stat label="Total Indicios" value={stats.total_indicios} color="#6a1b9a" />
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
                                background:'linear-gradient(90deg, #1565c0, #42a5f5)',
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

// Componente Stat mejorado
const Stat = ({ label, value, color }:{
  label:string; value:number; color:string;
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
      <Typography variant="caption" fontWeight={600} color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={700} sx={{ mt:1, color }}>
        {value}
      </Typography>
    </Card>
  </Grid>
);
