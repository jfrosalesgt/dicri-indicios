import type { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import type { LoginCredentials, LoginResponse, AuthUser, ChangePasswordRequest } from '../../domain/entities/Auth';
import type { User } from '../../domain/entities/User';
import type { ApiResponse } from '../../domain/entities/ApiResponse';
import { httpClient } from '../http/HttpClient';
import { jwtDecode } from 'jwt-decode';
import { config } from '../config/config';

export class AuthRepository implements IAuthRepository {
  private readonly baseUrl = '/auth';

  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await httpClient.post<ApiResponse<any>>(
        `${this.baseUrl}/login`,
        credentials
      );

      // ✅ Solo retornar datos, Redux se encarga de guardar
      if (response.data && response.data.usuario && !response.data.user) {
        response.data.user = response.data.usuario;
      }

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al iniciar sesión',
        data: null
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
