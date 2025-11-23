import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './presentation/context/AuthContext';
import { ProtectedRoute } from './presentation/routes/ProtectedRoute';
import { LoginPage } from './presentation/pages/LoginPage';
import { DashboardLayout } from './presentation/layouts/DashboardLayout';
import { DashboardHome } from './presentation/pages/DashboardHome';
import { ChangePasswordPage } from './presentation/pages/ChangePasswordPage';
import { Box, Typography } from '@mui/material';
import './App.css';
import { ExpedientesListPage } from './presentation/pages/ExpedientesListPage';
import { ExpedienteCreatePage } from './presentation/pages/ExpedienteCreatePage';
import { ExpedienteDetailPage } from './presentation/pages/ExpedienteDetailPage';
import { ExpedienteEditPage } from './presentation/pages/ExpedienteEditPage';
import { FiscaliasListPage } from './presentation/pages/FiscaliasListPage';
import { FiscaliaDetailPage } from './presentation/pages/FiscaliaDetailPage';
import { FiscaliaCreatePage } from './presentation/pages/FiscaliaCreatePage';
import { TiposIndicioListPage } from './presentation/pages/TiposIndicioListPage';
import { TipoIndicioDetailPage } from './presentation/pages/TipoIndicioDetailPage';
import { TipoIndicioCreatePage } from './presentation/pages/TipoIndicioCreatePage';
import { RevisionExpedientesPage } from './presentation/pages/RevisionExpedientesPage';
import { RevisionExpedienteDetailPage } from './presentation/pages/RevisionExpedienteDetailPage';
import { ReportesPage } from './presentation/pages/ReportesPage';
import { AdminRoute } from './presentation/routes/AdminRoute';
import { AdminHomePage } from './presentation/pages/AdminHomePage';
import { RolesListPage } from './presentation/pages/RolesListPage';
import { PerfilesListPage } from './presentation/pages/PerfilesListPage';
import { EscenasListPage } from './presentation/pages/EscenasListPage';
import { IndiciosListPage } from './presentation/pages/IndiciosListPage';
import { IndiciosExpedientePage } from './presentation/pages/IndiciosExpedientePage';
import { IndicioCreatePage } from './presentation/pages/IndicioCreatePage';
import { IndicioEditPage } from './presentation/pages/IndicioEditPage';
import { ScenesExpedientePage } from './presentation/pages/ScenesExpedientePage';
import { SceneCreatePage } from './presentation/pages/SceneCreatePage';
import { SceneEditPage } from './presentation/pages/SceneEditPage';
import { SceneIndiciosPage } from './presentation/pages/SceneIndiciosPage';

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
              <Route path="expedientes">
                <Route index element={<ExpedientesListPage />} />
                <Route path="new" element={<ExpedienteCreatePage />} />
                <Route path=":id" element={<ExpedienteDetailPage />} />
                <Route path=":id/edit" element={<ExpedienteEditPage />} />
                <Route path=":id/escenas">
                  <Route index element={<ScenesExpedientePage />} />
                  <Route path="new" element={<SceneCreatePage />} />
                  <Route path=":escenaId/edit" element={<SceneEditPage />} />
                  <Route path=":escenaId/indicios" element={<SceneIndiciosPage />} />
                  <Route path=":escenaId/indicios/new" element={<IndicioCreatePage />} /> {/* nuevo: crear indicio desde escena */}
                </Route>
                <Route path=":id/indicios">
                  {/* Indicios por expediente ya existentes */}
                  <Route index element={<IndiciosExpedientePage />} />
                  <Route path="new" element={<IndicioCreatePage />} />
                  <Route path=":indicioId/edit" element={<IndicioEditPage />} />
                </Route>
              </Route>
              <Route path="fiscalias">
                <Route index element={<FiscaliasListPage />} />
                <Route path="new" element={<FiscaliaCreatePage />} />
                <Route path=":id" element={<FiscaliaDetailPage />} />
              </Route>
              <Route path="tipos-indicio">
                <Route index element={<TiposIndicioListPage />} />
                <Route path="new" element={<TipoIndicioCreatePage />} />
                <Route path=":id" element={<TipoIndicioDetailPage />} />
              </Route>
              {/* Investigaciones */}
              <Route path="investigaciones" element={<PlaceholderPage title="Investigaciones (Implementar vistas similares)" />} />
              {/* Indicios */}
              <Route path="indicios" element={<PlaceholderPage title="Indicios (Implementar vistas similares)" />} />
              <Route path="revision">
                <Route index element={<RevisionExpedientesPage />} />
                <Route path=":id" element={<RevisionExpedienteDetailPage />} />
              </Route>
              <Route path="reportes" element={<ReportesPage />} />
              <Route path="admin" element={<AdminRoute />}>
                <Route index element={<AdminHomePage />} />
                <Route path="roles" element={<RolesListPage />} />
                <Route path="perfiles" element={<PerfilesListPage />} />
                <Route path="escenas" element={<EscenasListPage />} />
                <Route path="indicios" element={<IndiciosListPage />} />
              </Route>
              
              <Route path="change-password" element={<ChangePasswordPage />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/expedientes/*" element={<Navigate to="/dashboard/expedientes" replace />} />
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
