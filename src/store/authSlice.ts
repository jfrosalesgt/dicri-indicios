import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authRepository } from '../infrastructure/repositories/AuthRepository';
import type { LoginCredentials, ChangePasswordRequest } from '../domain/entities/Auth';
import type { User, Perfil, Role } from '../domain/entities/User';
import type { Module } from '../domain/entities/Module';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  perfiles: Perfil[];
  roles: Role[];
  modulos: Module[];
  needsPasswordChange: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: null,
  perfiles: [],
  roles: [],
  modulos: [],
  needsPasswordChange: false,
  error: null,
};

// Async Thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authRepository.login(credentials);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Login failed');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al iniciar sesión');
    }
  }
);

export const verifyTokenAsync = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authRepository.verifyToken();
      if (!response.success || !response.data) {
        throw new Error('Token inválido');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token inválido');
    }
  }
);

export const changePasswordAsync = createAsyncThunk(
  'auth/changePassword',
  async (data: ChangePasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authRepository.changePassword(data);
      if (!response.success) {
        throw new Error(response.message || 'Error al cambiar contraseña');
      }
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cambiar contraseña');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.perfiles = [];
      state.roles = [];
      state.modulos = [];
      state.needsPasswordChange = false;
      state.error = null;
      localStorage.removeItem('dicri_auth_token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      // El backend devuelve 'usuario', no 'user'
      state.user = action.payload.usuario || action.payload.user;
      state.perfiles = action.payload.perfiles || [];
      state.roles = action.payload.roles || [];
      state.modulos = action.payload.modulos || [];
      // Manejar ambos casos: usuario.cambiar_clave o user.cambiar_clave
      const userData = action.payload.usuario || action.payload.user;
      state.needsPasswordChange = userData?.cambiar_clave || false;
      localStorage.setItem('dicri_auth_token', action.payload.token);
    });
    builder.addCase(loginAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Verify Token
    builder.addCase(verifyTokenAsync.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(verifyTokenAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      // El backend puede devolver 'usuario' o 'user'
      state.user = action.payload.usuario || action.payload.user;
      state.perfiles = action.payload.perfiles || [];
      state.roles = action.payload.roles || [];
      state.modulos = action.payload.modulos || [];
      const userData = action.payload.usuario || action.payload.user;
      state.needsPasswordChange = userData?.cambiar_clave || false;
    });
    builder.addCase(verifyTokenAsync.rejected, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('dicri_auth_token');
    });

    // Change Password
    builder.addCase(changePasswordAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(changePasswordAsync.fulfilled, (state) => {
      state.isLoading = false;
      state.needsPasswordChange = false;
      if (state.user) {
        state.user.cambiar_clave = false;
      }
    });
    builder.addCase(changePasswordAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
