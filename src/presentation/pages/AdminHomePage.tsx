import { Box, Typography, Card, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const tiles = [
  { title:'Usuarios', hint:'Gestión de usuarios', route:'/dashboard/admin/users' },
  { title:'Roles', hint:'Asignación de roles', route:'/dashboard/admin/roles' },
  { title:'Perfiles', hint:'Perfiles del sistema', route:'/dashboard/admin/perfiles' },
  { title:'Fiscalías', hint:'Catálogo fiscalías', route:'/dashboard/fiscalias' },
  { title:'Tipos de Indicio', hint:'Catálogo tipos', route:'/dashboard/tipos-indicio' },
];

export const AdminHomePage = () => {
  const navigate = useNavigate();
  const { roles } = useAuth();
  const isAdmin = roles.some(r => r.nombre_role === 'ADMIN');

  if (!isAdmin) {
    return (
      <Box>
        <Typography variant="h5" fontWeight={600} mb={2}>Administración</Typography>
        <Card sx={{ p:3, borderRadius:3 }}>
          <Typography variant="body2" color="error">Acceso restringido (requiere rol ADMIN).</Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={2}>Administración</Typography>
      <Grid container spacing={2}>
        {tiles.map(t => (
          <Grid item xs={12} sm={6} md={3} key={t.title}>
            <Card
              sx={{ p:2, borderRadius:2, cursor:'pointer', '&:hover':{ boxShadow:4 } }}
              onClick={() => navigate(t.route)}
              aria-label={t.title}
            >
              <Typography variant="subtitle2" fontWeight={600}>{t.title}</Typography>
              <Typography variant="caption" color="text.secondary">{t.hint}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
