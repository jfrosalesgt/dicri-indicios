import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAppSelector } from '../../store/store';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const reduxAuth = useAppSelector(s => s.auth.isAuthenticated);
  const reduxLoading = useAppSelector(s => s.auth.isLoading);

  // ✅ Usar el estado de Redux directamente (más rápido)
  const actuallyAuthenticated = reduxAuth || isAuthenticated;
  const actuallyLoading = reduxLoading || isLoading;

  // ✅ Solo mostrar loading si realmente está cargando
  if (actuallyLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" gap={2}>
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">Verificando sesión...</Typography>
      </Box>
    );
  }

  return actuallyAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
