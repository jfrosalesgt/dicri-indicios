import { useState, useEffect } from 'react';
import { Box, Card, Typography, TextField, Button, Alert, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { expedienteRepository } from '../../infrastructure/repositories/ExpedienteRepository';
import { fiscaliaRepository } from '../../infrastructure/repositories/FiscaliaRepository';
import { useAuth } from '../context/AuthContext';

export const ExpedienteCreatePage = () => {
  const { user } = useAuth();
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

  useEffect(() => {
    const loadFiscalias = async () => {
      try {
        const res = await fiscaliaRepository.getAll({ activo: true });
        if (res.success && res.data) {
          setFiscalias(res.data.map(f => ({ id_fiscalia: f.id_fiscalia, nombre_fiscalia: f.nombre_fiscalia })));
        }
      } catch {}
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
    setLoading(true);
    try {
      const res = await expedienteRepository.create({
        codigo_caso: codigoCaso.trim(),
        nombre_caso: nombreCaso.trim(),
        fecha_inicio: fechaInicio,
        id_fiscalia: Number(idFiscalia),
        descripcion_hechos: descripcionHechos.trim() || undefined,
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
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={700}>
      <Typography variant="h5" mb={3} fontWeight={600}>Registrar Expediente DICRI</Typography>
      <Card sx={{ p:{ xs:3, md:4 }, borderRadius:3 }}>
        <Box component="form" display="flex" flexDirection="column" gap={2} onSubmit={handleSubmit}>
          {error && <Alert severity="error">{error}</Alert>}
            {done && <Alert severity="success">Expediente registrado</Alert>}
          <TextField label="Código Caso" value={codigoCaso} onChange={e=>setCodigoCaso(e.target.value)} required disabled={loading} />
          <TextField label="Nombre Caso" value={nombreCaso} onChange={e=>setNombreCaso(e.target.value)} required disabled={loading} />
          <TextField
            label="Fecha Inicio"
            type="date"
            value={fechaInicio}
            onChange={e=>setFechaInicio(e.target.value)}
            required
            disabled={loading}
            InputLabelProps={{ shrink:true }}
          />
          <TextField
            select
            label="Fiscalía"
            value={idFiscalia}
            onChange={e=>setIdFiscalia(Number(e.target.value))}
            required
            disabled={loading}
          >
            {fiscalias.map(f=> <MenuItem key={f.id_fiscalia} value={f.id_fiscalia}>{f.nombre_fiscalia}</MenuItem>)}
          </TextField>
          <TextField
            label="Descripción Hechos"
            value={descripcionHechos}
            onChange={e=>setDescripcionHechos(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            disabled={loading}
          />
          <TextField
            label="Técnico Registrador"
            value={user?.nombre_usuario || ''}
            disabled
            fullWidth
            helperText="Se asigna automáticamente"
          />
          <Button type="submit" variant="contained" disabled={loading || !codigoCaso.trim() || !nombreCaso.trim() || !fechaInicio || !idFiscalia}>Guardar</Button>
          <Button variant="text" onClick={() => navigate('/dashboard/expedientes')} disabled={loading}>Cancelar</Button>
        </Box>
      </Card>
    </Box>
  );
};