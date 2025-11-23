import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth(); // ✅ Usar isLoading de AuthContext

  // ✅ Mostrar loader mientras Redux Persist rehidrata
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" flexDirection="column" gap={2}>
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">Cargando sesión...</Typography>
      </Box>
    );
  }

  // ✅ Si no está autenticado después de cargar, redirigir
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
