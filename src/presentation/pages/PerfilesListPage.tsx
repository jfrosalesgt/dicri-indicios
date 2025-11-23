import { Box, Typography, Card } from '@mui/material';

export const PerfilesListPage = () => (
  <Box>
    <Typography variant="h5" fontWeight={600} mb={2}>Perfiles</Typography>
    <Card sx={{ p:3, borderRadius:3 }}>
      <Typography variant="body2" color="text.secondary">
        Página en blanco para listado y mantenimiento de perfiles.
      </Typography>
    </Card>
  </Box>
);
