import type { LoginCredentials, LoginResponse, AuthUser, ChangePasswordRequest } from '../entities/Auth';
import type { User } from '../entities/User';
import type { ApiResponse } from '../entities/ApiResponse';

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>>;
  verify(): Promise<ApiResponse<AuthUser>>;
  logout(): void;
  changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>>;
  getMe(): Promise<ApiResponse<User>>;
}
