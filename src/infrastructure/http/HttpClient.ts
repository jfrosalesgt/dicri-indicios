import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { config } from '../config/config';

export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class HttpClient {
  private client: AxiosInstance;
  // ✅ Función para obtener token (lazy evaluation)
  private getToken: (() => string | null) | null = null;

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

  // ✅ Método para inyectar el getter del token
  public setTokenGetter(getter: () => string | null): void {
    this.getToken = getter;
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        console.log('📤 HTTP Request:', config.method?.toUpperCase(), config.url);
        // ✅ Obtener token solo cuando se necesita
        const token = this.getToken?.();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('🔐 Token añadido a la petición');
        }
        return config;
      },
      (error) => {
        console.error('❌ Error en request interceptor:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log('📥 HTTP Response:', response.status, response.config.url);
        return response;
      },
      (error: AxiosError) => {
        console.error('❌ HTTP Error:', error.response?.status, error.config?.url);
        console.error('❌ Error data:', error.response?.data);
        
        if (error.response?.status === 401) {
          console.warn('⚠️ 401 Unauthorized - Redirigiendo a login');
          // ✅ Solo redirigir si NO estamos ya en login
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
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
