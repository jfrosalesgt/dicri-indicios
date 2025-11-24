import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { LoginCredentials, ChangePasswordRequest } from '../../domain/entities/Auth';
import type { User, Perfil, Role } from '../../domain/entities/User';
import type { Module } from '../../domain/entities/Module';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { loginAsync, verifyTokenAsync, logout, changePasswordAsync } from '../../store/authSlice';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  perfiles: Perfil[];
  roles: Role[];
  modulos: Module[];
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
  needsPasswordChange: boolean;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  hasModule: (routePath: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const {
    isAuthenticated,
    isLoading: stateLoading,
    user,
    perfiles,
    roles,
    modulos,
    needsPasswordChange,
  } = useAppSelector((state) => state.auth);

  const isLoading = stateLoading || !isInitialized;

  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated && user && modulos.length > 0) {
        // Ya hay sesión activa, validar token
        try {
          await dispatch(verifyTokenAsync());
        } catch (error) {
          console.error('Token inválido:', error);
        }
      }
      setIsInitialized(true);
    };

    initAuth();
  }, []);

  const verifyToken = async (): Promise<boolean> => {
    if (!isAuthenticated) return false;
    
    try {
      const result = await dispatch(verifyTokenAsync());
      return result.type.endsWith('fulfilled');
    } catch {
      return false;
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const result = await dispatch(loginAsync(credentials));
    if (result.type.endsWith('rejected')) {
      throw new Error((result as any).error?.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
    const result = await dispatch(changePasswordAsync(data));
    if (result.type.endsWith('rejected')) {
      throw new Error((result as any).error?.message || 'Error al cambiar contraseña');
    }
  };

  const hasModule = (routePath: string): boolean => {
    return modulos.some(modulo => modulo.ruta === routePath && modulo.activo);
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    perfiles,
    roles,
    modulos,
    login,
    logout: handleLogout,
    verifyToken,
    needsPasswordChange,
    changePassword,
    hasModule,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
