import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" gap={2}>
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">Cargando...</Typography>
      </Box>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
