import { Component, type ReactNode } from 'react';
import { Box, Typography, Button, Card } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="100vh"
          bgcolor="#f5f7fa"
          p={3}
        >
          <Card sx={{ p: 4, maxWidth: 600, textAlign: 'center' }}>
            <Typography variant="h5" color="error" gutterBottom>
              Algo salió mal
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {this.state.error?.message || 'Error desconocido'}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => window.location.href = '/'}
            >
              Volver al inicio
            </Button>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}
