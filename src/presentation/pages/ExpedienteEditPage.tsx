import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { MenuItem, TextField, Button, Alert, Card, Box, Typography, Grid } from '@mui/material';
import { expedienteRepository } from '../../infrastructure/repositories/ExpedienteRepository';
import { fiscaliaRepository } from '../../infrastructure/repositories/FiscaliaRepository';
import type { EstadoRevisionDicri, Expediente } from '../../domain/entities/Expediente';

const estados: EstadoRevisionDicri[] = ['EN_REGISTRO','PENDIENTE_REVISION','APROBADO','RECHAZADO'];

interface FormData {
  nombreCaso: string;
  fechaInicio: string;
  idFiscalia: number | '';
  descripcionHechos: string;
  activo: boolean;
}

export const ExpedienteEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [expediente, setExpediente] = useState<Expediente | null>(null);
  const [fiscalias, setFiscalias] = useState<{id_fiscalia:number; nombre_fiscalia:string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  // ✅ React Hook Form
  const { control, handleSubmit, formState: { errors, isValid }, setValue } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      nombreCaso: '',
      fechaInicio: '',
      idFiscalia: '',
      descripcionHechos: '',
      activo: true,
    },
  });

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true); 
      setError('');
      try {
        const res = await expedienteRepository.getById(Number(id));
        if (res.success && res.data) {
          setExpediente(res.data);
          // ✅ Cargar valores en el formulario
          setValue('nombreCaso', res.data.nombre_caso);
          setValue('fechaInicio', res.data.fecha_inicio.slice(0,10));
          setValue('idFiscalia', res.data.id_fiscalia);
          setValue('descripcionHechos', res.data.descripcion_hechos || '');
          setValue('activo', res.data.activo);
        } else {
          setError(res.message || 'No encontrado');
        }
      } catch(e:any){ 
        setError(e.message || 'Error al cargar'); 
      } finally { 
        setLoading(false); 
      }
    };
    load();

    // Cargar fiscalías
    fiscaliaRepository.getAll({ activo:true }).then(r=>{
      if (r.success && r.data) {
        setFiscalias(r.data.map(f=>({
          id_fiscalia:f.id_fiscalia,
          nombre_fiscalia:f.nombre_fiscalia
        })));
      }
    }).catch(()=>{});
  }, [id, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!expediente) return;
    setSaving(true); 
    setError(''); 
    setDone(false);

    try {
      const res = await expedienteRepository.update(expediente.id_investigacion, {
        nombre_caso: data.nombreCaso.trim(),
        fecha_inicio: data.fechaInicio,
        id_fiscalia: Number(data.idFiscalia),
        descripcion_hechos: data.descripcionHechos.trim() || undefined,
        estado_revision_dicri: expediente.estado_revision_dicri, // ✅ Mantener el estado actual
        activo: data.activo,
      });

      if (!res.success) throw new Error(res.message || 'Error al actualizar');
      
      setDone(true);
      navigate(`/dashboard/expedientes/${expediente.id_investigacion}`);
    } catch(e:any){ 
      setError(e.message || 'Error al actualizar'); 
    } finally { 
      setSaving(false); 
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  
  if (error && !expediente) return (
    <Box>
      <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>
      <Button variant="outlined" onClick={() => navigate('/dashboard/expedientes')}>Volver</Button>
    </Box>
  );

  if (!expediente) return null;

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Button variant="outlined" onClick={() => navigate('/dashboard/expedientes')}>
          ← Volver
        </Button>
        <Typography variant="h5" fontWeight={600}>Editar Expediente</Typography>
        <Box width={80} />
      </Box>

      <Card sx={{ p:3, borderRadius:3, width:'100%', boxSizing:'border-box' }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={3}>
          {/* Alertas */}
          {error && <Alert severity="error">{error}</Alert>}
          {done && <Alert severity="success">Expediente actualizado</Alert>}

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField 
                label="Código Caso" 
                value={expediente.codigo_caso} 
                disabled 
                fullWidth 
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="nombreCaso"
                control={control}
                rules={{ 
                  required: 'Nombre es requerido',
                  minLength: { value: 5, message: 'Mínimo 5 caracteres' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre Caso"
                    error={!!errors.nombreCaso}
                    helperText={errors.nombreCaso?.message}
                    disabled={saving}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="fechaInicio"
                control={control}
                rules={{ required: 'Fecha es requerida' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fecha Inicio"
                    type="date"
                    error={!!errors.fechaInicio}
                    helperText={errors.fechaInicio?.message}
                    disabled={saving}
                    InputLabelProps={{ shrink:true }}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="idFiscalia"
                control={control}
                rules={{ required: 'Fiscalía es requerida' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Fiscalía"
                    error={!!errors.idFiscalia}
                    helperText={errors.idFiscalia?.message}
                    disabled={saving}
                    fullWidth
                  >
                    {fiscalias.map(f=> (
                      <MenuItem key={f.id_fiscalia} value={f.id_fiscalia}>
                        {f.nombre_fiscalia}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Estado Revisión"
                value={expediente.estado_revision_dicri}
                disabled
                helperText="Estado bloqueado (flujo controlado por revisión)"
                fullWidth
              >
                {estados.map(es=> (
                  <MenuItem key={es} value={es}>{es}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="activo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Activo"
                    value={field.value ? 'true' : 'false'}
                    onChange={(e) => field.onChange(e.target.value === 'true')}
                    disabled={saving}
                    fullWidth
                  >
                    <MenuItem value="true">Activo</MenuItem>
                    <MenuItem value="false">Inactivo</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="descripcionHechos"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descripción Hechos"
                    multiline
                    minRows={3}
                    disabled={saving}
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Botones */}
          <Box display="flex" gap={2} flexWrap="wrap" justifyContent="flex-start">
            <Button 
              type="submit" 
              variant="contained" 
              disabled={saving || !isValid}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>

            <Button 
              variant="text" 
              onClick={() => navigate(`/dashboard/expedientes/${expediente.id_investigacion}`)} 
              disabled={saving}
            >
              Cancelar
            </Button>

            {expediente.estado_revision_dicri === 'EN_REGISTRO' && (
              <>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate(`/dashboard/expedientes/${expediente.id_investigacion}/escenas`)} 
                  disabled={saving}
                >
                  Ver Escenas
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate(`/dashboard/expedientes/${expediente.id_investigacion}/indicios`)} 
                  disabled={saving}
                >
                  Ver Indicios
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
