import { Box, Typography, Card } from '@mui/material';

export const ReportesPage = () => (
  <Box>
    <Typography variant="h5" fontWeight={600} mb={2}>Informes y Estadísticas</Typography>
    <Card sx={{ p:3, borderRadius:3 }}>
      <Typography variant="body2" color="text.secondary">
        Página en blanco para generación de informes.
      </Typography>
    </Card>
  </Box>
);
