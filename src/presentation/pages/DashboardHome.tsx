import './DashboardHome.css';
import { Box, Typography, Card, Grid } from '@mui/material';

export const DashboardHome = () => {
  const certs = [
    { icon: '🗺️', title: 'MAPA DE COBERTURA', desc: '340 municipios' },
    { icon: '✓', title: 'ISO 9001:2015', desc: 'Eficacia, liderazgo y mejora continua' },
    { icon: '🔒', title: 'ISO 37001:2016', desc: 'Sistema de gestión antisoborno' },
    { icon: '📊', title: 'ISO 21001', desc: 'UNICAP - Sistema de gestión educativa' },
  ];
  const services = [
    { icon: '🛡️', title: 'Certificaciones RENAS', desc: 'Solicitud de certificado del Registro Nacional de Agresores Sexuales (validez de 6 meses).' },
    { icon: '📝', title: 'Registro de denuncia', desc: 'Formulario para hacer de conocimiento sobre un hecho potencialmente ilícito.' },
    { icon: '💼', title: 'Consulta de trámite', desc: 'Verificación del estado de trámites realizados.' },
    { icon: '📞', title: 'Atención ciudadana', desc: 'Centro de atención para consultas y orientación.' },
  ];

  return (
    <Box className="dashboard-home">
      <Typography variant="h4" className="page-title" mb={3}>Bienvenido al Sistema DICRI Indicios</Typography>
      <Card className="welcome-card" sx={{ mb:4 }}>
        <Box className="welcome-header" textAlign="center" mb={4}>
          <Box className="mp-logo-large" display="flex" justifyContent="center" alignItems="center" gap={2}>
            <span className="mp-large">MP</span>
            <span className="mp-shield">⚖️</span>
          </Box>
          <Typography variant="h5" fontWeight={600} mt={2}>MINISTERIO PÚBLICO</Typography>
          <Typography variant="subtitle1" className="subtitle">Servicios Administrativos</Typography>
        </Box>
        <Grid container spacing={3}>
          {certs.map(c => (
            <Grid item xs={12} sm={6} md={3} key={c.title}>
              <Box className="cert-card" textAlign="center">
                <Box className="cert-icon" mb={1}>{c.icon}</Box>
                <Typography variant="subtitle1" fontWeight={600}>{c.title}</Typography>
                <Typography variant="caption" display="block" mt={1}>{c.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>
      <Card className="services-section" sx={{ mb:4 }}>
        <Typography variant="h5" className="section-title" mb={3}>Servicios en línea</Typography>
        <Grid container spacing={3}>
          {services.map(s => (
            <Grid item xs={12} sm={6} md={3} key={s.title}>
              <Box className="service-card">
                <Box className="service-icon" mb={1}>{s.icon}</Box>
                <Typography variant="subtitle1" fontWeight={600}>{s.title}</Typography>
                <Typography variant="body2" mt={0.5}>{s.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Box>
  );
};
