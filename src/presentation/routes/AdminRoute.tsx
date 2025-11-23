import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

export const AdminRoute = () => {
  const { isLoading, roles } = useAuth();
  const isAdmin = roles.some(r => r.nombre_role === 'ADMIN');

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh" flexDirection="column" gap={2}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">Cargando...</Typography>
      </Box>
    );
  }

  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
};
