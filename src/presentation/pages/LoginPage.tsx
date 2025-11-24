import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';
import { TextField, Button, Card, Typography, Box, Link, Grid, useTheme, useMediaQuery, Container, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined, PersonOutline } from '@mui/icons-material';
import { useState } from 'react';

interface LoginFormData {
  nombreUsuario: string;
  clave: string;
}

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, modulos } = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormData>({
    mode: 'onChange',
    defaultValues: {
      nombreUsuario: '',
      clave: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (isLoading) return;
    
    setError('');
    setIsLoading(true);
    
    try {
      await login({ 
        nombre_usuario: data.nombreUsuario, 
        clave: data.clave 
      });
      
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const hasExpedientes = modulos.some(m => 
        m.ruta === '/expedientes' || 
        m.ruta === '/dashboard/expedientes' || 
        m.ruta.includes('/expedientes')
      );
      
      navigate(hasExpedientes ? '/dashboard/expedientes' : '/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0a1929 0%, #1a2f4d 50%, #2a4470 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(74, 159, 216, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(211, 177, 107, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
        py: { xs: 4, md: 6 }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center" justifyContent="center">
          {/* Left Side - Branding */}
          <Grid 
            item 
            xs={12} 
            md={6} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Box mb={4}>
              <Box 
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: 2, md: 3 },
                  mb: 2,
                }}
              >
                <Typography 
                  sx={{ 
                    fontSize: { xs: '4rem', md: '6rem', lg: '7rem' },
                    fontWeight: 700,
                    color: '#d3b16b',
                    textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                    letterSpacing: '-4px',
                    lineHeight: 1,
                  }}
                >
                  MP
                </Typography>
                <Typography sx={{ fontSize: { xs: '3rem', md: '4.5rem', lg: '5.5rem' } }}>
                  ⚖️
                </Typography>
              </Box>
              
              <Typography 
                variant={isMobile ? 'h4' : 'h3'} 
                sx={{ 
                  color: '#fff',
                  fontWeight: 300,
                  letterSpacing: 2,
                  mb: 3,
                  borderTop: '2px solid #4a9fd8',
                  borderBottom: '2px solid #4a9fd8',
                  py: 1,
                }}
              >
                MINISTERIO PÚBLICO
              </Typography>
              
              <Box 
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  px: { xs: 3, md: 4 },
                  py: 2,
                  borderRadius: 2,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Typography 
                  sx={{ 
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontWeight: 700,
                    color: '#1a2b4a',
                    letterSpacing: 2,
                  }}
                >
                  SERVICIOS
                </Typography>
                <Typography 
                  sx={{ 
                    fontSize: { xs: '1rem', md: '1.25rem' },
                    color: '#1a2b4a',
                    letterSpacing: 1.5,
                    fontWeight: 300,
                  }}
                >
                  ADMINISTRATIVOS
                </Typography>
              </Box>
              
              <Typography 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  fontStyle: 'italic',
                  mt: 4,
                }}
              >
                Ministerio Público, fuerte y firme
              </Typography>
            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6} display="flex" justifyContent="center">
            <Card 
              elevation={24}
              sx={{ 
                width: '100%', 
                maxWidth: 480, 
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                bgcolor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Box textAlign="center" mb={4}>
                <Box 
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1a2b4a 0%, #2c4875 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    boxShadow: '0 8px 24px rgba(26, 43, 74, 0.3)',
                  }}
                >
                  <LockOutlined sx={{ fontSize: 40, color: '#d3b16b' }} />
                </Box>
                <Typography variant="h5" sx={{ color: '#1a2b4a', fontWeight: 700, mb: 1 }}>
                  Bienvenido
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ingrese sus credenciales para continuar
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={3}>
                <Controller
                  name="nombreUsuario"
                  control={control}
                  rules={{ 
                    required: 'Usuario es requerido',
                    minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                  }}
                  render={({ field }) => (
                    <TextField 
                      {...field}
                      label="Usuario" 
                      variant="outlined" 
                      error={!!errors.nombreUsuario}
                      helperText={errors.nombreUsuario?.message}
                      disabled={isLoading} 
                      fullWidth
                      autoComplete="username"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutline sx={{ color: '#1a2b4a' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#4a9fd8',
                          },
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="clave"
                  control={control}
                  rules={{ 
                    required: 'Contraseña es requerida',
                    minLength: { value: 4, message: 'Mínimo 4 caracteres' }
                  }}
                  render={({ field }) => (
                    <TextField 
                      {...field}
                      label="Contraseña" 
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined" 
                      error={!!errors.clave}
                      helperText={errors.clave?.message}
                      disabled={isLoading} 
                      fullWidth
                      autoComplete="current-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined sx={{ color: '#1a2b4a' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              disabled={isLoading}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#4a9fd8',
                          },
                        },
                      }}
                    />
                  )}
                />

                {error && (
                  <Box 
                    sx={{ 
                      bgcolor: '#fee',
                      border: '1px solid #fcc',
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="body2" color="error" sx={{ fontWeight: 500 }}>
                      {error}
                    </Typography>
                  </Box>
                )}

                <Button 
                  type="submit" 
                  variant="contained"
                  size="large"
                  disabled={isLoading || !isValid}
                  sx={{ 
                    py: 1.8,
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: '1rem',
                    letterSpacing: 1,
                    background: 'linear-gradient(135deg, #1a2b4a 0%, #2c4875 100%)',
                    boxShadow: '0 8px 24px rgba(26, 43, 74, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2c4875 0%, #1a2b4a 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 32px rgba(26, 43, 74, 0.4)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                    '&.Mui-disabled': {
                      background: '#e0e0e0',
                      color: '#9e9e9e',
                    },
                  }}
                >
                  {isLoading ? 'INGRESANDO...' : 'INGRESAR'}
                </Button>

                <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={1}>
                  <Link 
                    href="#" 
                    underline="hover"
                    sx={{ 
                      fontSize: '0.875rem',
                      color: '#1a2b4a',
                      fontWeight: 500,
                      transition: 'color 0.2s',
                      '&:hover': { color: '#4a9fd8' },
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                  <Link 
                    href="#" 
                    underline="hover"
                    sx={{ 
                      fontSize: '0.875rem',
                      color: '#1a2b4a',
                      fontWeight: 500,
                      transition: 'color 0.2s',
                      '&:hover': { color: '#4a9fd8' },
                    }}
                  >
                    ¿Olvidaste tu correo?
                  </Link>
                </Box>

                <Box textAlign="center" mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    ¿No tienes cuenta?{' '}
                    <Link 
                      href="#" 
                      underline="hover"
                      sx={{ 
                        color: '#1a2b4a',
                        fontWeight: 600,
                        transition: 'color 0.2s',
                        '&:hover': { color: '#4a9fd8' },
                      }}
                    >
                      Crear usuario
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
