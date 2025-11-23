import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { config } from '../config/config';
import { store } from '../../store/store'; // ✅ Importar store

export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class HttpClient {
  private client: AxiosInstance;

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
    this.client.interceptors.request.use(
      (config) => {
        // ✅ Leer token desde Redux store
        const token = store.getState().auth.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // ✅ Limpiar Redux state
          store.dispatch({ type: 'auth/logout' });
          window.location.href = '/login';
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
