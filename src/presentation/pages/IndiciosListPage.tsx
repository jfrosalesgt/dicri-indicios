import { Box, Typography, Card } from '@mui/material';

export const IndiciosListPage = () => (
  <Box>
    <Typography variant="h5" fontWeight={600} mb={2}>Indicios</Typography>
    <Card sx={{ p:3, borderRadius:3 }}>
      <Typography variant="body2" color="text.secondary">
        Página en blanco para gestión y seguimiento de indicios.
      </Typography>
    </Card>
  </Box>
);
