import { Box, Typography, Card } from '@mui/material';

export const RevisionExpedientesPage = () => (
  <Box>
    <Typography variant="h5" fontWeight={600} mb={2}>Revisión de Expedientes</Typography>
    <Card sx={{ p:3, borderRadius:3 }}>
      <Typography variant="body2" color="text.secondary">
        Página en blanco para flujo de aprobación / rechazo.
      </Typography>
    </Card>
  </Box>
);
