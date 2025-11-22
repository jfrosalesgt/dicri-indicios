import { useState, useEffect, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  Container,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  LockReset as LockResetIcon,
} from '@mui/icons-material';
import { getIconComponent } from '../utils/iconMapper';
import type { Module } from '../../domain/entities/Module';

const drawerWidth = 260;

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user, logout, modulos } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Ordenar y filtrar módulos activos, eliminando duplicados
  const sortedModulos = useMemo(() => {
    // Eliminar duplicados por ruta
    const uniqueModulos = modulos.reduce((acc, modulo) => {
      if (!acc.find(m => m.ruta === modulo.ruta && m.nombre_modulo === modulo.nombre_modulo)) {
        acc.push(modulo);
      }
      return acc;
    }, [] as Module[]);

    return uniqueModulos
      .filter(m => m.activo && m.id_modulo_padre === null)
      .sort((a, b) => a.orden - b.orden);
  }, [modulos]);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const renderMenuItem = (modulo: Module) => {
    const IconComponent = getIconComponent(modulo.icono);
    const resolveRoute = (ruta: string) => {
      if (ruta.startsWith('/dashboard')) return ruta;
      if (ruta.startsWith('/')) return `/dashboard${ruta}`;
      return `/dashboard/${ruta}`;
    };
    return (
      <ListItemButton
        key={modulo.id_modulo}
        onClick={() => {
          navigate(resolveRoute(modulo.ruta));
          if (isMobile) setIsSidebarOpen(false);
        }}
      >
        <ListItemIcon sx={{ color: 'inherit' }}>
          <IconComponent />
        </ListItemIcon>
        <ListItemText primary={modulo.nombre_modulo} />
      </ListItemButton>
    );
  };

  const drawerContent = (
    <>
      <Toolbar />
      <Box sx={{ overflow:'auto' }}>
        <List>
          {sortedModulos.map(modulo => renderMenuItem(modulo))}
          
          <Divider sx={{ my:1, background:'rgba(255,255,255,0.2)', mx:2 }} />
          
          <ListItemButton onClick={() => {
            navigate('/dashboard/change-password');
            if (isMobile) setIsSidebarOpen(false);
          }}>
            <ListItemIcon sx={{ color:'inherit' }}>
              <LockResetIcon />
            </ListItemIcon>
            <ListItemText primary="Cambiar Contraseña" />
          </ListItemButton>
        </List>
      </Box>
    </>
  );

  return (
    <Box display="flex" height="100vh" overflow="hidden">
      <AppBar
        position="fixed"
        sx={(theme) => ({
          background: 'linear-gradient(135deg, #1a2b4a 0%, #2c4875 100%)',
          zIndex: theme.zIndex.appBar + 1,
          pl: !isMobile && isSidebarOpen ? `${drawerWidth}px` : 0,
          transition: theme.transitions.create(['padding-left'], { duration: theme.transitions.duration.shortest }),
        })}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleSidebar} sx={{ mr:2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mr:2 }}>MP</Typography>
          <Typography variant="subtitle2" sx={{ flexGrow:1, letterSpacing:1 }}>MINISTERIO PÚBLICO</Typography>
          <Typography variant="body2" sx={{ fontStyle:'italic', mr:3, display:{ xs:'none', md:'block'} }}>Ministerio Público, fuerte y firme</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <AccountCircleIcon />
            <Typography variant="body2">{user?.nombre} {user?.apellido}</Typography>
            <Button color="inherit" variant="outlined" onClick={handleLogout} size="small">Cerrar Sesión</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              background: 'linear-gradient(180deg, #1a2b4a 0%, #2c4875 100%)',
              color: '#fff',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="persistent"
          open={isSidebarOpen}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              background: 'linear-gradient(180deg, #1a2b4a 0%, #2c4875 100%)',
              color: '#fff',
              position: 'fixed',
              left: 0,
              top: 0,
              height: '100vh',
              borderRight: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
      
      <Box
        component="main"
        flexGrow={1}
        bgcolor="#f5f7fa"
        overflow="auto"
        sx={(theme) => ({
          p: { xs:2, md:4 },
          width: '100%',
          ml: !isMobile && isSidebarOpen ? `${drawerWidth}px` : 0,
          transition: theme.transitions.create(['margin-left','padding'], { duration: theme.transitions.duration.shortest }),
        })}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ pb:4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};
