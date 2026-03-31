/**
 * Projects Store
 * Manages projects state and actions
 */
import { defineStore } from 'pinia';

export interface ProjectFile {
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  images: string[];
  files: ProjectFile[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  searchQuery: string;
}

export const useProjectsStore = defineStore('projects', {
  state: (): ProjectsState => ({
    projects: [],
    currentProject: null,
    isLoading: false,
    error: null,
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    searchQuery: '',
  }),

  getters: {
    hasProjects(): boolean {
      return this.projects.length > 0;
    },

    projectCount(): number {
      return this.projects.length;
    },

    hasMore(): boolean {
      return this.page < this.totalPages;
    },
  },

  actions: {
    /**
     * Load all projects
     */
    async loadProjects(page: number = 1, search?: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const config = useRuntimeConfig();
        const authStore = useAuthStore();
        const searchParam = search || this.searchQuery;
        const url = new URL(`${config.public.apiUrl}/projects`);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('limit', this.limit.toString());
        if (searchParam) {
          url.searchParams.append('search', searchParam);
        }

        const { data } = await useFetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          },
        });

        if (data.value) {
          const response = data.value as any;
          this.projects = response.data.data;
          this.page = response.data.meta.page;
          this.total = response.data.meta.total;
          this.totalPages = response.data.meta.totalPages;
          this.searchQuery = searchParam || '';
        }
      } catch (error: any) {
        this.error = error.data?.error?.message || 'Failed to load projects';
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Load project by ID
     */
    async loadProject(id: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const config = useRuntimeConfig();
        const authStore = useAuthStore();
        const { data } = await useFetch(`${config.public.apiUrl}/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          },
        });

        if (data.value) {
          const response = data.value as any;
          this.currentProject = response.data;
          return { success: true };
        }
      } catch (error: any) {
        this.error = error.data?.error?.message || 'Failed to load project';
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }

      return { success: false, error: 'Unknown error' };
    },

    /**
     * Create project (admin)
     */
    async createProject(projectData: {
      title: string;
      shortDescription: string;
      description: string;
      images?: string[];
      files?: ProjectFile[];
    }) {
      this.isLoading = true;
      this.error = null;

      try {
        const config = useRuntimeConfig();
        const authStore = useAuthStore();
        const { data } = await useFetch(`${config.public.apiUrl}/projects`, {
          method: 'POST',
          body: projectData,
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          },
        });

        if (data.value) {
          const response = data.value as any;
          this.projects.unshift(response.data);
          return { success: true, project: response.data };
        }
      } catch (error: any) {
        this.error = error.data?.error?.message || 'Failed to create project';
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }

      return { success: false, error: 'Unknown error' };
    },

    /**
     * Update project (admin)
     */
    async updateProject(id: string, projectData: Partial<Project>) {
      this.isLoading = true;
      this.error = null;

      try {
        const config = useRuntimeConfig();
        const authStore = useAuthStore();
        const { data } = await useFetch(`${config.public.apiUrl}/projects/${id}`, {
          method: 'PUT',
          body: projectData,
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          },
        });

        if (data.value) {
          const response = data.value as any;

          // Update in list
          const index = this.projects.findIndex(p => p.id === id);
          if (index !== -1) {
            this.projects[index] = response.data;
          }

          // Update current if needed
          if (this.currentProject?.id === id) {
            this.currentProject = response.data;
          }

          return { success: true, project: response.data };
        }
      } catch (error: any) {
        this.error = error.data?.error?.message || 'Failed to update project';
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }

      return { success: false, error: 'Unknown error' };
    },

    /**
     * Delete project (admin)
     */
    async deleteProject(id: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const config = useRuntimeConfig();
        const authStore = useAuthStore();
        await useFetch(`${config.public.apiUrl}/projects/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          },
        });

        // Remove from list
        const index = this.projects.findIndex(p => p.id === id);
        if (index !== -1) {
          this.projects.splice(index, 1);
        }

        // Clear current if needed
        if (this.currentProject?.id === id) {
          this.currentProject = null;
        }

        return { success: true };
      } catch (error: any) {
        this.error = error.data?.error?.message || 'Failed to delete project';
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Search projects
     */
    async search(query: string) {
      this.searchQuery = query;
      await this.loadProjects(1, query);
    },

    /**
     * Clear current project
     */
    clearCurrent() {
      this.currentProject = null;
    },

    /**
     * Reset state
     */
    reset() {
      this.projects = [];
      this.currentProject = null;
      this.isLoading = false;
      this.error = null;
      this.page = 1;
      this.limit = 12;
      this.total = 0;
      this.totalPages = 0;
      this.searchQuery = '';
    },
  },
});
