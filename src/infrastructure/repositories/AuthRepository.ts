import type { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import type { LoginCredentials, LoginResponse, AuthUser, ChangePasswordRequest } from '../../domain/entities/Auth';
import type { User } from '../../domain/entities/User';
import type { ApiResponse } from '../../domain/entities/ApiResponse';
import { httpClient } from '../http/HttpClient';

export class AuthRepository implements IAuthRepository {
  private readonly baseUrl = '/auth';

  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    try {
      console.log('🔵 AuthRepository: Iniciando login...', credentials.nombre_usuario);
      
      const response = await httpClient.post<ApiResponse<any>>(
        `${this.baseUrl}/login`,
        credentials
      );

      console.log('✅ AuthRepository: Respuesta recibida', response.status, response.data);

      // ✅ Solo retornar datos, Redux se encarga de guardar
      if (response.data && (response.data as any).usuario && !(response.data as any).user) {
        (response.data as any).user = (response.data as any).usuario;
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ AuthRepository: Error en login', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al iniciar sesión',
        data: undefined
      };
    }
  }

  async verify(): Promise<ApiResponse<AuthUser>> {
    const response = await httpClient.get<ApiResponse<AuthUser>>(`${this.baseUrl}/verify`);
    return response.data;
  }

  logout(): void {
  }

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
    const response = await httpClient.post<ApiResponse<void>>(
      `${this.baseUrl}/change-password`,
      data
    );
    return response.data;
  }

  async getMe(): Promise<ApiResponse<User>> {
    const response = await httpClient.get<ApiResponse<User>>(`${this.baseUrl}/me`);
    return response.data;
  }
}

export const authRepository = new AuthRepository();
