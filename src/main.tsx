import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store, persistor } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { theme } from './presentation/theme/theme';
import { httpClient } from './infrastructure/http/HttpClient'; // ✅ Importar httpClient

// ✅ Configurar httpClient DESPUÉS de que el store esté disponible
httpClient.setTokenGetter(() => {
  return store.getState().auth.token;
});

// ✅ Loader para PersistGate
const PersistLoader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    <CircularProgress />
  </Box>
);

const isDev = import.meta.env.DEV;

const app = (
  <Provider store={store}>
    <PersistGate loading={<PersistLoader />} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </PersistGate>
  </Provider>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  isDev ? <React.StrictMode>{app}</React.StrictMode> : app
);
