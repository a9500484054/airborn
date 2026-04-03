<template>
  <NuxtLayout name="authenticated">
    <div class="admin-users-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Управление пользователями</h1>
          <p class="page-subtitle">Управление учетными записями, ролями и правами доступа</p>
        </div>
        <div class="header-right">
          <button class="btn btn-primary" @click="showCreateModal = true">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 3.75V14.25M3.75 9H14.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Добавить пользователя
          </button>
          <div class="stats-badge">
            <div class="stats-badge-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 12C11.0711 12 12.75 10.3211 12.75 8.25C12.75 6.17893 11.0711 4.5 9 4.5C6.92893 4.5 5.25 6.17893 5.25 8.25C5.25 10.3211 6.92893 12 9 12Z" stroke="currentColor" stroke-width="1.2"/>
                <path d="M14.25 15.75C13.125 14.25 11.25 12.75 9 12.75C6.75 12.75 4.875 14.25 3.75 15.75" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                <circle cx="9" cy="9" r="7.5" stroke="currentColor" stroke-width="1.2"/>
              </svg>
            </div>
            <div class="stats-badge-info">
              <span class="stats-badge-value">{{ totalUsers }}</span>
            </div>
          </div>
          <NuxtLink to="/admin" class="back-link">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 14L6 9L11 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Назад
          </NuxtLink>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="search-section">
        <div class="search-box">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12.5 12.5L16.5 16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Поиск по имени или email..."
            @input="handleSearch"
          />
        </div>
        <!-- <div class="filter-group">
          <select v-model="roleFilter" class="filter-select" @change="applyFilters">
            <option value="">Все роли</option>
            <option value="user">Пользователи</option>
            <option value="admin">Администраторы</option>
          </select>
          <select v-model="statusFilter" class="filter-select" @change="applyFilters">
            <option value="">Все статусы</option>
            <option value="active">Активные</option>
            <option value="blocked">Заблокированные</option>
          </select>
        </div> -->
        <!-- Замените существующий filter-group на этот код -->
        <div class="filter-group">
          <!-- Кастомный Select для ролей -->
          <div class="custom-select" :class="{ open: isRoleDropdownOpen }">
            <button class="select-trigger" @click="toggleRoleDropdown" type="button">
              <span class="select-value">{{ getRoleLabel(roleFilter) }}</span>
              <svg class="select-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
            <div class="select-dropdown">
              <div 
                class="select-option" 
                :class="{ selected: roleFilter === '' }"
                @click="selectRole('')"
              >
                <span>Все роли</span>
                <svg v-if="roleFilter === ''" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L7 12L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <div 
                class="select-option" 
                :class="{ selected: roleFilter === 'user' }"
                @click="selectRole('user')"
              >
                <span>Пользователи</span>
                <svg v-if="roleFilter === 'user'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L7 12L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <div 
                class="select-option" 
                :class="{ selected: roleFilter === 'admin' }"
                @click="selectRole('admin')"
              >
                <span>Администраторы</span>
                <svg v-if="roleFilter === 'admin'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L7 12L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Кастомный Select для статусов -->
          <div class="custom-select" :class="{ open: isStatusDropdownOpen }">
            <button class="select-trigger" @click="toggleStatusDropdown" type="button">
              <span class="select-value">{{ getStatusLabel(statusFilter) }}</span>
              <svg class="select-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
            <div class="select-dropdown">
              <div 
                class="select-option" 
                :class="{ selected: statusFilter === '' }"
                @click="selectStatus('')"
              >
                <span>Все статусы</span>
                <svg v-if="statusFilter === ''" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L7 12L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <div 
                class="select-option" 
                :class="{ selected: statusFilter === 'active' }"
                @click="selectStatus('active')"
              >
                <span>🟢 Актив</span>
                <svg v-if="statusFilter === 'active'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L7 12L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <div 
                class="select-option" 
                :class="{ selected: statusFilter === 'blocked' }"
                @click="selectStatus('blocked')"
              >
                <span>🔴 Блок</span>
                <svg v-if="statusFilter === 'blocked'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L7 12L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Загрузка пользователей...</p>
      </div>

      <!-- Users Table -->
      <div v-else-if="filteredUsers.length" class="table-container">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Email</th>
                <th>Телефон</th>
                <th>Роль</th>
                <th>Статус</th>
                <th>Дата регистрации</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>
                  <div class="user-cell">
                    <div class="user-avatar" style="width: 170px;" :class="{ 'admin-avatar': user.role === 'admin' }">
                      {{ getUserInitials(user.name) }}
                    </div>
                    <div class="user-info">
                      <span class="user-name">{{ user.name }}</span>
                      <span class="user-id">ID: {{ user.id.slice(0, 8) }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <a :href="`mailto:${user.email}`" class="email-link">
                    {{ user.email }}
                  </a>
                </td>
                <td>
                  <span v-if="user.phone" class="phone-number" style="width: 134px;">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M10.5 9.5V10.5C10.5 10.7652 10.3946 11.0196 10.2071 11.2071C10.0196 11.3946 9.76522 11.5 9.5 11.5C8.0375 11.3863 6.63264 10.8679 5.4375 10C4.29781 9.15556 3.34444 8.20219 2.5 7.0625C1.63208 5.86736 1.11367 4.4625 1 3C1 2.73478 1.10536 2.48043 1.29289 2.29289C1.48043 2.10536 1.73478 2 2 2H3C3.26522 2 3.51957 2.10536 3.70711 2.29289C3.89464 2.48043 4 2.73478 4 3C4.00008 3.66677 4.09563 4.32941 4.28333 4.96667C4.3455 5.1861 4.33032 5.41958 4.24004 5.62957C4.14976 5.83955 3.98944 6.01216 3.7875 6.11875L2.925 6.5875C3.76443 8.04028 5.18444 9.19597 6.8375 9.7L7.30625 8.8375C7.41284 8.63556 7.58545 8.47524 7.79543 8.38496C8.00542 8.29468 8.2389 8.2795 8.45833 8.34167C9.09559 8.52937 9.75823 8.62492 10.425 8.625C10.6902 8.625 10.9446 8.73036 11.1321 8.91789C11.3196 9.10543 11.425 9.35978 11.425 9.625V10.625Z" stroke="currentColor" stroke-width="0.8"/>
                    </svg>
                    {{ user.phone || '—' }}
                  </span>
                </td>
                <td>
                  <div class="role-selector" :class="{ 'admin-mode': user.role === 'admin' }">
                    <select
                      :value="user.role"
                      class="role-select"
                      @change="updateUserRole(user.id, ($event.target as HTMLSelectElement).value)"
                    >
                      <option value="user">👤 Пользователь</option>
                      <option value="admin">⚙️ Администратор</option>
                    </select>
                  </div>
                </td>
                <td>
                  <div class="status-badge" :class="user.isBlocked ? 'status-blocked' : 'status-active'">
                    <span class="status-dot"></span>
                    <span>{{ user.isBlocked ? 'Заблокирован' : 'Активен' }}</span>
                  </div>
                </td>
                <td>
                  <div class="date-cell">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M10 2H2C1.44772 2 1 2.44772 1 3V10C1 10.5523 1.44772 11 2 11H10C10.5523 11 11 10.5523 11 10V3C11 2.44772 10.5523 2 10 2Z" stroke="currentColor" stroke-width="0.8"/>
                      <path d="M4 1V3M8 1V3M1 5H11" stroke="currentColor" stroke-width="0.8"/>
                    </svg>
                    <span>{{ formatDate(user.createdAt) }}</span>
                  </div>
                </td>
                <td>
                  <div class="actions-cell">
                    <button
                      class="action-btn"
                      :class="user.isBlocked ? 'unblock' : 'block'"
                      @click="toggleBlock(user)"
                      :title="user.isBlocked ? 'Разблокировать' : 'Заблокировать'"
                    >
                      <svg v-if="!user.isBlocked" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="2" y="5" width="10" height="7" rx="1" stroke="currentColor" stroke-width="1.2"/>
                        <path d="M4 5V3.5C4 2.67157 4.67157 2 5.5 2H8.5C9.32843 2 10 2.67157 10 3.5V5" stroke="currentColor" stroke-width="1.2"/>
                      </svg>
                      <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M11 2L3 12M3 2L11 12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                      </svg>
                      {{ user.isBlocked ? 'Разблок.' : 'Блок.' }}
                    </button>
                    <button
                      class="action-btn delete"
                      @click="deleteUser(user)"
                      title="Удалить"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 3.5H12M5.5 6.5V9.5M8.5 6.5V9.5M3.5 3.5L4 11.5C4 11.832 4.1317 12.1503 4.36612 12.3847C4.60054 12.6191 4.91884 12.7508 5.25083 12.7508H8.74917C9.08116 12.7508 9.39946 12.6191 9.63388 12.3847C9.8683 12.1503 10 11.832 10 11.5L10.5 3.5M5 3.5V2.5C5 2.23478 5.10536 1.98043 5.29289 1.79289C5.48043 1.60536 5.73478 1.5 6 1.5H8C8.26522 1.5 8.51957 1.60536 8.70711 1.79289C8.89464 1.98043 9 2.23478 9 2.5V3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            class="pagination-btn"
            :disabled="currentPage === 1"
            @click="loadUsers(currentPage - 1)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <div class="pagination-info">
            <span class="page-current">{{ currentPage }}</span>
            <span class="page-separator">/</span>
            <span class="page-total">{{ totalPages }}</span>
          </div>
          <button
            class="pagination-btn"
            :disabled="currentPage === totalPages"
            @click="loadUsers(currentPage + 1)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="30" r="12" stroke="currentColor" stroke-width="1.5"/>
            <path d="M20 65C23 55 30 48 40 48C50 48 57 55 60 65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="40" cy="40" r="35" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </div>
        <h3>Пользователи не найдены</h3>
        <p class="empty-text">
          {{ searchQuery ? 'Попробуйте другой поисковый запрос' : 'Нет зарегистрированных пользователей' }}
        </p>
      </div>

      <!-- Delete Confirmation Modal -->
      <transition name="modal">
        <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <div class="modal-icon delete-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6H5H21M8 6V5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H14C14.5304 3 15.0391 3.21071 15.4142 3.58579C15.7893 3.96086 16 4.46957 16 5V6M10 11V16M14 11V16M5 6H19V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <h3 class="modal-title">Удаление пользователя</h3>
            </div>
            <div class="modal-body">
              <p>Вы уверены, что хотите удалить пользователя <strong>{{ userToDelete?.name }}</strong>?</p>
              <p class="modal-warning">Это действие нельзя отменить. Все данные пользователя будут удалены.</p>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" @click="showDeleteModal = false">Отмена</button>
              <button class="btn-confirm-delete" @click="confirmDelete">Удалить</button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Create User Modal -->
      <transition name="modal">
        <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
          <div class="modal-content modal-large" @click.stop>
            <div class="modal-header">
              <div class="modal-icon create-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M16 12H12M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <h3 class="modal-title">Добавить пользователя</h3>
            </div>
            <div class="modal-body">
              <form @submit.prevent="createUser" class="create-form">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="name">Имя *</label>
                    <input
                      id="name"
                      v-model="createFormData.name"
                      type="text"
                      class="form-input"
                      placeholder="Иван Иванов"
                      required
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="email">Email *</label>
                    <input
                      id="email"
                      v-model="createFormData.email"
                      type="email"
                      class="form-input"
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="phone">Телефон</label>
                    <input
                      id="phone"
                      v-model="createFormData.phone"
                      type="tel"
                      class="form-input"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="role">Роль</label>
                    <select
                      id="role"
                      v-model="createFormData.role"
                      class="form-select"
                    >
                      <option value="user">Пользователь</option>
                      <option value="admin">Администратор</option>
                    </select>
                  </div>
                </div>
                <div v-if="createSuccess" class="alert-success">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 16C14.4183 16 18 12.4183 18 8C18 3.58172 14.4183 0 10 0C5.58172 0 2 3.58172 2 8C2 12.4183 5.58172 16 10 16Z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M6.5 8L9 10.5L13.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <span>Пользователь создан! Email с временным паролем отправлен.</span>
                </div>
                <div v-if="createError" class="alert-error">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M10 6V10M10 14H10.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <span>{{ createError }}</span>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" @click="showCreateModal = false">Отмена</button>
              <button class="btn-primary" @click="createUser" :disabled="isCreating">
                {{ isCreating ? 'Создание...' : 'Создать' }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  roles: ['admin'],
});

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
  createdAt: string;
}

const config = useRuntimeConfig();
const authStore = useAuthStore();

const users = ref<User[]>([]);
const isLoading = ref(false);
const searchQuery = ref('');
const roleFilter = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const totalUsers = ref(0);
const searchDebounce = ref<NodeJS.Timeout | null>(null);
const showDeleteModal = ref(false);
const userToDelete = ref<User | null>(null);

// Create user state
const showCreateModal = ref(false);
const isCreating = ref(false);
const createSuccess = ref(false);
const createError = ref('');

const createFormData = ref({
  name: '',
  email: '',
  phone: '',
  role: 'user' as 'user' | 'admin',
});

const filteredUsers = computed(() => {
  let filtered = users.value;
  
  if (roleFilter.value) {
    filtered = filtered.filter(u => u.role === roleFilter.value);
  }
  
  if (statusFilter.value === 'active') {
    filtered = filtered.filter(u => !u.isBlocked);
  } else if (statusFilter.value === 'blocked') {
    filtered = filtered.filter(u => u.isBlocked);
  }
  
  return filtered;
});

// Dropdown states
const isRoleDropdownOpen = ref(false);
const isStatusDropdownOpen = ref(false);

// Helper functions for custom selects
const getRoleLabel = (value: string) => {
  if (value === 'user') return '👤 Пользователи';
  if (value === 'admin') return '⚙️ Администраторы';
  return 'Все роли';
};

const getStatusLabel = (value: string) => {
  if (value === 'active') return '🟢 Активные';
  if (value === 'blocked') return '🔴 Заблокированные';
  return 'Все статусы';
};

const toggleRoleDropdown = () => {
  isRoleDropdownOpen.value = !isRoleDropdownOpen.value;
  isStatusDropdownOpen.value = false;
};

const toggleStatusDropdown = () => {
  isStatusDropdownOpen.value = !isStatusDropdownOpen.value;
  isRoleDropdownOpen.value = false;
};

const selectRole = (value: string) => {
  roleFilter.value = value;
  isRoleDropdownOpen.value = false;
  applyFilters();
};

const selectStatus = (value: string) => {
  statusFilter.value = value;
  isStatusDropdownOpen.value = false;
  applyFilters();
};

// Close dropdowns when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.custom-select')) {
    isRoleDropdownOpen.value = false;
    isStatusDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

onMounted(async () => {
  await loadUsers(1);
});

const loadUsers = async (page: number) => {
  isLoading.value = true;

  try {
    const searchParam = searchQuery.value ? `&search=${encodeURIComponent(searchQuery.value)}` : '';
    const { data } = await useFetch(
      `${config.public.apiUrl}/users?page=${page}&limit=20${searchParam}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    if (data.value) {
      const response = data.value as any;
      users.value = response.data.data;
      currentPage.value = response.data.meta.page;
      totalPages.value = response.data.meta.totalPages;
      totalUsers.value = response.data.meta.total;
    }
  } catch (error) {
    console.error('Failed to load users:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = () => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value);
  }

  searchDebounce.value = setTimeout(async () => {
    currentPage.value = 1;
    await loadUsers(1);
  }, 300);
};

const applyFilters = () => {
  // Filters are applied via computed
};

const updateUserRole = async (userId: string, newRole: string) => {
  if (!confirm(`Изменить роль пользователя на "${newRole === 'admin' ? 'Администратор' : 'Пользователь'}"?`)) return;

  try {
    await useFetch(`${config.public.apiUrl}/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      body: { role: newRole },
    });

    await loadUsers(currentPage.value);
  } catch (error) {
    alert('Не удалось изменить роль пользователя');
  }
};

const toggleBlock = async (user: User) => {
  const action = user.isBlocked ? 'Разблокировать' : 'Заблокировать';
  if (!confirm(`${action} пользователя ${user.name}?`)) return;

  try {
    await useFetch(`${config.public.apiUrl}/users/${user.id}/block`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      body: { isBlocked: !user.isBlocked },
    });

    await loadUsers(currentPage.value);
  } catch (error) {
    alert('Не удалось обновить статус пользователя');
  }
};

const deleteUser = async (user: User) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;
  
  try {
    await useFetch(`${config.public.apiUrl}/users/${userToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    showDeleteModal.value = false;
    userToDelete.value = null;
    await loadUsers(currentPage.value);
  } catch (error) {
    alert('Не удалось удалить пользователя');
  }
};

const createUser = async () => {
  isCreating.value = true;
  createError.value = '';
  createSuccess.value = false;

  try {
    const { data, error } = await useFetch(`${config.public.apiUrl}/auth/admin/create-user`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      body: createFormData.value,
    });

    if (error.value) {
      createError.value = error.value.data?.error?.message || 'Не удалось создать пользователя';
      return;
    }

    if (data.value) {
      createSuccess.value = true;
      // Reset form after 2 seconds and close modal
      setTimeout(() => {
        showCreateModal.value = false;
        createFormData.value = { name: '', email: '', phone: '', role: 'user' };
        createSuccess.value = false;
        loadUsers(1);
      }, 2000);
    }
  } catch (err) {
    createError.value = 'Произошла ошибка при создании пользователя';
  } finally {
    isCreating.value = false;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Вчера';
  if (diffDays < 7) return `${diffDays} дн назад`;
  
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getUserInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

useHead({
  title: 'Управление пользователями - AirBorn',
});
</script>

<style scoped>
.admin-users-page {
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

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stats-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stats-badge-icon {
  width: 32px;
  height: 32px;
  background: #eff6ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.stats-badge-info {
  display: flex;
  flex-direction: column;
}

.stats-badge-value {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}

.stats-badge-label {
  font-size: 11px;
  color: #64748b;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #475569;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.back-link:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateX(-2px);
}

/* Search Section */
.search-section {
  display: flex;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 16px;
  transition: all 0.2s ease;
}

.search-box:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-box svg {
  color: #94a3b8;
}

.search-input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 14px;
  color: #1e293b;
}

.search-input::placeholder {
  color: #94a3b8;
}

.filter-group {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
}

/* Table Container */
.table-container {
  background: white;
  border-radius: 20px;
  border: 1px solid #eef2ff;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

.data-table th {
  background: #f8fafc;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
}

.data-table tbody tr:hover {
  background: #f8fafc;
}

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.user-avatar.admin-avatar {
  background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #0f172a;
  font-size: 14px;
  margin-bottom: 2px;
}

.user-id {
  font-size: 11px;
  color: #94a3b8;
}

/* Email Link */
.email-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s ease;
}

.email-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* Phone Number */
.phone-number {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.phone-number svg {
  color: #94a3b8;
}

/* Role Selector */
.role-selector {
  position: relative;
}

.role-select {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-select:hover {
  border-color: #3b82f6;
}

.role-selector.admin-mode .role-select {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #3b82f6;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  width: fit-content;
}

.status-active {
  background: #d1fae5;
  color: #10b981;
}

.status-active .status-dot {
  background: #10b981;
}

.status-blocked {
  background: #fee2e2;
  color: #ef4444;
}

.status-blocked .status-dot {
  background: #ef4444;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

/* Date Cell */
.date-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
}

.date-cell svg {
  color: #94a3b8;
}

/* Actions Cell */
.actions-cell {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.action-btn.block {
  background: #fef2f2;
  color: #ef4444;
  border-color: #fee2e2;
}

.action-btn.block:hover {
  background: #fee2e2;
  transform: translateY(-1px);
}

.action-btn.unblock {
  background: #d1fae5;
  color: #10b981;
  border-color: #a7f3d0;
}

.action-btn.unblock:hover {
  background: #a7f3d0;
  transform: translateY(-1px);
}

.action-btn.delete {
  background: #fef2f2;
  color: #ef4444;
  border-color: #fee2e2;
  padding: 6px 10px;
}

.action-btn.delete:hover {
  background: #fee2e2;
  transform: translateY(-1px);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-top: 1px solid #f1f5f9;
  background: white;
}

.pagination-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: white;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #475569;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: scale(1.05);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-info {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 14px;
}

.page-current {
  font-weight: 600;
  color: #3b82f6;
}

.page-separator {
  color: #94a3b8;
}

.page-total {
  color: #64748b;
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

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  color: #cbd5e1;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.empty-text {
  color: #64748b;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 24px;
  max-width: 400px;
  width: 100%;
  animation: modalSlideIn 0.3s ease-out;
}

.modal-large {
  max-width: 500px;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 24px;
  text-align: center;
}

.modal-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-icon {
  background: #fef2f2;
  color: #ef4444;
}

.create-icon {
  background: #eff6ff;
  color: #3b82f6;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
}

.modal-body {
  padding: 0 24px 24px;
  text-align: center;
}

.modal-body p {
  color: #475569;
  margin-bottom: 12px;
}

.modal-warning {
  font-size: 13px;
  color: #ef4444;
  background: #fef2f2;
  padding: 12px;
  border-radius: 12px;
}

/* Create Form */
.create-form {
  text-align: left;
}

.form-row {
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-input,
.form-select {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
  color: #94a3b8;
}

.alert-success,
.alert-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  margin-top: 16px;
}

.alert-success {
  background: #d1fae5;
  color: #065f46;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
}

.btn-cancel,
.btn-confirm-delete {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-cancel {
  background: #f1f5f9;
  color: #475569;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-confirm-delete {
  background: #ef4444;
  color: white;
}

.btn-confirm-delete:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.btn-primary {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Create Form Styles */
.create-form {
  text-align: left;
}

.form-row {
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-input,
.form-select {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
  color: #94a3b8;
}

.alert-success,
.alert-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  margin-top: 16px;
}

.alert-success {
  background: #d1fae5;
  color: #065f46;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
}

.btn-primary {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Responsive */
@media (max-width: 1024px) {
  .table-container {
    overflow-x: auto;
  }
  
  .data-table {
    min-width: 900px;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .search-section {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-select {
    flex: 1;
  }
  
  .stats-badge {
    display: none;
  }
}

@media (max-width: 480px) {
  .modal-content {
    margin: 0 20px;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}

.admin-users-page {
  width: 100%;
  max-width: none;
  padding: 0 20px;
}

.table-container {
  background: white;
  border-radius: 20px;
  border: 1px solid #eef2ff;
  overflow: hidden;
  width: 100%;
}

.table-wrapper {
  overflow-x: auto;
  width: 100%;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

/* Custom Select Styles */
.custom-select {
  position: relative;
  min-width: 160px;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.select-trigger:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.custom-select.open .select-trigger {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-arrow {
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.custom-select.open .select-arrow {
  transform: rotate(180deg);
}

.select-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all 0.2s ease;
}

.custom-select.open .select-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.select-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  font-size: 14px;
  color: #1e293b;
  cursor: pointer;
  transition: background 0.2s ease;
}

.select-option:hover {
  background: #f8fafc;
}

.select-option.selected {
  background: #eff6ff;
  color: #3b82f6;
}

.select-option svg {
  color: #3b82f6;
}

@media (max-width: 768px) {
  .custom-select {
    min-width: 0;
    flex: 1;
  }
  
  .select-trigger {
    font-size: 13px;
    padding: 8px 12px;
  }
  
  .select-option {
    font-size: 13px;
    padding: 8px 12px;
  }
}
</style>