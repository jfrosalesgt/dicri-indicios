import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Paper, Chip, Button as MUIButton, Grid } from '@mui/material';
import type { User } from '../../domain/entities/User';
import { userRepository } from '../../infrastructure/repositories/UserRepository';
import './UserDetailPage.css';

export const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await userRepository.getUserById(parseInt(id, 10));
        
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          setError(response.message || 'Error al cargar usuario');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar usuario');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py:4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300} flexDirection="column" gap={2}>
          <div className="spinner"></div>
          <Typography>Cargando detalles del usuario...</Typography>
        </Box>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container maxWidth="lg" sx={{ py:4 }}>
        <Paper elevation={1} sx={{ p:2, mb:3, bgcolor:'#fdecea', color:'#611a15' }}>
          {error || 'Usuario no encontrado'}
        </Paper>
        <MUIButton variant="outlined" onClick={() => navigate('/dashboard/users')}>← Volver a Usuarios</MUIButton>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py:4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <MUIButton variant="outlined" onClick={() => navigate('/dashboard/users')}>← Volver</MUIButton>
        <Typography variant="h5">Detalles del Usuario</Typography>
      </Box>
      <Paper elevation={3} sx={{ p:{ xs:2, md:4 } }}>
        <Box display="flex" alignItems="center" gap={3} mb={4} flexWrap="wrap">
          <Box className="user-avatar" sx={{ width:72, height:72, borderRadius:'50%', bgcolor:'#1a2b4a', color:'#fff', fontSize:26, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {user.nombre.charAt(0)}{user.apellido.charAt(0)}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600}>{user.nombre} {user.apellido}</Typography>
            <Typography variant="body2" color="text.secondary">@{user.nombre_usuario}</Typography>
            <Chip size="small" label={user.activo ? 'Activo' : 'Inactivo'} color={user.activo ? 'success' : 'default'} sx={{ mt:1 }} />
          </Box>
        </Box>
        <Grid container spacing={2}>
          {[{ label:'ID de Usuario', value:user.id_usuario },
            { label:'Nombre de Usuario', value:user.nombre_usuario },
            { label:'Nombre', value:user.nombre },
            { label:'Apellido', value:user.apellido },
            { label:'Email', value:user.email },
            { label:'Estado', value:user.activo ? 'Activo' : 'Inactivo' },
            { label:'Cambiar Contraseña', value:user.cambiar_clave ? 'Sí' : 'No' },
            { label:'Intentos Fallidos', value:user.intentos_fallidos },
            { label:'Último Acceso', value: user.fecha_ultimo_acceso ? new Date(user.fecha_ultimo_acceso).toLocaleString('es-GT') : 'Nunca' },
            { label:'Creado Por', value:user.usuario_creacion },
            { label:'Fecha de Creación', value:new Date(user.fecha_creacion).toLocaleString('es-GT') },
            { label:'Actualizado Por', value:user.usuario_actualizacion || 'N/A' },
            { label:'Fecha de Actualización', value:user.fecha_actualizacion ? new Date(user.fecha_actualizacion).toLocaleString('es-GT') : 'N/A', full:true },
          ].map(item => (
            <Grid item xs={12} sm={6} md={item.full ? 12 : 4} key={item.label}>
              <Box sx={{ bgcolor:'#f5f7fa', borderRadius:2, p:2 }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary">{item.label}</Typography>
                <Typography variant="body2" sx={{ mt:0.5, wordBreak:'break-word' }}>{item.value as any}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box display="flex" gap={2} mt={4} flexWrap="wrap">
          <MUIButton variant="contained" color="primary">✏️ Editar Usuario</MUIButton>
          <MUIButton variant="outlined" color="error">🗑️ Eliminar Usuario</MUIButton>
        </Box>
      </Paper>
    </Container>
  );
};
