export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030/api',
  appName: import.meta.env.VITE_APP_NAME || 'DICRI Indicios',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  tokenKey: 'dicri_auth_token',
  tokenExpKey: 'dicri_auth_exp',
};
