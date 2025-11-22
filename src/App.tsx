import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './presentation/context/AuthContext';
import { ProtectedRoute } from './presentation/routes/ProtectedRoute';
import { LoginPage } from './presentation/pages/LoginPage';
import { DashboardLayout } from './presentation/layouts/DashboardLayout';
import { DashboardHome } from './presentation/pages/DashboardHome';
import { ChangePasswordPage } from './presentation/pages/ChangePasswordPage';
import { Box, Typography } from '@mui/material';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              
              {/* Rutas del sistema DICRI */}
              <Route path="expedientes" element={<PlaceholderPage title="Gestión de Expedientes" />} />
              <Route path="revision" element={<PlaceholderPage title="Revisión de Expedientes" />} />
              <Route path="reportes" element={<PlaceholderPage title="Informes y Estadísticas" />} />
              <Route path="admin/*" element={<PlaceholderPage title="Administración" />} />
              
              <Route path="change-password" element={<ChangePasswordPage />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

const PlaceholderPage = ({ title }: { title: string }) => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={400} bgcolor="white" borderRadius={3} p={5} boxShadow={3}>
    <Typography variant="h4" color="primary" mb={2}>{title}</Typography>
    <Typography variant="body1" color="text.secondary">Esta página estará disponible próximamente.</Typography>
  </Box>
);

export default App;
