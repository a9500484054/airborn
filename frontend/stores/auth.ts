/**
 * Auth Store
 * Manages authentication state and actions
 */
import { defineStore } from 'pinia';
import type { Ref } from 'vue';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAdmin(): boolean {
      return this.user?.role === 'admin';
    },
    
    isUser(): boolean {
      return this.user?.role === 'user';
    },
    
    userName(): string {
      return this.user?.name || 'Guest';
    },
    
    userInitials(): string {
      if (!this.user?.name) return 'G';
      return this.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    },
  },

  actions: {
    /**
     * Login user
     */
    async login(email: string, password: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const config = useRuntimeConfig();
        const { data } = await useFetch(`${config.public.apiUrl}/auth/login`, {
          method: 'POST',
          body: { email, password },
        });

        if (data.value) {
          const response = data.value as any;
          this.setAuth(response.data);
          return { success: true };
        }
      } catch (error: any) {
        this.error = error.data?.error?.message || 'Login failed';
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }

      return { success: false, error: 'Unknown error' };
    },

    /**
     * Register new user
     */
    async register(name: string, email: string, password: string, phone?: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const config = useRuntimeConfig();
        const { data } = await useFetch(`${config.public.apiUrl}/auth/register`, {
          method: 'POST',
          body: { name, email, password, phone },
        });

        if (data.value) {
          const response = data.value as any;
          this.setAuth(response.data);
          return { success: true };
        }
      } catch (error: any) {
        this.error = error.data?.error?.message || 'Registration failed';
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }

      return { success: false, error: 'Unknown error' };
    },

    /**
     * Logout user
     */
    async logout() {
      try {
        const config = useRuntimeConfig();
        await useFetch(`${config.public.apiUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.clearAuth();
        navigateTo('/');
      }
    },

    /**
     * Refresh token
     */
    async refreshToken() {
      if (!this.refreshToken) return false;

      try {
        const config = useRuntimeConfig();
        const { data } = await useFetch(`${config.public.apiUrl}/auth/refresh`, {
          method: 'POST',
          body: { refreshToken: this.refreshToken },
        });

        if (data.value) {
          const response = data.value as any;
          this.setTokens(response.data.accessToken, response.data.refreshToken);
          return true;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        this.clearAuth();
      }

      return false;
    },

    /**
     * Get current user info
     */
    async fetchUser() {
      if (!this.accessToken) return;

      try {
        const config = useRuntimeConfig();
        const { data } = await useFetch(`${config.public.apiUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });

        if (data.value) {
          const response = data.value as any;
          this.user = response.data;
        }
      } catch (error) {
        console.error('Fetch user error:', error);
        await this.refreshToken();
      }
    },

    /**
     * Update user profile
     */
    async updateProfile(updates: Partial<User>) {
      if (!this.user) throw new Error('Not authenticated');

      try {
        const config = useRuntimeConfig();
        const { data } = await useFetch(`${config.public.apiUrl}/users/${this.user.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: updates,
        });

        if (data.value) {
          const response = data.value as any;
          this.user = { ...this.user, ...response.data };
          return { success: true };
        }
      } catch (error: any) {
        return { success: false, error: error.data?.error?.message || 'Update failed' };
      }

      return { success: false, error: 'Unknown error' };
    },

    /**
     * Change password
     */
    async changePassword(currentPassword: string, newPassword: string) {
      try {
        const config = useRuntimeConfig();
        await useFetch(`${config.public.apiUrl}/auth/change-password`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: { currentPassword, newPassword },
        });

        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.data?.error?.message || 'Password change failed' };
      }
    },

    /**
     * Set authentication data
     */
    setAuth(authData: {
      accessToken: string;
      refreshToken: string;
      user: User;
    }) {
      this.accessToken = authData.accessToken;
      this.refreshToken = authData.refreshToken;
      this.user = authData.user;
      this.isAuthenticated = true;

      // Persist to localStorage
      if (process.client) {
        localStorage.setItem('access_token', authData.accessToken);
        localStorage.setItem('refresh_token', authData.refreshToken);
        localStorage.setItem('user', JSON.stringify(authData.user));
      }
    },

    /**
     * Set tokens only
     */
    setTokens(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;

      if (process.client) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
      }
    },

    /**
     * Clear authentication data
     */
    clearAuth() {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      this.isAuthenticated = false;
      this.error = null;

      if (process.client) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      }
    },

    /**
     * Initialize auth from localStorage
     */
    initFromStorage() {
      if (process.client) {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const userStr = localStorage.getItem('user');

        if (accessToken && refreshToken && userStr) {
          this.accessToken = accessToken;
          this.refreshToken = refreshToken;
          this.user = JSON.parse(userStr);
          this.isAuthenticated = true;
        }
      }
    },
  },
});
