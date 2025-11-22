import { Box, Typography, Card } from '@mui/material';

export const EscenasListPage = () => (
  <Box>
    <Typography variant="h5" fontWeight={600} mb={2}>Escenas</Typography>
    <Card sx={{ p:3, borderRadius:3 }}>
      <Typography variant="body2" color="text.secondary">
        Página en blanco para gestión de escenas vinculadas a expedientes.
      </Typography>
    </Card>
  </Box>
);
