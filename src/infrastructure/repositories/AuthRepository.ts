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
    const response = await httpClient.post<ApiResponse<LoginResponse>>(
      `${this.baseUrl}/login`,
      credentials
    );

    // Store token and expiration
    if (response.data.success && response.data.data) {
      const token = response.data.data.token;
      httpClient.setToken(token);

      // Decode token to get expiration
      const decoded: AuthUser = jwtDecode(token);
      localStorage.setItem(config.tokenExpKey, decoded.exp.toString());
    }

    return response.data;
  }

  async verify(): Promise<ApiResponse<AuthUser>> {
    const response = await httpClient.get<ApiResponse<AuthUser>>(`${this.baseUrl}/verify`);
    return response.data;
  }

  logout(): void {
    httpClient.clearToken();
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
