import { useState, useEffect } from 'react';
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
  Collapse,
  Container,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Group as GroupIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
  Newspaper as NewspaperIcon,
  Info as InfoIcon,
  Business as BusinessIcon,
  ContactPhone as ContactPhoneIcon,
  AccountCircle as AccountCircleIcon,
  LockReset as LockResetIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';

const drawerWidth = 260;

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNoticiasOpen, setIsNoticiasOpen] = useState(false);
  const [isInfoPublicaOpen, setIsInfoPublicaOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Estado inicial: abierto en desktop, cerrado en mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);
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
        isSidebarOpen && (
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
            <Toolbar />
            <Box sx={{ overflow:'auto' }}>
              <List>
                <ListItemButton onClick={() => navigate('/dashboard')}>
                  <ListItemIcon sx={{ color:'inherit' }}><HomeIcon /></ListItemIcon>
                  <ListItemText primary="Inicio" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate('/dashboard/nosotros')}>
                  <ListItemIcon sx={{ color:'inherit' }}><GroupIcon /></ListItemIcon>
                  <ListItemText primary="Nosotros" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate('/dashboard/certificaciones')}>
                  <ListItemIcon sx={{ color:'inherit' }}><DescriptionIcon /></ListItemIcon>
                  <ListItemText primary="Certificaciones" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate('/dashboard/delito-cero')}>
                  <ListItemIcon sx={{ color:'inherit' }}><SecurityIcon /></ListItemIcon>
                  <ListItemText primary="Delito Cero" />
                </ListItemButton>
                <ListItemButton onClick={() => setIsNoticiasOpen(!isNoticiasOpen)}>
                  <ListItemIcon sx={{ color:'inherit' }}><NewspaperIcon /></ListItemIcon>
                  <ListItemText primary="Noticias" />
                  {isNoticiasOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={isNoticiasOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl:6 }} onClick={() => navigate('/dashboard/noticias/mp')}>
                      <ListItemText primary="MP Noticias" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl:6 }} onClick={() => navigate('/dashboard/noticias/news')}>
                      <ListItemText primary="MP News" />
                    </ListItemButton>
                  </List>
                </Collapse>
                <ListItemButton onClick={() => navigate('/dashboard/documentos')}>
                  <ListItemIcon sx={{ color:'inherit' }}><DescriptionIcon /></ListItemIcon>
                  <ListItemText primary="Documentos" />
                </ListItemButton>
                <ListItemButton onClick={() => setIsInfoPublicaOpen(!isInfoPublicaOpen)}>
                  <ListItemIcon sx={{ color:'inherit' }}><InfoIcon /></ListItemIcon>
                  <ListItemText primary="Información Pública" />
                  {isInfoPublicaOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={isInfoPublicaOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl:6 }} onClick={() => navigate('/dashboard/info-publica/transparencia')}>
                      <ListItemText primary="Transparencia" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl:6 }} onClick={() => navigate('/dashboard/info-publica/rendicion')}>
                      <ListItemText primary="Rendición de Cuentas" />
                    </ListItemButton>
                  </List>
                </Collapse>
                <ListItemButton onClick={() => navigate('/dashboard/torre-tres')}>
                  <ListItemIcon sx={{ color:'inherit' }}><BusinessIcon /></ListItemIcon>
                  <ListItemText primary="Torre Tres" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate('/dashboard/contacto')}>
                  <ListItemIcon sx={{ color:'inherit' }}><ContactPhoneIcon /></ListItemIcon>
                  <ListItemText primary="Contacto" />
                </ListItemButton>
                <Box sx={{ my:1, height:1, background:'rgba(255,255,255,0.2)', mx:2 }} />
                <ListItemButton onClick={() => navigate('/dashboard/users')}>
                  <ListItemIcon sx={{ color:'inherit' }}><AccountCircleIcon /></ListItemIcon>
                  <ListItemText primary="Usuarios" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate('/dashboard/change-password')}>
                  <ListItemIcon sx={{ color:'inherit' }}><LockResetIcon /></ListItemIcon>
                  <ListItemText primary="Cambiar Contraseña" />
                </ListItemButton>
              </List>
            </Box>
          </Drawer>
        )
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
          <Toolbar />
          <Box sx={{ overflow:'auto' }}>
            <List>
              <ListItemButton onClick={() => navigate('/dashboard')}>
                <ListItemIcon sx={{ color:'inherit' }}><HomeIcon /></ListItemIcon>
                <ListItemText primary="Inicio" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate('/dashboard/nosotros')}>
                <ListItemIcon sx={{ color:'inherit' }}><GroupIcon /></ListItemIcon>
                <ListItemText primary="Nosotros" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate('/dashboard/certificaciones')}>
                <ListItemIcon sx={{ color:'inherit' }}><DescriptionIcon /></ListItemIcon>
                <ListItemText primary="Certificaciones" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate('/dashboard/delito-cero')}>
                <ListItemIcon sx={{ color:'inherit' }}><SecurityIcon /></ListItemIcon>
                <ListItemText primary="Delito Cero" />
              </ListItemButton>
              <ListItemButton onClick={() => setIsNoticiasOpen(!isNoticiasOpen)}>
                <ListItemIcon sx={{ color:'inherit' }}><NewspaperIcon /></ListItemIcon>
                <ListItemText primary="Noticias" />
                {isNoticiasOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={isNoticiasOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl:6 }} onClick={() => navigate('/dashboard/noticias/mp')}>
                    <ListItemText primary="MP Noticias" />
                  </ListItemButton>
                  <ListItemButton sx={{ pl:6 }} onClick={() => navigate('/dashboard/noticias/news')}>
                    <ListItemText primary="MP News" />
                  </ListItemButton>
                </List>
              </Collapse>
              <ListItemButton onClick={() => navigate('/dashboard/documentos')}>
                <ListItemIcon sx={{ color:'inherit' }}><DescriptionIcon /></ListItemIcon>
                <ListItemText primary="Documentos" />
              </ListItemButton>
              <ListItemButton onClick={() => setIsInfoPublicaOpen(!isInfoPublicaOpen)}>
                <ListItemIcon sx={{ color:'inherit' }}><InfoIcon /></ListItemIcon>
                <ListItemText primary="Información Pública" />
                {isInfoPublicaOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={isInfoPublicaOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl:6 }} onClick={() => navigate('/dashboard/info-publica/transparencia')}>
                    <ListItemText primary="Transparencia" />
                  </ListItemButton>
                  <ListItemButton sx={{ pl:6 }} onClick={() => navigate('/dashboard/info-publica/rendicion')}>
                    <ListItemText primary="Rendición de Cuentas" />
                  </ListItemButton>
                </List>
              </Collapse>
              <ListItemButton onClick={() => navigate('/dashboard/torre-tres')}>
                <ListItemIcon sx={{ color:'inherit' }}><BusinessIcon /></ListItemIcon>
                <ListItemText primary="Torre Tres" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate('/dashboard/contacto')}>
                <ListItemIcon sx={{ color:'inherit' }}><ContactPhoneIcon /></ListItemIcon>
                <ListItemText primary="Contacto" />
              </ListItemButton>
              <Box sx={{ my:1, height:1, background:'rgba(255,255,255,0.2)', mx:2 }} />
              <ListItemButton onClick={() => navigate('/dashboard/users')}>
                <ListItemIcon sx={{ color:'inherit' }}><AccountCircleIcon /></ListItemIcon>
                <ListItemText primary="Usuarios" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate('/dashboard/change-password')}>
                <ListItemIcon sx={{ color:'inherit' }}><LockResetIcon /></ListItemIcon>
                <ListItemText primary="Cambiar Contraseña" />
              </ListItemButton>
            </List>
          </Box>
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
