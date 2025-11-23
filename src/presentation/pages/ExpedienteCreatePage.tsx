import { useState, useEffect } from 'react';
import { Box, Card, Typography, TextField, Button, Alert, MenuItem, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { expedienteRepository } from '../../infrastructure/repositories/ExpedienteRepository';
import { fiscaliaRepository } from '../../infrastructure/repositories/FiscaliaRepository';

export const ExpedienteCreatePage = () => {
  const navigate = useNavigate();
  const [codigoCaso, setCodigoCaso] = useState('');
  const [nombreCaso, setNombreCaso] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [idFiscalia, setIdFiscalia] = useState<number | ''>('');
  const [descripcionHechos, setDescripcionHechos] = useState('');
  const [fiscalias, setFiscalias] = useState<{ id_fiscalia:number; nombre_fiscalia:string }[]>([]);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingFiscalias, setLoadingFiscalias] = useState(false);
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    const loadFiscalias = async () => {
      setLoadingFiscalias(true);
      try {
        const res = await fiscaliaRepository.getAll({ activo: true });
        if (res.success && res.data) {
          setFiscalias(res.data.map(f => ({ id_fiscalia: f.id_fiscalia, nombre_fiscalia: f.nombre_fiscalia })));
        }
      } catch {}
      setLoadingFiscalias(false);
    };
    loadFiscalias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDone(false);
    if (!codigoCaso.trim() || !nombreCaso.trim() || !fechaInicio || !idFiscalia) {
      setError('Complete todos los campos');
      return;
    }
    setSaving(true);
    try {
      const res = await expedienteRepository.create({
        codigo_caso: codigoCaso.trim(),
        nombre_caso: nombreCaso.trim(),
        fecha_inicio: fechaInicio,
        id_fiscalia: Number(idFiscalia),
        descripcion_hechos: descripcionHechos.trim() || undefined,
        activo,
      });
      if (!res.success || !res.data) {
        setError(res.message || 'Error al registrar');
      } else {
        setDone(true);
        navigate(`/dashboard/expedientes/${res.data.id_investigacion}`);
      }
    } catch (e: any) {
      setError(e.message || 'Error al registrar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Button variant="outlined" onClick={() => navigate('/dashboard/expedientes')}>
          ← Volver
        </Button>
        <Typography variant="h5" fontWeight={600}>Nuevo Expediente</Typography>
        <Box width={80} /> {/* Espaciador para centrar el título */}
      </Box>
      
      <Card sx={{ p:3, borderRadius:3, width:'100%', boxSizing:'border-box' }}>
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={3}>
          {error && <Alert severity="error">{error}</Alert>}
          {done && <Alert severity="success">Expediente creado exitosamente</Alert>}
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Código Caso"
                value={codigoCaso}
                onChange={(e) => setCodigoCaso(e.target.value)}
                required
                disabled={saving}
                placeholder="MP001-2025-1001"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Nombre del Caso"
                value={nombreCaso}
                onChange={(e) => setNombreCaso(e.target.value)}
                required
                disabled={saving}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Fecha de Inicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                required
                disabled={saving}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Fiscalía"
                value={idFiscalia}
                onChange={(e) => setIdFiscalia(Number(e.target.value))}
                required
                disabled={saving || loadingFiscalias}
                fullWidth
              >
                {fiscalias.map((f) => (
                  <MenuItem key={f.id_fiscalia} value={f.id_fiscalia}>
                    {f.nombre_fiscalia}
                  </MenuItem>
                ))}
                {loadingFiscalias && <MenuItem disabled>Cargando...</MenuItem>}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Estado"
                value={activo ? 'true' : 'false'}
                onChange={(e) => setActivo(e.target.value === 'true')}
                disabled={saving}
                fullWidth
              >
                <MenuItem value="true">Activo</MenuItem>
                <MenuItem value="false">Inactivo</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción de los Hechos"
                value={descripcionHechos}
                onChange={(e) => setDescripcionHechos(e.target.value)}
                multiline
                minRows={3}
                fullWidth
                disabled={saving}
              />
            </Grid>
          </Grid>

          <Box display="flex" gap={2} flexWrap="wrap" justifyContent="flex-start">
            <Button
              type="submit"
              variant="contained"
              disabled={saving || !codigoCaso.trim() || !nombreCaso.trim() || !fechaInicio || !idFiscalia}
            >
              {saving ? 'Guardando...' : 'Guardar Expediente'}
            </Button>
            <Button
              variant="text"
              onClick={() => navigate('/dashboard/expedientes')}
              disabled={saving}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};