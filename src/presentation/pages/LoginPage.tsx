import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';
import { TextField, Button, Card, Typography, Box, Link, Grid, useTheme, useMediaQuery, Container } from '@mui/material';

export const LoginPage = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, modulos } = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ nombre_usuario: nombreUsuario, clave });
      
      // Verificar si necesita cambiar contraseña
      const userData = modulos.length > 0; // Si hay módulos, el login fue exitoso
      
      // Redirigir según el caso
      if (userData) {
        const hasExpedientes = modulos.some(m => m.ruta === '/expedientes' || m.ruta.includes('/expedientes'));
        navigate(hasExpedientes ? '/dashboard/expedientes' : '/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight:'100vh', display:'flex', alignItems:'center', background:'linear-gradient(135deg, #0d1e33 0%, #1a2f4d 50%, #223b5a 100%)', py:6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs:6, md:8 }} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6} className="login-left" sx={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
            <Box mb={4}>
              <Box className="mp-logo">
                <Box className="mp-text">MP</Box>
                <Box className="mp-icon">⚖️</Box>
              </Box>
              <Typography variant={isMobile ? 'h4' : 'h3'} className="mp-title" fontWeight={300}>MINISTERIO PÚBLICO</Typography>
              <Box className="mp-subtitle" mt={3}>
                <Typography className="servicios" fontWeight={600}>SERVICIOS</Typography>
                <Typography className="administrativos" fontWeight={300}>ADMINISTRATIVOS</Typography>
              </Box>
              <Typography className="mp-slogan" mt={4}>Ministerio Público, fuerte y firme</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} display="flex" justifyContent="center">
            <Card elevation={10} sx={{ width:'100%', maxWidth:480, p: { xs:3.5, md:5 }, borderRadius:4, bgcolor:'#ffffff', boxShadow:'0 12px 38px rgba(0,0,0,0.25)' }}>
              <Box textAlign="center" mb={3}>
                <Typography variant="h5" color="primary" fontWeight={600}>Bienvenido a MP</Typography>
                <Typography variant="body2" color="text.secondary">Ingrese para continuar.</Typography>
              </Box>
              <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2.4}>
                <TextField label="CUI" variant="outlined" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} disabled={isLoading} required fullWidth />
                <TextField label="Contraseña" type="password" variant="outlined" value={clave} onChange={(e) => setClave(e.target.value)} disabled={isLoading} required fullWidth />
                {error && (
                  <Typography variant="body2" color="error" sx={{ bgcolor:'#f8d7da', p:1.5, borderRadius:1 }}>
                    {error}
                  </Typography>
                )}
                <Button type="submit" variant="contained" color="secondary" disabled={isLoading} sx={{ py:1.2, fontWeight:600, letterSpacing:0.5 }}>
                  {isLoading ? 'INGRESANDO...' : 'INGRESAR'}
                </Button>
                <Box display="flex" justifyContent="space-between" fontSize={13} flexWrap="wrap" gap={1}>
                  <Link href="#" underline="hover">¿Olvidé mi contraseña?</Link>
                  <Link href="#" underline="hover">¿Olvidé mi correo registrado?</Link>
                </Box>
                <Box textAlign="center" mt={1} fontSize={13}>
                  <Typography variant="body2">¿No tienes usuario? <Link href="#" underline="hover">Crear usuario</Link></Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
