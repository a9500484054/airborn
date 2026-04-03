<template>
  <NuxtLayout name="authenticated">
    <div class="report-page">
      <!-- Header -->
      <div class="report-header">
        <div class="header-left">
          <div class="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="2" width="18" height="20" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M8 6H16M8 10H16M8 14H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="header-info">
            <h1 class="page-title">Табель учёта времени</h1>
            <p class="page-subtitle">Отправляйте отчёты о рабочей деятельности</p>
          </div>
        </div>
      </div>

      <!-- Report Form -->
      <div class="report-form-card">
        <h2 class="form-title">Новый отчёт</h2>
        <form @submit.prevent="submitReport" class="report-form">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Дата</label>
              <input
                v-model="form.date"
                type="date"
                class="form-input"
                :max="todayDate"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Объект</label>
              <input
                v-model="form.object"
                type="text"
                class="form-input"
                placeholder="Название объекта"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Часы</label>
              <input
                v-model.number="form.hours"
                type="number"
                class="form-input"
                placeholder="0.5"
                min="0.5"
                step="0.5"
                required
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              <svg v-if="!isSubmitting" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <div v-else class="spinner"></div>
              {{ isSubmitting ? 'Отправка...' : 'Отправить' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Reports History -->
      <div class="reports-history-card">
        <div class="history-header">
          <h2 class="history-title">История отчётов</h2>
          <div class="history-pagination" v-if="pagination.totalPages > 1">
            <button
              class="pagination-btn"
              :disabled="pagination.page === 1"
              @click="loadReports(pagination.page - 1)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
            <span class="pagination-info">{{ pagination.page }} / {{ pagination.totalPages }}</span>
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
          <p>Вы ещё не отправляли отчётов</p>
        </div>

        <div v-else class="reports-table-wrapper">
          <table class="reports-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Объект</th>
                <th>Часы</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in reports" :key="report.id">
                <td>{{ formatDate(report.date) }}</td>
                <td class="object-cell">{{ report.object }}</td>
                <td class="hours-cell">
                  <span class="hours-badge">{{ report.hours }} ч</span>
                </td>
                <td>
                  <button class="btn-delete" @click="confirmDelete(report.id)">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4H14M6 4V2.66667C6 2.31304 6.14048 1.97391 6.39052 1.72386C6.64057 1.47381 6.97971 1.33333 7.33333 1.33333H8.66667C9.02029 1.33333 9.35943 1.47381 9.60948 1.72386C9.85952 1.97391 10 2.31304 10 2.66667V4M12.6667 4V12.6667C12.6667 13.0203 12.5262 13.3594 12.2761 13.6095C12.0261 13.8595 11.6869 14 11.3333 14H4.66667C4.31304 14 3.97391 13.8595 3.72386 13.6095C3.47381 13.3594 3.33333 13.0203 3.33333 12.6667V4H12.6667Z" stroke="currentColor" stroke-width="1.2"/>
                    </svg>
                    Удалить
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

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

interface Report {
  id: string;
  date: string;
  object: string;
  hours: number;
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
const isSubmitting = ref(false);
const showDeleteModal = ref(false);
const reportToDelete = ref<string | null>(null);

const form = ref({
  date: new Date().toISOString().split('T')[0],
  object: '',
  hours: 0.5,
});

const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
});

const todayDate = computed(() => new Date().toISOString().split('T')[0]);

// Load reports
const loadReports = async (page: number = 1) => {
  isLoading.value = true;
  try {
    const { data } = await useFetch<ReportsResponse>(
      `${config.public.apiUrl}/reports?page=${page}&limit=${pagination.value.limit}`,
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

// Submit report
const submitReport = async () => {
  if (!form.value.date || !form.value.object || !form.value.hours) return;

  isSubmitting.value = true;
  try {
    const { data } = await useFetch<Report>(
      `${config.public.apiUrl}/reports`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form.value),
      }
    );

    if (data.value) {
      // Reset form
      form.value.object = '';
      form.value.hours = 0.5;
      form.value.date = new Date().toISOString().split('T')[0];

      // Reload reports
      await loadReports(1);
    }
  } catch (error) {
    console.error('Failed to submit report:', error);
    alert('Ошибка при отправке отчёта');
  } finally {
    isSubmitting.value = false;
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
      `${config.public.apiUrl}/reports/${reportToDelete.value}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    // Reload reports
    await loadReports(pagination.value.page);
    cancelDelete();
  } catch (error) {
    console.error('Failed to delete report:', error);
    alert('Ошибка при удалении отчёта');
  }
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

// Initial load
onMounted(() => {
  loadReports(1);
});

useHead({
  title: 'Табель - AirBorn',
});
</script>

<style scoped>
.report-page {
  max-width: 1000px;
  margin: 0 auto;
}

/* Header */
.report-header {
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
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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

/* Form Card */
.report-form-card {
  background: white;
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1f36;
  margin: 0 0 24px 0;
}

.report-form .form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s ease;
  background: #f9fafb;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-submit {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* History Card */
.reports-history-card {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.history-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1f36;
  margin: 0;
}

.history-pagination {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
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
  border-color: #3b82f6;
  color: #3b82f6;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

/* Loading & Empty States */
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
.reports-table-wrapper {
  overflow-x: auto;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
}

.reports-table thead th {
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #f3f4f6;
}

.reports-table tbody td {
  padding: 14px 16px;
  font-size: 14px;
  color: #1f2937;
  border-bottom: 1px solid #f3f4f6;
}

.reports-table tbody tr:last-child td {
  border-bottom: none;
}

.reports-table tbody tr:hover {
  background: #f9fafb;
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
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.btn-delete {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #fef2f2;
  color: #ef4444;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-delete:hover {
  background: #fee2e2;
  transform: translateY(-1px);
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
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
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

.modal-icon {
  color: #ef4444;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1f36;
  margin: 0 0 12px 0;
}

.modal-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
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

/* Spinner */
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.spinner-large {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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

/* Responsive */
@media (max-width: 768px) {
  .report-page {
    padding: 0;
  }

  .report-header {
    margin-bottom: 24px;
  }

  .header-icon {
    width: 40px;
    height: 40px;
  }

  .header-info h1 {
    font-size: 20px;
  }

  .report-form-card,
  .reports-history-card {
    padding: 20px;
    border-radius: 16px;
  }

  .report-form .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .history-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .reports-table thead th,
  .reports-table tbody td {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
