import { useEffect, useState } from 'react';
import { Box, Card, Typography, Button, TextField, MenuItem, Chip, Grid, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import type { Expediente, EstadoRevisionDicri } from '../../domain/entities/Expediente';
import { expedienteRepository } from '../../infrastructure/repositories/ExpedienteRepository';
import { fiscaliaRepository } from '../../infrastructure/repositories/FiscaliaRepository';
import { useNavigate } from 'react-router-dom';

const estados: EstadoRevisionDicri[] = ['EN_REGISTRO','PENDIENTE_REVISION','APROBADO','RECHAZADO'];

export const ExpedientesListPage = () => {
  // ❌ REMOVER si no se usa realmente
  // const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Expediente[]>([]);
  const [loading, setLoading] = useState(false);
  const [estado, setEstado] = useState('');
  const [activo, setActivo] = useState('');
  const [idUsuarioRegistro, setIdUsuarioRegistro] = useState('');
  const [idFiscalia, setIdFiscalia] = useState('');
  const [fiscalias, setFiscalias] = useState<{ id_fiscalia:number; nombre_fiscalia:string }[]>([]);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await expedienteRepository.getAll({
        estado_revision_dicri: estado ? (estado as EstadoRevisionDicri) : undefined,
        id_fiscalia: idFiscalia ? Number(idFiscalia) : undefined,
        id_usuario_registro: idUsuarioRegistro ? Number(idUsuarioRegistro) : undefined,
        activo: activo ? activo === 'true' : undefined,
      });
      if (res.success && res.data) setItems(res.data);
      else setError(res.message || 'Error al cargar expedientes');
    } catch (e: any) {
      setError(e.message || 'Error al cargar expedientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fiscaliaRepository.getAll({ activo:true }).then(r=>{
      if (r.success && r.data) setFiscalias(r.data.map(f=>({id_fiscalia:f.id_fiscalia,nombre_fiscalia:f.nombre_fiscalia})));
    }).catch(()=>{});
  }, []);

  const resetFilters = () => {
    setEstado('');
    setActivo('');
    setIdUsuarioRegistro('');
    setIdFiscalia('');
    fetchData();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h5" fontWeight={600}>Gestión de Expedientes DICRI</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/dashboard/expedientes/new')}>
          Nuevo Expediente
        </Button>
      </Box>

      <Card sx={{ p:2.5, mb:3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              select fullWidth size="small" label="Estado Revisión"
              value={estado} onChange={(e)=>setEstado(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {estados.map(es=> <MenuItem key={es} value={es}>{es}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select fullWidth size="small" label="Activo"
              value={activo} onChange={(e)=>setActivo(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="true">Activos</MenuItem>
              <MenuItem value="false">Inactivos</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select fullWidth size="small" label="Fiscalía"
              value={idFiscalia} onChange={(e)=>setIdFiscalia(e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              {fiscalias.map(f=> <MenuItem key={f.id_fiscalia} value={f.id_fiscalia}>{f.nombre_fiscalia}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth size="small" label="ID Usuario Registro"
              value={idUsuarioRegistro} onChange={(e)=>setIdUsuarioRegistro(e.target.value.replace(/\D/g,''))}
              placeholder="Ej: 2"
            />
          </Grid>
          <Grid item xs={12} display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              disabled={loading}
              onClick={fetchData}
            >Buscar</Button>
            <IconButton
              color="primary"
              onClick={resetFilters}
              disabled={loading}
              aria-label="Reset filtros"
            >
              <RefreshIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Card>

      <Card sx={{ p:0 }}>
        <Box overflow="auto">
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead style={{ background:'#1a2b4a', color:'#fff' }}>
              <tr>
                <th style={{ padding:12, textAlign:'left' }}>ID</th>
                <th style={{ padding:12, textAlign:'left' }}>Código Caso</th>
                <th style={{ padding:12, textAlign:'left' }}>Nombre Caso</th>
                <th style={{ padding:12, textAlign:'left' }}>Fiscalía</th>
                <th style={{ padding:12, textAlign:'left' }}>Estado</th>
                <th style={{ padding:12, textAlign:'left' }}>Fecha Inicio</th>
                <th style={{ padding:12, textAlign:'left' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding:20 }}>Cargando...</td></tr>
              ) : error ? (
                <tr><td colSpan={7} style={{ padding:20, color:'#b00020' }}>{error}</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={7} style={{ padding:20, fontStyle:'italic' }}>Sin expedientes</td></tr>
              ) : (
                items.map(exp => (
                  <tr key={exp.id_investigacion} style={{ borderBottom:'1px solid #e0e0e0' }}>
                    <td style={{ padding:10 }}>{exp.id_investigacion}</td>
                    <td style={{ padding:10 }}>{exp.codigo_caso}</td>
                    <td style={{ padding:10, maxWidth:240 }}>{exp.nombre_caso}</td>
                    <td style={{ padding:10 }}>{exp.nombre_fiscalia || exp.id_fiscalia}</td>
                    <td style={{ padding:10 }}>
                      <Chip 
                        size="small" 
                        label={exp.estado_revision_dicri} 
                        color={
                          exp.estado_revision_dicri === 'APROBADO' ? 'success' :
                          exp.estado_revision_dicri === 'RECHAZADO' ? 'error' :
                          exp.estado_revision_dicri === 'PENDIENTE_REVISION' ? 'warning' : 'default'
                        } 
                      />
                    </td>
                    <td style={{ padding:10 }}>{new Date(exp.fecha_inicio).toLocaleDateString('es-GT')}</td>
                    <td style={{ padding:10 }}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        onClick={() => navigate(`/dashboard/expedientes/${exp.id_investigacion}`)}
                      >
                        Ver
                      </Button>
                      {/* ✅ Mostrar botón Editar solo si está EN_REGISTRO */}
                      {exp.estado_revision_dicri === 'EN_REGISTRO' && (
                        <>
                          {' '}
                          <Button 
                            size="small" 
                            variant="contained" 
                            onClick={() => navigate(`/dashboard/expedientes/${exp.id_investigacion}/edit`)}
                          >
                            Editar
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Box>
      </Card>
    </Box>
  );
};
