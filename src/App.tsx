import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './presentation/context/AuthContext';
import { ProtectedRoute } from './presentation/routes/ProtectedRoute';
import { ErrorBoundary } from './presentation/components/ErrorBoundary';
import { Box, CircularProgress, Typography } from '@mui/material';
import './App.css';

import { LoginPage } from './presentation/pages/LoginPage';
import { DashboardLayout } from './presentation/layouts/DashboardLayout';

const DashboardHome = lazy(() => import('./presentation/pages/DashboardHome').then(m => ({ default: m.DashboardHome })));
const ChangePasswordPage = lazy(() => import('./presentation/pages/ChangePasswordPage').then(m => ({ default: m.ChangePasswordPage })));
const ExpedientesListPage = lazy(() => import('./presentation/pages/ExpedientesListPage').then(m => ({ default: m.ExpedientesListPage })));
const ExpedienteCreatePage = lazy(() => import('./presentation/pages/ExpedienteCreatePage').then(m => ({ default: m.ExpedienteCreatePage })));
const ExpedienteDetailPage = lazy(() => import('./presentation/pages/ExpedienteDetailPage').then(m => ({ default: m.ExpedienteDetailPage })));
const ExpedienteEditPage = lazy(() => import('./presentation/pages/ExpedienteEditPage').then(m => ({ default: m.ExpedienteEditPage })));
const FiscaliasListPage = lazy(() => import('./presentation/pages/FiscaliasListPage').then(m => ({ default: m.FiscaliasListPage })));
const FiscaliaDetailPage = lazy(() => import('./presentation/pages/FiscaliaDetailPage').then(m => ({ default: m.FiscaliaDetailPage })));
const FiscaliaCreatePage = lazy(() => import('./presentation/pages/FiscaliaCreatePage').then(m => ({ default: m.FiscaliaCreatePage })));
const TiposIndicioListPage = lazy(() => import('./presentation/pages/TiposIndicioListPage').then(m => ({ default: m.TiposIndicioListPage })));
const TipoIndicioDetailPage = lazy(() => import('./presentation/pages/TipoIndicioDetailPage').then(m => ({ default: m.TipoIndicioDetailPage })));
const TipoIndicioCreatePage = lazy(() => import('./presentation/pages/TipoIndicioCreatePage').then(m => ({ default: m.TipoIndicioCreatePage })));
const RevisionExpedientesPage = lazy(() => import('./presentation/pages/RevisionExpedientesPage').then(m => ({ default: m.RevisionExpedientesPage })));
const RevisionExpedienteDetailPage = lazy(() => import('./presentation/pages/RevisionExpedienteDetailPage').then(m => ({ default: m.RevisionExpedienteDetailPage })));
const ReportesPage = lazy(() => import('./presentation/pages/ReportesPage').then(m => ({ default: m.ReportesPage })));
const AdminRoute = lazy(() => import('./presentation/routes/AdminRoute').then(m => ({ default: m.AdminRoute })));
const AdminHomePage = lazy(() => import('./presentation/pages/AdminHomePage').then(m => ({ default: m.AdminHomePage })));
const RolesListPage = lazy(() => import('./presentation/pages/RolesListPage').then(m => ({ default: m.RolesListPage })));
const PerfilesListPage = lazy(() => import('./presentation/pages/PerfilesListPage').then(m => ({ default: m.PerfilesListPage })));
const IndiciosListPage = lazy(() => import('./presentation/pages/IndiciosListPage').then(m => ({ default: m.IndiciosListPage })));
const IndiciosExpedientePage = lazy(() => import('./presentation/pages/IndiciosExpedientePage').then(m => ({ default: m.IndiciosExpedientePage })));
const IndicioCreatePage = lazy(() => import('./presentation/pages/IndicioCreatePage').then(m => ({ default: m.IndicioCreatePage })));
const IndicioEditPage = lazy(() => import('./presentation/pages/IndicioEditPage').then(m => ({ default: m.IndicioEditPage })));
const ScenesExpedientePage = lazy(() => import('./presentation/pages/ScenesExpedientePage').then(m => ({ default: m.ScenesExpedientePage })));
const SceneCreatePage = lazy(() => import('./presentation/pages/SceneCreatePage').then(m => ({ default: m.SceneCreatePage })));
const SceneEditPage = lazy(() => import('./presentation/pages/SceneEditPage').then(m => ({ default: m.SceneEditPage })));
const SceneIndiciosPage = lazy(() => import('./presentation/pages/SceneIndiciosPage').then(m => ({ default: m.SceneIndiciosPage })));

const PageLoader = () => (
  <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px" gap={2}>
    <CircularProgress size={40} />
    <Typography variant="body2" color="text.secondary">Cargando...</Typography>
  </Box>
);

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={
                  <Suspense fallback={<PageLoader />}>
                    <DashboardHome />
                  </Suspense>
                } />
                
                {/* Rutas del sistema DICRI */}
                <Route path="expedientes">
                  <Route index element={<Suspense fallback={<PageLoader />}><ExpedientesListPage /></Suspense>} />
                  <Route path="new" element={<Suspense fallback={<PageLoader />}><ExpedienteCreatePage /></Suspense>} />
                  <Route path=":id" element={<Suspense fallback={<PageLoader />}><ExpedienteDetailPage /></Suspense>} />
                  <Route path=":id/edit" element={<Suspense fallback={<PageLoader />}><ExpedienteEditPage /></Suspense>} />
                  <Route path=":id/escenas">
                    <Route index element={<Suspense fallback={<PageLoader />}><ScenesExpedientePage /></Suspense>} />
                    <Route path="new" element={<Suspense fallback={<PageLoader />}><SceneCreatePage /></Suspense>} />
                    <Route path=":escenaId/edit" element={<Suspense fallback={<PageLoader />}><SceneEditPage /></Suspense>} />
                    <Route path=":escenaId/indicios" element={<Suspense fallback={<PageLoader />}><SceneIndiciosPage /></Suspense>} />
                    <Route path=":escenaId/indicios/new" element={<Suspense fallback={<PageLoader />}><IndicioCreatePage /></Suspense>} />
                  </Route>
                  <Route path=":id/indicios">
                    <Route index element={<Suspense fallback={<PageLoader />}><IndiciosExpedientePage /></Suspense>} />
                    <Route path="new" element={<Suspense fallback={<PageLoader />}><IndicioCreatePage /></Suspense>} />
                    <Route path=":indicioId/edit" element={<Suspense fallback={<PageLoader />}><IndicioEditPage /></Suspense>} />
                  </Route>
                </Route>
                <Route path="fiscalias">
                  <Route index element={<Suspense fallback={<PageLoader />}><FiscaliasListPage /></Suspense>} />
                  <Route path="new" element={<Suspense fallback={<PageLoader />}><FiscaliaCreatePage /></Suspense>} />
                  <Route path=":id" element={<Suspense fallback={<PageLoader />}><FiscaliaDetailPage /></Suspense>} />
                </Route>
                <Route path="tipos-indicio">
                  <Route index element={<Suspense fallback={<PageLoader />}><TiposIndicioListPage /></Suspense>} />
                  <Route path="new" element={<Suspense fallback={<PageLoader />}><TipoIndicioCreatePage /></Suspense>} />
                  <Route path=":id" element={<Suspense fallback={<PageLoader />}><TipoIndicioDetailPage /></Suspense>} />
                </Route>
                <Route path="revision">
                  <Route index element={<Suspense fallback={<PageLoader />}><RevisionExpedientesPage /></Suspense>} />
                  <Route path=":id" element={<Suspense fallback={<PageLoader />}><RevisionExpedienteDetailPage /></Suspense>} />
                </Route>
                <Route path="reportes" element={<Suspense fallback={<PageLoader />}><ReportesPage /></Suspense>} />
                <Route path="admin" element={<Suspense fallback={<PageLoader />}><AdminRoute /></Suspense>}>
                  <Route index element={<Suspense fallback={<PageLoader />}><AdminHomePage /></Suspense>} />
                  <Route path="roles" element={<Suspense fallback={<PageLoader />}><RolesListPage /></Suspense>} />
                  <Route path="perfiles" element={<Suspense fallback={<PageLoader />}><PerfilesListPage /></Suspense>} />
                  <Route path="indicios" element={<Suspense fallback={<PageLoader />}><IndiciosListPage /></Suspense>} />
                </Route>
                
                <Route path="change-password" element={<Suspense fallback={<PageLoader />}><ChangePasswordPage /></Suspense>} />
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/expedientes/*" element={<Navigate to="/dashboard/expedientes" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;