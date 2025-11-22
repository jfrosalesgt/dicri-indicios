import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button as MUIButton, Chip, Paper } from '@mui/material';
import type { User } from '../../domain/entities/User';
import { userRepository } from '../../infrastructure/repositories/UserRepository';
import './UsersPage.css';

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userRepository.getUsers();
      
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.message || 'Error al cargar usuarios');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewUser = (userId: number) => {
    navigate(`/dashboard/users/${userId}`);
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py:4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300} flexDirection="column" gap={2}>
          <div className="spinner"></div>
          <Typography variant="body1">Cargando usuarios...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py:4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h5" className="page-title">Gestión de Usuarios</Typography>
        <MUIButton variant="contained" color="primary" onClick={() => navigate('/dashboard/users/new')}>+ Crear Usuario</MUIButton>
      </Box>
      {error && (
        <Paper elevation={1} sx={{ p:2, mb:3, bgcolor:'#fdecea', color:'#611a15' }}>
          {error}
        </Paper>
      )}
      <Paper elevation={2} sx={{ p:2, overflowX:'auto' }}>
        <table className="users-table" style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Último Acceso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign:'center', padding:'16px' }}>No hay usuarios registrados</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id_usuario}>
                  <td>{user.id_usuario}</td>
                  <td><strong>{user.nombre_usuario}</strong></td>
                  <td>{user.nombre} {user.apellido}</td>
                  <td style={{ wordBreak:'break-word' }}>{user.email}</td>
                  <td>
                    <Chip size="small" label={user.activo ? 'Activo' : 'Inactivo'} color={user.activo ? 'success' : 'default'} />
                  </td>
                  <td>{user.fecha_ultimo_acceso ? new Date(user.fecha_ultimo_acceso).toLocaleString('es-GT') : 'Nunca'}</td>
                  <td>
                    <MUIButton size="small" variant="outlined" onClick={() => handleViewUser(user.id_usuario)}>Ver</MUIButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Paper>
    </Container>
  );
};
