import type { IUserRepository, CreateUserRequest, UpdateUserRequest } from '../../domain/repositories/IUserRepository';
import type { User } from '../../domain/entities/User';
import type { ApiResponse } from '../../domain/entities/ApiResponse';
import { httpClient } from '../http/HttpClient';

export class UserRepository implements IUserRepository {
  private readonly baseUrl = '/users';

  async getUsers(): Promise<ApiResponse<User[]>> {
    const response = await httpClient.get<ApiResponse<User[]>>(this.baseUrl);
    return response.data;
  }

  async getUserById(id: number): Promise<ApiResponse<User>> {
    const response = await httpClient.get<ApiResponse<User>>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createUser(data: CreateUserRequest): Promise<ApiResponse<User>> {
    const response = await httpClient.post<ApiResponse<User>>(this.baseUrl, data);
    return response.data;
  }

  async updateUser(id: number, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    const response = await httpClient.put<ApiResponse<User>>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

export const userRepository = new UserRepository();
