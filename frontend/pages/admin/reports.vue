<template>
  <NuxtLayout name="authenticated">
    <div class="admin-reports-page">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <div class="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="2" width="18" height="20" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M8 6H16M8 10H16M8 14H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="header-info">
            <h1 class="page-title">Все отчёты</h1>
            <p class="page-subtitle">Администрирование табеля учёта времени</p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-card">
        <div class="filters-grid">
          <div class="filter-group">
            <label class="filter-label">Поиск по пользователю</label>
            <input
              v-model="filters.search"
              type="text"
              class="filter-input"
              placeholder="Имя пользователя..."
              @input="debounceSearch"
            />
          </div>

          <div class="filter-group">
            <label class="filter-label">Поиск по объекту</label>
            <input
              v-model="filters.object"
              type="text"
              class="filter-input"
              placeholder="Название объекта..."
              @input="debounceSearch"
            />
          </div>

          <div class="filter-group">
            <label class="filter-label">Дата от</label>
            <input
              v-model="filters.dateFrom"
              type="date"
              class="filter-input"
              @change="applyFilters"
            />
          </div>

          <div class="filter-group">
            <label class="filter-label">Дата до</label>
            <input
              v-model="filters.dateTo"
              type="date"
              class="filter-input"
              @change="applyFilters"
            />
          </div>
        </div>

        <div class="filters-actions">
          <button class="btn-reset" @click="resetFilters">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Сбросить
          </button>
        </div>
      </div>

      <!-- Reports Table -->
      <div class="table-card">
        <div v-if="isLoading" class="loading-state">
          <div class="spinner-large"></div>
          <span>Загрузка отчётов...</span>
        </div>

        <div v-else-if="reports.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect x="12" y="8" width="40" height="48" rx="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path d="M24 20H40M24 28H40M24 36H32" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <h3>Нет отчётов</h3>
          <p>По заданным фильтрам отчёты не найдены</p>
        </div>

        <div v-else class="table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Дата</th>
                <th>Объект</th>
                <th>Часы</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in reports" :key="report.id">
                <td class="user-cell">
                  <div class="user-info">
                    <div class="user-avatar-sm">
                      {{ getUserInitials(report.user?.name || 'Unknown') }}
                    </div>
                    <span class="user-name">{{ report.user?.name || 'Unknown' }}</span>
                  </div>
                </td>
                <td>{{ formatDate(report.date) }}</td>
                <td class="object-cell">{{ report.object }}</td>
                <td class="hours-cell">
                  <span class="hours-badge">{{ report.hours }} ч</span>
                </td>
                <td>
                  <div class="actions-cell">
                    <button class="btn-edit" @click="openEditModal(report)">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M10.5 1.5L12.5 3.5M2 12L2.5 9.5L10 2L12 4L4.5 11.5L2 12Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <button class="btn-delete" @click="confirmDelete(report.id)">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 4H12M5.5 4V2.83333C5.5 2.50684 5.63129 2.19375 5.86492 1.96306C6.09855 1.73237 6.41558 1.6 6.75 1.6H7.25C7.58442 1.6 7.90145 1.73237 8.13508 1.96306C8.36871 2.19375 8.5 2.50684 8.5 2.83333V4M11 4V11.1667C11 11.4932 10.8687 11.8062 10.6351 12.0369C10.4014 12.2676 10.0844 12.4 9.75 12.4H4.25C3.91558 12.4 3.59855 12.2676 3.36492 12.0369C3.13129 11.8062 3 11.4932 3 11.1667V4H11Z" stroke="currentColor" stroke-width="1.2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="pagination">
          <button
            class="pagination-btn"
            :disabled="pagination.page === 1"
            @click="loadReports(pagination.page - 1)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <div class="pagination-pages">
            <button
              v-for="page in visiblePages"
              :key="page"
              class="pagination-page-btn"
              :class="{ active: page === pagination.page }"
              @click="loadReports(page)"
            >
              {{ page }}
            </button>
          </div>
          <button
            class="pagination-btn"
            :disabled="pagination.page === pagination.totalPages"
            @click="loadReports(pagination.page + 1)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Edit Modal -->
      <transition name="modal">
        <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h2 class="modal-title">Редактировать отчёт</h2>
              <button class="modal-close" @click="closeEditModal">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M1 1L19 19M19 1L1 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>

            <form @submit.prevent="submitEdit" class="edit-form">
              <div class="form-group">
                <label class="form-label">Дата</label>
                <input
                  v-model="editForm.date"
                  type="date"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Объект</label>
                <input
                  v-model="editForm.object"
                  type="text"
                  class="form-input"
                  placeholder="Название объекта"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Часы</label>
                <input
                  v-model.number="editForm.hours"
                  type="number"
                  class="form-input"
                  min="0.5"
                  step="0.5"
                  required
                />
              </div>

              <div class="modal-actions">
                <button type="button" class="btn-cancel" @click="closeEditModal">Отмена</button>
                <button type="submit" class="btn-save" :disabled="isSaving">
                  {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>

      <!-- Delete Confirmation Modal -->
      <transition name="modal">
        <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
          <div class="modal-content" @click.stop>
            <div class="modal-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2"/>
                <path d="M16 16L32 32M32 16L16 32" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3 class="modal-title">Удалить отчёт?</h3>
            <p class="modal-text">Это действие нельзя отменить.</p>
            <div class="modal-actions">
              <button class="btn-cancel" @click="cancelDelete">Отмена</button>
              <button class="btn-confirm-delete" @click="executeDelete">Удалить</button>
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
});

const authStore = useAuthStore();
const config = useRuntimeConfig();

interface ReportUser {
  id: string;
  name: string;
  email: string;
}

interface Report {
  id: string;
  date: string;
  object: string;
  hours: number;
  user: ReportUser;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ReportsResponse {
  data: Report[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const reports = ref<Report[]>([]);
const isLoading = ref(false);
const isSaving = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const reportToEdit = ref<Report | null>(null);
const reportToDelete = ref<string | null>(null);

const filters = ref({
  search: '',
  object: '',
  dateFrom: '',
  dateTo: '',
});

const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
});

const editForm = ref({
  date: '',
  object: '',
  hours: 0.5,
});

let searchTimeout: NodeJS.Timeout | null = null;

// Debounce search
const debounceSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 500);
};

// Apply filters
const applyFilters = () => {
  loadReports(1);
};

// Reset filters
const resetFilters = () => {
  filters.value = {
    search: '',
    object: '',
    dateFrom: '',
    dateTo: '',
  };
  loadReports(1);
};

// Load reports
const loadReports = async (page: number = 1) => {
  isLoading.value = true;
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: pagination.value.limit.toString(),
    });

    if (filters.value.search) params.set('search', filters.value.search);
    if (filters.value.object) params.set('object', filters.value.object);
    if (filters.value.dateFrom) params.set('dateFrom', filters.value.dateFrom);
    if (filters.value.dateTo) params.set('dateTo', filters.value.dateTo);

    const { data } = await useFetch<ReportsResponse>(
      `${config.public.apiUrl}/admin/reports?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    if (data.value) {
      reports.value = data.value.data;
      pagination.value.page = data.value.meta.page;
      pagination.value.total = data.value.meta.total;
      pagination.value.totalPages = data.value.meta.totalPages;
    }
  } catch (error) {
    console.error('Failed to load reports:', error);
  } finally {
    isLoading.value = false;
  }
};

// Visible pages for pagination
const visiblePages = computed(() => {
  const pages: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, pagination.value.page - Math.floor(maxVisible / 2));
  let end = Math.min(pagination.value.totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// User initials
const getUserInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Edit modal
const openEditModal = (report: Report) => {
  reportToEdit.value = report;
  editForm.value = {
    date: report.date,
    object: report.object,
    hours: report.hours,
  };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  reportToEdit.value = null;
};

const submitEdit = async () => {
  if (!reportToEdit.value) return;

  isSaving.value = true;
  try {
    await useFetch(
      `${config.public.apiUrl}/admin/reports/${reportToEdit.value.id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm.value),
      }
    );

    closeEditModal();
    await loadReports(pagination.value.page);
  } catch (error) {
    console.error('Failed to update report:', error);
    alert('Ошибка при обновлении отчёта');
  } finally {
    isSaving.value = false;
  }
};

// Delete confirmation
const confirmDelete = (id: string) => {
  reportToDelete.value = id;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  reportToDelete.value = null;
};

const executeDelete = async () => {
  if (!reportToDelete.value) return;

  try {
    await useFetch(
      `${config.public.apiUrl}/admin/reports/${reportToDelete.value}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    await loadReports(pagination.value.page);
    cancelDelete();
  } catch (error) {
    console.error('Failed to delete report:', error);
    alert('Ошибка при удалении отчёта');
  }
};

// Initial load
onMounted(() => {
  loadReports(1);
});

useHead({
  title: 'Все отчёты - AirBorn',
});
</script>

<style scoped>
.admin-reports-page {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.header-info h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1a1f36;
  margin: 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 0 0;
}

/* Filters Card */
.filters-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-input {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s ease;
  background: #f9fafb;
}

.filter-input:focus {
  outline: none;
  border-color: #8b5cf6;
  background: white;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.filters-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-reset {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: #f3f4f6;
  color: #6b7280;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-reset:hover {
  background: #e5e7eb;
  color: #1f2937;
}

/* Table Card */
.table-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 4px 0;
}

.empty-state p {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table thead th {
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #f3f4f6;
}

.admin-table tbody td {
  padding: 14px 16px;
  font-size: 14px;
  color: #1f2937;
  border-bottom: 1px solid #f3f4f6;
}

.admin-table tbody tr:last-child td {
  border-bottom: none;
}

.admin-table tbody tr:hover {
  background: #f9fafb;
}

.user-cell .user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-name {
  font-weight: 500;
}

.object-cell {
  font-weight: 500;
}

.hours-cell {
  text-align: center;
}

.hours-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #f3e8ff;
  color: #8b5cf6;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit {
  background: #eff6ff;
  color: #3b82f6;
}

.btn-edit:hover {
  background: #dbeafe;
  transform: translateY(-1px);
}

.btn-delete {
  background: #fef2f2;
  color: #ef4444;
}

.btn-delete:hover {
  background: #fee2e2;
  transform: translateY(-1px);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
}

.pagination-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #8b5cf6;
  color: #8b5cf6;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 6px;
}

.pagination-page-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: #f9fafb;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.pagination-page-btn:hover {
  background: #f3f4f6;
}

.pagination-page-btn.active {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 28px;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1f36;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #ef4444;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.edit-form .form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edit-form .form-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.edit-form .form-input {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s ease;
  background: #f9fafb;
}

.edit-form .form-input:focus {
  outline: none;
  border-color: #8b5cf6;
  background: white;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-cancel {
  padding: 10px 24px;
  border-radius: 12px;
  background: #f3f4f6;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-save {
  padding: 10px 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Delete Modal */
.modal-icon {
  color: #ef4444;
  text-align: center;
  margin-bottom: 20px;
}

.modal-text {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin: 0 0 24px 0;
}

.btn-confirm-delete {
  padding: 10px 24px;
  border-radius: 12px;
  background: #ef4444;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-confirm-delete:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Spinner */
.spinner-large {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .admin-reports-page {
    padding: 0;
  }

  .page-header {
    margin-bottom: 24px;
  }

  .header-icon {
    width: 40px;
    height: 40px;
  }

  .header-info h1 {
    font-size: 20px;
  }

  .filters-card,
  .table-card {
    padding: 20px;
    border-radius: 16px;
  }

  .filters-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .admin-table thead th,
  .admin-table tbody td {
    padding: 10px 12px;
    font-size: 13px;
  }

  .pagination {
    flex-wrap: wrap;
  }
}
</style>
