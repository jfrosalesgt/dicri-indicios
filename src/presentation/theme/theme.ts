import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a2b4a',
    },
    secondary: {
      main: '#4a9fd8',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
});