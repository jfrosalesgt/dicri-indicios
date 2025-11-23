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

// ✅ Cargar estado persistido desde localStorage
const loadPersistedState = (): Partial<AuthState> => {
  try {
    const token = localStorage.getItem('dicri_auth_token');
    const userStr = localStorage.getItem('dicri_auth_user');
    const modulosStr = localStorage.getItem('dicri_auth_modulos');
    
    if (!token || !userStr) {
      return {
        isAuthenticated: false,
        user: null,
        token: null,
        modulos: [],
      };
    }

    const user = JSON.parse(userStr) as User;
    const modulos = modulosStr ? JSON.parse(modulosStr) as Module[] : [];

    return {
      isAuthenticated: true,
      user,
      token,
      modulos,
      needsPasswordChange: user.cambiar_clave || false,
    };
  } catch {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      modulos: [],
    };
  }
};

const persistedState = loadPersistedState();

const initialState: AuthState = {
  isAuthenticated: persistedState.isAuthenticated ?? false,
  isLoading: false,
  user: persistedState.user ?? null,
  token: persistedState.token ?? null,
  perfiles: [],
  roles: [],
  modulos: persistedState.modulos ?? [],
  needsPasswordChange: persistedState.needsPasswordChange ?? false,
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
      const token = localStorage.getItem('dicri_auth_token');
      if (!token) {
        throw new Error('No token');
      }
      
      const response = await authRepository.verify();
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
      // ✅ Limpiar localStorage
      localStorage.removeItem('dicri_auth_token');
      localStorage.removeItem('dicri_auth_user');
      localStorage.removeItem('dicri_auth_modulos');
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
      state.user = action.payload.usuario || action.payload.user;
      state.perfiles = action.payload.perfiles || [];
      state.roles = action.payload.roles || [];
      state.modulos = action.payload.modulos || [];
      const userData = action.payload.usuario || action.payload.user;
      state.needsPasswordChange = userData?.cambiar_clave || false;
      
      // ✅ Persistir en localStorage
      localStorage.setItem('dicri_auth_token', action.payload.token);
      localStorage.setItem('dicri_auth_user', JSON.stringify(state.user));
      localStorage.setItem('dicri_auth_modulos', JSON.stringify(state.modulos));
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
      // El verify devuelve AuthUser, necesitamos obtener el User completo
      const existingUser = state.user;
      if (existingUser) {
        state.user = existingUser; // Mantener el user existente
      }
    });
    builder.addCase(verifyTokenAsync.rejected, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.modulos = [];
      localStorage.removeItem('dicri_auth_token');
      localStorage.removeItem('dicri_auth_user');
      localStorage.removeItem('dicri_auth_modulos');
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
        // ✅ Actualizar localStorage
        localStorage.setItem('dicri_auth_user', JSON.stringify(state.user));
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
