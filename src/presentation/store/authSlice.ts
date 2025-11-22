import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LoginCredentials, ChangePasswordRequest } from '../../domain/entities/Auth';
import type { User, Perfil, Role } from '../../domain/entities/User';
import type { Module } from '../../domain/entities/Module';
import { authRepository } from '../../infrastructure/repositories/AuthRepository';
import { httpClient } from '../../infrastructure/http/HttpClient';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  perfiles: Perfil[];
  roles: Role[];
  modulos: Module[];
  needsPasswordChange: boolean;
  error?: string;
}

const cachedUser: User | null = (() => {
  try {
    const raw = localStorage.getItem('dicri_auth_user');
    return raw ? JSON.parse(raw) as User : null;
  } catch {
    return null;
  }
})();

const cachedModulos: Module[] = (() => {
  try {
    const raw = localStorage.getItem('dicri_auth_modulos');
    return raw ? JSON.parse(raw) as Module[] : [];
  } catch {
    return [];
  }
})();

const initialState: AuthState = {
  isAuthenticated: !!cachedUser && httpClient.isAuthenticated(),
  isLoading: true,
  user: cachedUser,
  perfiles: [],
  roles: [],
  modulos: cachedModulos,
  needsPasswordChange: cachedUser ? cachedUser.cambiar_clave : false,
  error: undefined,
};

export const verifyTokenAsync = createAsyncThunk('auth/verifyToken', async () => {
  if (!httpClient.isAuthenticated()) {
    throw new Error('No token');
  }
  const response = await authRepository.verify();
  if (!response.success) {
    httpClient.clearToken();
    throw new Error(response.message || 'Token inválido');
  }
  const me = await authRepository.getMe();
  return me.data!;
});

export const loginAsync = createAsyncThunk('auth/login', async (credentials: LoginCredentials) => {
  const response = await authRepository.login(credentials);
  if (!response.success || !response.data) {
    throw new Error(response.message || 'Error de login');
  }
  return response.data;
});

export const changePasswordAsync = createAsyncThunk('auth/changePassword', async (payload: ChangePasswordRequest) => {
  const response = await authRepository.changePassword(payload);
  if (!response.success) {
    throw new Error(response.message || 'Error al cambiar contraseña');
  }
  return true;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      authRepository.logout();
      state.isAuthenticated = false;
      state.user = null;
      state.perfiles = [];
      state.roles = [];
      state.modulos = [];
      state.needsPasswordChange = false;
      state.error = undefined;
      localStorage.removeItem('dicri_auth_user');
      localStorage.removeItem('dicri_auth_modulos');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyTokenAsync.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(verifyTokenAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.needsPasswordChange = action.payload.cambiar_clave;
      })
      .addCase(verifyTokenAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.error.message;
      })
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.usuario;
        state.perfiles = action.payload.perfiles;
        state.roles = action.payload.roles;
        state.modulos = action.payload.modulos;
        state.needsPasswordChange = action.payload.usuario.cambiar_clave;
        localStorage.setItem('dicri_auth_user', JSON.stringify(action.payload.usuario));
        localStorage.setItem('dicri_auth_modulos', JSON.stringify(action.payload.modulos));
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.error.message;
      })
      .addCase(changePasswordAsync.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.isLoading = false;
        if (state.user) {
          state.user.cambiar_clave = false;
          state.needsPasswordChange = false;
        }
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;