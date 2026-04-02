<template>
  <NuxtLayout name="authenticated">
    <div class="projects-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Проекты</h1>
          <p class="page-subtitle">Управляйте вашими проектами и отслеживайте прогресс</p>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12.5 12.5L16.5 16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Поиск проектов..."
              @input="handleSearch"
            />
          </div>
          <!-- <button class="filter-btn" @click="showFilters = !showFilters">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4H16M4 9H14M6 14H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="13" cy="4" r="1.5" fill="currentColor"/>
              <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
              <circle cx="5" cy="14" r="1.5" fill="currentColor"/>
            </svg>
            Фильтры
          </button> -->
        </div>
      </div>

      <!-- Filters Panel -->
      <!-- <transition name="slide">
        <div v-if="showFilters" class="filters-panel">
          <div class="filters-grid">
            <div class="filter-group">
              <label class="filter-label">Статус</label>
              <select v-model="filters.status" class="filter-select" @change="applyFilters">
                <option value="">Все статусы</option>
                <option value="active">Активные</option>
                <option value="completed">Завершенные</option>
                <option value="pending">В ожидании</option>
              </select>
            </div>
            <div class="filter-group">
              <label class="filter-label">Дата создания</label>
              <select v-model="filters.dateRange" class="filter-select" @change="applyFilters">
                <option value="">Все время</option>
                <option value="week">За неделю</option>
                <option value="month">За месяц</option>
                <option value="year">За год</option>
              </select>
            </div>
            <div class="filter-group">
              <label class="filter-label">Сортировка</label>
              <select v-model="filters.sortBy" class="filter-select" @change="applyFilters">
                <option value="newest">Сначала новые</option>
                <option value="oldest">Сначала старые</option>
                <option value="name">По названию</option>
              </select>
            </div>
          </div>
          <div class="filters-actions">
            <button class="btn-clear" @click="clearFilters">Сбросить фильтры</button>
          </div>
        </div>
      </transition> -->

      <!-- Stats Cards -->
      <!-- <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="8" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M8 5V8M16 5V8M3 11H21" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ totalProjects }}</div>
            <div class="stat-label">Всего проектов</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 12V18H4V12M12 2V14M12 14L9 11M12 14L15 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ activeProjects }}</div>
            <div class="stat-label">Активных</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12H15M12 9V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ completedProjects }}</div>
            <div class="stat-label">Завершенных</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ pendingProjects }}</div>
            <div class="stat-label">В ожидании</div>
          </div>
        </div>
      </div> -->

      <!-- Loading State -->
      <div v-if="projectsStore.isLoading && !projectsStore.hasProjects" class="loading-state">
        <div class="spinner"></div>
        <p>Загрузка проектов...</p>
      </div>

      <!-- Projects Grid -->
      <div v-else-if="projectsStore.hasProjects" class="projects-grid">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="project-card"
          :class="getStatusClass(project.status)"
        >
          <div class="project-badge" v-if="project.status">
            {{ getStatusText(project.status) }}
          </div>
          <div class="project-images">
            <img
              v-if="project.images?.[0]"
              :src="project.images[0]"
              :alt="project.title"
              loading="lazy"
            />
            <div v-else class="project-image-placeholder">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="12" width="32" height="24" rx="2" stroke="currentColor" stroke-width="1.5"/>
                <path d="M16 20L20 24L32 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
          <div class="project-content">
            <div class="project-header">
              <h3 class="project-title">{{ project.title }}</h3>
              <div class="project-menu" @click.stop="toggleProjectMenu(project.id)">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="5" r="1.5" fill="currentColor"/>
                  <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                  <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <p class="project-description">{{ project.shortDescription }}</p>
            <div class="project-progress" v-if="project.progress !== undefined">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: project.progress + '%' }"></div>
              </div>
              <span class="progress-text">{{ project.progress }}%</span>
            </div>
            <div class="project-meta">
              <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M11.6667 2.33333H2.33333C1.59695 2.33333 1 2.93029 1 3.66667V11.6667C1 12.403 1.59695 13 2.33333 13H11.6667C12.403 13 13 12.403 13 11.6667V3.66667C13 2.93029 12.403 2.33333 11.6667 2.33333Z" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M4.66667 1V3.66667M9.33333 1V3.66667M1 6.33333H13" stroke="currentColor" stroke-width="1.2"/>
                </svg>
                <span>{{ formatDate(project.createdAt) }}</span>
              </div>
              <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.33333 2.33333H11.6667C12.403 2.33333 13 2.93029 13 3.66667V11.6667C13 12.403 12.403 13 11.6667 13H2.33333C1.59695 13 1 12.403 1 11.6667V3.66667C1 2.93029 1.59695 2.33333 2.33333 2.33333Z" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M4.66667 5.66667H9.33333M4.66667 8.33333H7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
                <span>{{ project.images?.length || 0 }} фото</span>
              </div>
              <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1V3.66667M7 10.3333V13M3.66667 7H1M13 7H10.3333M10.5 10.5L8.75 8.75M10.5 3.5L8.75 5.25M3.5 3.5L5.25 5.25M3.5 10.5L5.25 8.75" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
                <span>{{ project.files?.length || 0 }} файлов</span>
              </div>
            </div>
            <NuxtLink :to="`/projects/${project.id}`" class="project-link">
              Подробнее
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3.33333 8H12.6667M12.6667 8L8.66667 4M12.6667 8L8.66667 12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
            </NuxtLink>
          </div>

          <!-- Project Menu Dropdown -->
          <transition name="dropdown">
            <div v-if="activeMenuId === project.id" class="project-dropdown">
              <div class="dropdown-item" @click="editProject(project)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11.3333 2L14 4.66667M5.33333 13.3333L2 14L2.66667 10.6667L10.6667 2.66667L13.3333 5.33333L5.33333 13.3333Z" stroke="currentColor" stroke-width="1.2"/>
                </svg>
                Редактировать
              </div>
              <div class="dropdown-item" @click="shareProject(project)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 5.33333C13.1046 5.33333 14 4.4379 14 3.33333C14 2.22876 13.1046 1.33333 12 1.33333C10.8954 1.33333 10 2.22876 10 3.33333C10 4.4379 10.8954 5.33333 12 5.33333Z" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M4 9.33333C5.10457 9.33333 6 8.4379 6 7.33333C6 6.22876 5.10457 5.33333 4 5.33333C2.89543 5.33333 2 6.22876 2 7.33333C2 8.4379 2.89543 9.33333 4 9.33333Z" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M12 13.3333C13.1046 13.3333 14 12.4379 14 11.3333C14 10.2288 13.1046 9.33333 12 9.33333C10.8954 9.33333 10 10.2288 10 11.3333C10 12.4379 10.8954 13.3333 12 13.3333Z" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M5.59998 8.53333L10.4 10.1333M10.4 5.86667L5.59998 7.46667" stroke="currentColor" stroke-width="1.2"/>
                </svg>
                Поделиться
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item delete-item" @click="deleteProject(project)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4H14M6 4V2.66667C6 2.31304 6.14048 1.97391 6.39052 1.72386C6.64057 1.47381 6.97971 1.33333 7.33333 1.33333H8.66667C9.02029 1.33333 9.35943 1.47381 9.60948 1.72386C9.85952 1.97391 10 2.31304 10 2.66667V4M12.6667 4V12.6667C12.6667 13.0203 12.5262 13.3594 12.2761 13.6095C12.0261 13.8595 11.6869 14 11.3333 14H4.66667C4.31304 14 3.97391 13.8595 3.72386 13.6095C3.47381 13.3594 3.33333 13.0203 3.33333 12.6667V4H12.6667Z" stroke="currentColor" stroke-width="1.2"/>
                </svg>
                Удалить
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <path d="M40 20V60M20 40H60M40 70C56.5685 70 70 56.5685 70 40C70 23.4315 56.5685 10 40 10C23.4315 10 10 23.4315 10 40C10 56.5685 23.4315 70 40 70Z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </div>
        <h3>Нет проектов</h3>
        <p class="empty-text">
          {{ searchQuery ? 'Попробуйте другой поисковый запрос' : 'У вас пока нет проектов' }}
        </p>
        <button class="btn-primary-empty" @click="createNewProject">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Создать проект
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="projectsStore.hasMore && filteredProjects.length > 0" class="pagination">
        <button
          class="btn-load-more"
          @click="loadMore"
          :disabled="projectsStore.isLoading"
        >
          <span v-if="!projectsStore.isLoading">Загрузить еще</span>
          <div v-else class="spinner-small"></div>
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});

const projectsStore = useProjectsStore();
const searchQuery = ref('');
const searchDebounce = ref<NodeJS.Timeout | null>(null);
const showFilters = ref(false);
const activeMenuId = ref<string | null>(null);

const filters = ref({
  status: '',
  dateRange: '',
  sortBy: 'newest'
});

// Computed stats
const totalProjects = computed(() => projectsStore.projects.length);
const activeProjects = computed(() => projectsStore.projects.filter(p => p.status === 'active').length);
const completedProjects = computed(() => projectsStore.projects.filter(p => p.status === 'completed').length);
const pendingProjects = computed(() => projectsStore.projects.filter(p => p.status === 'pending').length);

// Filtered and sorted projects
const filteredProjects = computed(() => {
  let projects = [...projectsStore.projects];
  
  // Filter by search query
  if (searchQuery.value) {
    projects = projects.filter(p => 
      p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.shortDescription?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  // Filter by status
  if (filters.value.status) {
    projects = projects.filter(p => p.status === filters.value.status);
  }
  
  // Filter by date range
  if (filters.value.dateRange) {
    const now = new Date();
    const range = filters.value.dateRange;
    projects = projects.filter(p => {
      const date = new Date(p.createdAt);
      switch(range) {
        case 'week':
          return date > new Date(now.setDate(now.getDate() - 7));
        case 'month':
          return date > new Date(now.setMonth(now.getMonth() - 1));
        case 'year':
          return date > new Date(now.setFullYear(now.getFullYear() - 1));
        default:
          return true;
      }
    });
  }
  
  // Sort
  switch(filters.value.sortBy) {
    case 'newest':
      projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'oldest':
      projects.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'name':
      projects.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
  
  return projects;
});

onMounted(async () => {
  await projectsStore.loadProjects(1);
  
  // Close menu when clicking outside
  document.addEventListener('click', () => {
    activeMenuId.value = null;
  });
});

const handleSearch = () => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value);
  }

  searchDebounce.value = setTimeout(async () => {
    await projectsStore.search(searchQuery.value);
  }, 300);
};

const loadMore = async () => {
  await projectsStore.loadProjects(projectsStore.page + 1);
};

const applyFilters = () => {
  // Filters are applied automatically via computed
};

const clearFilters = () => {
  filters.value = {
    status: '',
    dateRange: '',
    sortBy: 'newest'
  };
  searchQuery.value = '';
  showFilters.value = false;
};

const toggleProjectMenu = (projectId: string) => {
  activeMenuId.value = activeMenuId.value === projectId ? null : projectId;
};

const editProject = (project: any) => {
  navigateTo(`/projects/${project.id}/edit`);
};

const shareProject = (project: any) => {
  navigator.clipboard.writeText(`${window.location.origin}/projects/${project.id}`);
  // Show toast notification
};

const deleteProject = async (project: any) => {
  if (confirm('Вы уверены, что хотите удалить этот проект?')) {
    await projectsStore.deleteProject(project.id);
  }
};

const createNewProject = () => {
  navigateTo('/projects/create');
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'Дата не указана';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'Активный',
    completed: 'Завершен',
    pending: 'Ожидает'
  };
  return statusMap[status] || status;
};

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    active: 'status-active',
    completed: 'status-completed',
    pending: 'status-pending'
  };
  return classMap[status] || '';
};

useHead({
  title: 'Проекты - AirBorn',
});
</script>

<style scoped>
.projects-page {
  max-width: 1400px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 14px;
  color: #64748b;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* Search Box */
.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 16px;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-box svg {
  color: #94a3b8;
}

.search-input {
  border: none;
  background: none;
  outline: none;
  font-size: 14px;
  width: 240px;
  color: #1e293b;
}

.search-input::placeholder {
  color: #94a3b8;
}

/* Filter Button */
.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-1px);
}

/* Filters Panel */
.filters-panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 28px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.filters-actions {
  text-align: right;
}

.btn-clear {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
}

.btn-clear:hover {
  color: #2563eb;
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border: 1px solid #eef2ff;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.blue {
  background: #eff6ff;
  color: #3b82f6;
}

.stat-icon.green {
  background: #d1fae5;
  color: #10b981;
}

.stat-icon.purple {
  background: #f3e8ff;
  color: #a855f7;
}

.stat-icon.orange {
  background: #ffedd5;
  color: #f97316;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 28px;
  margin-bottom: 40px;
}

.project-card {
  position: relative;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #eef2ff;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.project-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-active .project-badge {
  background: #d1fae5;
  color: #10b981;
}

.status-completed .project-badge {
  background: #e0e7ff;
  color: #6366f1;
}

.status-pending .project-badge {
  background: #ffedd5;
  color: #f59e0b;
}

.project-images {
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.project-images img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.project-card:hover .project-images img {
  transform: scale(1.05);
}

.project-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}

.project-content {
  padding: 20px;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.project-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  flex: 1;
}

.project-menu {
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: #94a3b8;
}

.project-menu:hover {
  background: #f1f5f9;
  color: #475569;
}

.project-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  font-weight: 500;
  color: #3b82f6;
}

.project-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
}

.meta-item svg {
  color: #cbd5e1;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #3b82f6;
  text-decoration: none;
  transition: all 0.2s ease;
}

.project-link:hover {
  gap: 12px;
  color: #2563eb;
}

/* Project Dropdown Menu */
.project-dropdown {
  position: absolute;
  top: 60px;
  right: 16px;
  background: white;
  border-radius: 12px;
  padding: 8px;
  min-width: 180px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 10;
  border: 1px solid #e2e8f0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  color: #1e293b;
}

.dropdown-item:hover {
  background: #f8fafc;
}

.dropdown-item svg {
  color: #64748b;
}

.dropdown-item:hover svg {
  color: #3b82f6;
}

.delete-item {
  color: #ef4444;
}

.delete-item svg {
  color: #ef4444;
}

.delete-item:hover {
  background: #fef2f2;
}

.dropdown-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 8px 0;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 80px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 20px;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 80px;
  color: #cbd5e1;
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.empty-text {
  color: #64748b;
  margin-bottom: 24px;
}

.btn-primary-empty {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary-empty:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  transform: translateY(-2px);
}

/* Pagination */
.pagination {
  text-align: center;
  padding: 20px 0;
}

.btn-load-more {
  padding: 12px 32px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-load-more:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-1px);
}

.btn-load-more:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Animations */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .search-box {
    flex: 1;
  }
  
  .search-input {
    width: 100%;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .project-meta {
    flex-wrap: wrap;
  }
}
</style>