/**
 * API Client with auto token refresh
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
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

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

  /**
   * Ensure valid token
   */
  private async ensureValidToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    
    const authStore = useAuthStore();
    
    if (!authStore.accessToken) {
      return null;
    }

    // Check if token is about to expire (less than 1 minute left)
    try {
      const tokenPayload = JSON.parse(atob(authStore.accessToken.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = tokenPayload.exp - now;
      
      if (timeLeft < 60 && authStore.refreshToken) {
        // Token about to expire, refresh it
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          this.refreshPromise = authStore.refreshToken().then((success) => {
            this.isRefreshing = false;
            this.refreshPromise = null;
            return success;
          });
        }
        
        await this.refreshPromise;
      }
    } catch (error) {
      console.error('Token validation error:', error);
    }

    return authStore.accessToken;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    await this.ensureValidToken();
    
    const authStore = useAuthStore();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(authStore.accessToken),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    await this.ensureValidToken();
    
    const authStore = useAuthStore();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(authStore.accessToken),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    await this.ensureValidToken();
    
    const authStore = useAuthStore();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(authStore.accessToken),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    await this.ensureValidToken();
    
    const authStore = useAuthStore();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(authStore.accessToken),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    await this.ensureValidToken();
    
    const authStore = useAuthStore();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(authStore.accessToken),
    });

    return this.handleResponse<T>(response);
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    await this.ensureValidToken();
    
    const authStore = useAuthStore();
    const headers: HeadersInit = {};

    if (authStore.accessToken) {
      headers['Authorization'] = `Bearer ${authStore.accessToken}`;
    }

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
      // Handle 401 - try to refresh token
      if (response.status === 401) {
        const authStore = useAuthStore();
        if (authStore.refreshToken) {
          const refreshed = await authStore.refreshToken();
          if (refreshed) {
            // Retry the request with new token
            return this.handleResponse<T>(response.clone());
          }
        }
      }
      
      throw new Error(data.error?.message || 'Request failed');
    }

    return data;
  }
}

export const api = new ApiClient();
