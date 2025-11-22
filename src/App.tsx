import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './presentation/context/AuthContext';
import { ProtectedRoute } from './presentation/routes/ProtectedRoute';
import { LoginPage } from './presentation/pages/LoginPage';
import { DashboardLayout } from './presentation/layouts/DashboardLayout';
import { DashboardHome } from './presentation/pages/DashboardHome';
import { UsersPage } from './presentation/pages/UsersPage';
import { ChangePasswordPage } from './presentation/pages/ChangePasswordPage';
import { UserDetailPage } from './presentation/pages/UserDetailPage';
import { Box, Typography } from '@mui/material';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/:id" element={<UserDetailPage />} />
              
              {/* Placeholder routes */}
              <Route path="nosotros" element={<PlaceholderPage title="Nosotros" />} />
              <Route path="certificaciones" element={<PlaceholderPage title="Certificaciones" />} />
              <Route path="delito-cero" element={<PlaceholderPage title="Delito Cero" />} />
              <Route path="noticias/mp" element={<PlaceholderPage title="MP Noticias" />} />
              <Route path="noticias/news" element={<PlaceholderPage title="MP News" />} />
              <Route path="documentos" element={<PlaceholderPage title="Documentos" />} />
              <Route path="info-publica/transparencia" element={<PlaceholderPage title="Transparencia" />} />
              <Route path="info-publica/rendicion" element={<PlaceholderPage title="Rendición de Cuentas" />} />
              <Route path="torre-tres" element={<PlaceholderPage title="Torre Tres" />} />
              <Route path="contacto" element={<PlaceholderPage title="Contacto" />} />
              <Route path="change-password" element={<ChangePasswordPage />} />
            </Route>
          </Route>

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

// Placeholder component for unimplemented pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={400} bgcolor="white" borderRadius={3} p={5} boxShadow={3}>
    <Typography variant="h4" color="primary" mb={2}>{title}</Typography>
    <Typography variant="body1" color="text.secondary">Esta página estará disponible próximamente.</Typography>
  </Box>
);

export default App;
