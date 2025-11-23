import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store, persistor } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './presentation/theme/theme';

// ✅ StrictMode solo en desarrollo
const isDev = import.meta.env.DEV;

const app = (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
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
