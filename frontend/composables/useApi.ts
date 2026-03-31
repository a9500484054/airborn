/**
 * API Client
 * Centralized API client with error handling
 */
const config = useRuntimeConfig();

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  errorCode: string;
  message: string;
  path: string;
  timestamp: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.public.apiUrl;
  }

  private getHeaders(accessToken?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return headers;
  }

  async get<T>(endpoint: string, accessToken?: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(accessToken),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body: any, accessToken?: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body: any, accessToken?: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, body: any, accessToken?: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, accessToken?: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(accessToken),
    });

    return this.handleResponse<T>(response);
  }

  async upload<T>(endpoint: string, formData: FormData, accessToken?: string): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {};
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    // Don't set Content-Type - browser will set it with boundary

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Request failed');
    }

    return data;
  }
}

export const api = new ApiClient();
