import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { config } from '../config/config';

export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class HttpClient {
  private client: AxiosInstance;
  private tokenKey: string = config.tokenKey;

  constructor(clientConfig?: HttpClientConfig) {
    this.client = axios.create({
      baseURL: clientConfig?.baseURL || config.apiBaseUrl,
      timeout: clientConfig?.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...clientConfig?.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add token to headers
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle common errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          // Handle specific HTTP error codes
          switch (error.response.status) {
            case 401:
              // Unauthorized - Clear token and redirect to login
              this.clearToken();
              window.location.href = '/login';
              break;
            case 403:
              // Forbidden
              console.error('Access denied');
              break;
            case 404:
              // Not found
              console.error('Resource not found');
              break;
            case 500:
              // Server error
              console.error('Internal server error');
              break;
          }
        } else if (error.request) {
          // Request made but no response
          console.error('No response from server');
        } else {
          // Error in request setup
          console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management
  public setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(config.tokenExpKey);
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired
    const exp = localStorage.getItem(config.tokenExpKey);
    if (exp) {
      const expTime = parseInt(exp, 10) * 1000; // Convert to milliseconds
      return Date.now() < expTime;
    }

    return !!token;
  }

  // HTTP Methods
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public async post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public async put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public async patch<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // Get raw axios instance if needed
  public getInstance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const httpClient = new HttpClient();
