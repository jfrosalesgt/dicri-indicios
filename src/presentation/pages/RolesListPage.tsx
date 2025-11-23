import { Box, Typography, Card } from '@mui/material';

export const RolesListPage = () => (
  <Box>
    <Typography variant="h5" fontWeight={600} mb={2}>Roles</Typography>
    <Card sx={{ p:3, borderRadius:3 }}>
      <Typography variant="body2" color="text.secondary">
        Página en blanco para listado y mantenimiento de roles.
      </Typography>
    </Card>
  </Box>
);
