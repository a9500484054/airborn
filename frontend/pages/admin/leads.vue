<template>
  <NuxtLayout name="authenticated">
    <div class="admin-leads-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Управление заявками</h1>
          <p class="page-subtitle">Просмотр и обработка обращений клиентов</p>
        </div>
        <div class="header-right">
          <div class="stats-badge">
            <div class="stats-badge-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2V4M9 14V16M2 9H4M14 9H16M14.5 3.5L13 5M3.5 3.5L5 5M3.5 14.5L5 13M14.5 14.5L13 13M9 5C6.79086 5 5 6.79086 5 9C5 11.2091 6.79086 13 9 13C11.2091 13 13 11.2091 13 9C13 6.79086 11.2091 5 9 5Z" stroke="currentColor" stroke-width="1.2"/>
              </svg>
            </div>
            <div class="stats-badge-info">
              <span class="stats-badge-value">{{ totalLeads }}</span>
              <span class="stats-badge-label">всего заявок</span>
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

      <!-- Status Filters -->
      <div class="status-filters">
        <button 
          v-for="filter in statusFilters" 
          :key="filter.value"
          class="filter-btn" 
          :class="{ active: activeStatusFilter === filter.value }"
          @click="setStatusFilter(filter.value)"
        >
          <span class="filter-dot" :class="filter.color"></span>
          {{ filter.label }}
          <span class="filter-count">{{ getStatusCount(filter.value) }}</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Загрузка заявок...</p>
      </div>

      <!-- Leads List -->
      <div v-else-if="filteredLeads.length" class="leads-list">
        <div
          v-for="lead in filteredLeads"
          :key="lead.id"
          class="lead-card"
          :class="`status-${lead.status}`"
        >
          <div class="lead-header">
            <div class="lead-info">
              <div class="lead-avatar">
                {{ getInitials(lead.name) }}
              </div>
              <div class="lead-details">
                <h3 class="lead-name">{{ lead.name }}</h3>
                <div class="lead-contact">
                  <a :href="`mailto:${lead.email}`" class="contact-link">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.33333 2.33333H11.6667C12.5833 2.33333 13.3333 3.08333 13.3333 4V10C13.3333 10.9167 12.5833 11.6667 11.6667 11.6667H2.33333C1.41667 11.6667 0.666667 10.9167 0.666667 10V4C0.666667 3.08333 1.41667 2.33333 2.33333 2.33333Z" stroke="currentColor" stroke-width="1.2"/>
                      <path d="M13.3333 4L7 8L0.666667 4" stroke="currentColor" stroke-width="1.2"/>
                    </svg>
                    {{ lead.email }}
                  </a>
                  <a :href="`tel:${lead.phone}`" class="contact-link">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M12.8333 10.0833V12.5C12.8338 12.789 12.7651 13.074 12.6334 13.3299C12.5016 13.5858 12.3108 13.8049 12.0776 13.9692C11.8444 14.1336 11.5758 14.2385 11.2944 14.2757C11.0131 14.3128 10.7274 14.2813 10.4582 14.1833C7.57174 13.2007 4.97045 11.5151 2.8915 9.275C0.67848 7.1732 1.00912 4.56192 0.0415039 1.65833C-0.0542825 1.39193 -0.0850538 1.10596 -0.048224 0.825159C-0.0113942 0.544358 0.0920269 0.276176 0.254283 0.0429534C0.41654 -0.190269 0.633005 -0.381923 0.886092 -0.515292C1.13918 -0.648661 1.4215 -0.71977 1.70817 -0.722916H4.12484C4.45784 -0.724821 4.78118 -0.620543 5.04839 -0.425752C5.3156 -0.23096 5.51324 0.0440289 5.61234 0.358332C5.80602 0.998109 6.07202 1.61353 6.404 2.19167C6.58234 2.50452 6.66562 2.86214 6.64432 3.22062C6.62302 3.57909 6.49817 3.92375 6.28734 4.2125L5.354 5.4375C6.46674 7.3462 8.06734 8.86094 10.0123 9.85417L11.2623 8.95833C11.549 8.7546 11.8901 8.63379 12.2438 8.61173C12.5975 8.58966 12.9502 8.66719 13.2582 8.83542C13.8497 9.16889 14.4738 9.44681 15.1248 9.66667C15.4433 9.76707 15.7212 9.96692 15.9165 10.2372C16.1118 10.5075 16.2143 10.8345 16.2082 11.1688V14.3333H16.2082Z" stroke="currentColor" stroke-width="1.2"/>
                    </svg>
                    {{ lead.phone }}
                  </a>
                </div>
              </div>
            </div>
            <div class="lead-status">
              <select
                :value="lead.status"
                class="status-select"
                :class="`status-${lead.status}`"
                @change="updateStatus(lead.id, ($event.target as HTMLSelectElement).value)"
              >
                <option value="new">🆕 Новый</option>
                <option value="processed">✅ Обработан</option>
                <option value="closed">🔒 Закрыт</option>
              </select>
            </div>
          </div>
          
          <div class="lead-body">
            <div v-if="lead.comment" class="lead-comment">
              <div class="comment-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2.66667 2.66667H13.3333C14.0667 2.66667 14.6667 3.26667 14.6667 4V12C14.6667 12.7333 14.0667 13.3333 13.3333 13.3333H2.66667C1.93333 13.3333 1.33333 12.7333 1.33333 12V4C1.33333 3.26667 1.93333 2.66667 2.66667 2.66667Z" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M14.6667 4L8 8.66667L1.33333 4" stroke="currentColor" stroke-width="1.2"/>
                </svg>
              </div>
              <div class="comment-content">
                <span class="comment-label">Комментарий:</span>
                <p class="comment-text">{{ lead.comment }}</p>
              </div>
            </div>
            
            <div class="lead-meta">
              <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M11.6667 2.33333H2.33333C1.59695 2.33333 1 2.93029 1 3.66667V11.6667C1 12.403 1.59695 13 2.33333 13H11.6667C12.403 13 13 12.403 13 11.6667V3.66667C13 2.93029 12.403 2.33333 11.6667 2.33333Z" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M4.66667 1V3.66667M9.33333 1V3.66667M1 6.33333H13" stroke="currentColor" stroke-width="1.2"/>
                </svg>
                <span>{{ formatDate(lead.createdAt) }}</span>
              </div>
              <div v-if="lead.ipAddress" class="meta-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="2" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M7 1V2M7 12V13M1 7H2M12 7H13M12.5 1.5L11.5 2.5M1.5 1.5L2.5 2.5M1.5 12.5L2.5 11.5M12.5 12.5L11.5 11.5" stroke="currentColor" stroke-width="1.2"/>
                </svg>
                <span>IP: {{ lead.ipAddress }}</span>
              </div>
            </div>
          </div>
          
          <div class="lead-footer">
            <button class="action-btn" @click="viewLeadDetails(lead)">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3C3 3 1 8 1 8C1 8 3 13 8 13C13 13 15 8 15 8C15 8 13 3 8 3Z" stroke="currentColor" stroke-width="1.2"/>
                <circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.2"/>
              </svg>
              Подробнее
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            class="pagination-btn"
            :disabled="currentPage === 1"
            @click="loadLeads(currentPage - 1)"
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
            @click="loadLeads(currentPage + 1)"
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
            <rect x="20" y="20" width="40" height="40" rx="5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M30 35H50M30 45H40" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <h3>Нет заявок</h3>
        <p class="empty-text">Заявки из контактной формы появятся здесь</p>
      </div>

      <!-- Lead Details Modal -->
      <transition name="modal">
        <div v-if="selectedLead" class="modal-overlay" @click="selectedLead = null">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3 class="modal-title">Детали заявки</h3>
              <button class="modal-close" @click="selectedLead = null">✕</button>
            </div>
            <div class="modal-body">
              <div class="detail-row">
                <span class="detail-label">Имя:</span>
                <span class="detail-value">{{ selectedLead.name }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <a :href="`mailto:${selectedLead.email}`" class="detail-link">{{ selectedLead.email }}</a>
              </div>
              <div class="detail-row">
                <span class="detail-label">Телефон:</span>
                <a :href="`tel:${selectedLead.phone}`" class="detail-link">{{ selectedLead.phone }}</a>
              </div>
              <div v-if="selectedLead.comment" class="detail-row">
                <span class="detail-label">Комментарий:</span>
                <p class="detail-text">{{ selectedLead.comment }}</p>
              </div>
              <div class="detail-row">
                <span class="detail-label">Статус:</span>
                <span class="detail-badge" :class="`status-${selectedLead.status}`">
                  {{ getStatusText(selectedLead.status) }}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Дата создания:</span>
                <span class="detail-value">{{ formatDate(selectedLead.createdAt) }}</span>
              </div>
              <div v-if="selectedLead.ipAddress" class="detail-row">
                <span class="detail-label">IP адрес:</span>
                <span class="detail-value">{{ selectedLead.ipAddress }}</span>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-close" @click="selectedLead = null">Закрыть</button>
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

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  comment?: string;
  status: 'new' | 'processed' | 'closed';
  ipAddress?: string;
  createdAt: string;
}

const config = useRuntimeConfig();
const authStore = useAuthStore();

const leads = ref<Lead[]>([]);
const isLoading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const activeStatusFilter = ref<string>('all');
const selectedLead = ref<Lead | null>(null);

const statusFilters = [
  { value: 'all', label: 'Все', color: 'gray' },
  { value: 'new', label: 'Новые', color: 'blue' },
  { value: 'processed', label: 'Обработанные', color: 'green' },
  { value: 'closed', label: 'Закрытые', color: 'gray' }
];

const filteredLeads = computed(() => {
  if (activeStatusFilter.value === 'all') {
    return leads.value;
  }
  return leads.value.filter(lead => lead.status === activeStatusFilter.value);
});

const totalLeads = computed(() => leads.value.length);

const getStatusCount = (status: string) => {
  if (status === 'all') return leads.value.length;
  return leads.value.filter(lead => lead.status === status).length;
};

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    new: 'Новый',
    processed: 'Обработан',
    closed: 'Закрыт'
  };
  return map[status] || status;
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

onMounted(async () => {
  await loadLeads(1);
});

const loadLeads = async (page: number) => {
  isLoading.value = true;

  try {
    const { data } = await useFetch(
      `${config.public.apiUrl}/leads?page=${page}&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    if (data.value) {
      const response = data.value as any;
      leads.value = response.data.data;
      currentPage.value = response.data.meta.page;
      totalPages.value = response.data.meta.totalPages;
    }
  } catch (error) {
    console.error('Failed to load leads:', error);
  } finally {
    isLoading.value = false;
  }
};

const setStatusFilter = (status: string) => {
  activeStatusFilter.value = status;
};

const updateStatus = async (leadId: string, newStatus: string) => {
  try {
    await useFetch(`${config.public.apiUrl}/leads/${leadId}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      body: { status: newStatus },
    });

    // Update local state
    const lead = leads.value.find(l => l.id === leadId);
    if (lead) {
      lead.status = newStatus as any;
    }
  } catch (error) {
    alert('Не удалось обновить статус');
  }
};

const viewLeadDetails = (lead: Lead) => {
  selectedLead.value = lead;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Только что';
  if (diffMins < 60) return `${diffMins} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  if (diffDays === 1) return 'Вчера';
  if (diffDays < 7) return `${diffDays} дн назад`;
  
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

useHead({
  title: 'Управление заявками - AirBorn',
});
</script>

<style scoped>
.admin-leads-page {
  max-width: 1200px;
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
  gap: 20px;
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

/* Status Filters */
.status-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.filter-btn.active {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #3b82f6;
}

.filter-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.filter-dot.blue { background: #3b82f6; }
.filter-dot.green { background: #10b981; }
.filter-dot.gray { background: #94a3b8; }

.filter-count {
  margin-left: 4px;
  padding: 2px 6px;
  background: #f1f5f9;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
}

.filter-btn.active .filter-count {
  background: #e0e7ff;
  color: #3b82f6;
}

/* Leads List */
.leads-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

.lead-card {
  background: white;
  border-radius: 20px;
  border: 1px solid #eef2ff;
  overflow: hidden;
  transition: all 0.3s ease;
}

.lead-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.lead-card.status-new {
  border-left: 4px solid #3b82f6;
}

.lead-card.status-processed {
  border-left: 4px solid #10b981;
}

.lead-card.status-closed {
  border-left: 4px solid #94a3b8;
}

.lead-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 16px;
}

.lead-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.lead-avatar {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
}

.lead-details {
  flex: 1;
}

.lead-name {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 6px;
}

.lead-contact {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s ease;
}

.contact-link:hover {
  color: #3b82f6;
}

.lead-status {
  flex-shrink: 0;
}

.status-select {
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.status-select.status-new {
  color: #3b82f6;
  border-color: #bfdbfe;
  background: #eff6ff;
}

.status-select.status-processed {
  color: #10b981;
  border-color: #a7f3d0;
  background: #d1fae5;
}

.status-select.status-closed {
  color: #64748b;
  border-color: #e2e8f0;
  background: #f8fafc;
}

.lead-body {
  padding: 20px 24px;
}

.lead-comment {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 16px;
}

.comment-icon {
  color: #94a3b8;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  display: block;
  margin-bottom: 4px;
}

.comment-text {
  font-size: 14px;
  color: #1e293b;
  line-height: 1.5;
  margin: 0;
}

.lead-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
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

.lead-footer {
  padding: 12px 24px 20px 24px;
  border-top: 1px solid #f1f5f9;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 500;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 6px 12px;
  border-radius: 8px;
}

.action-btn:hover {
  background: #eff6ff;
  gap: 12px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  border: 1px solid #eef2ff;
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
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease-out;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #94a3b8;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f1f5f9;
  color: #ef4444;
}

.modal-body {
  padding: 24px;
}

.detail-row {
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
}

.detail-label {
  width: 100px;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  flex-shrink: 0;
}

.detail-value {
  flex: 1;
  font-size: 14px;
  color: #0f172a;
}

.detail-link {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s ease;
}

.detail-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.detail-text {
  flex: 1;
  font-size: 14px;
  color: #0f172a;
  margin: 0;
  line-height: 1.5;
}

.detail-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.detail-badge.status-new {
  background: #eff6ff;
  color: #3b82f6;
}

.detail-badge.status-processed {
  background: #d1fae5;
  color: #10b981;
}

.detail-badge.status-closed {
  background: #f1f5f9;
  color: #64748b;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  text-align: right;
}

.btn-close {
  padding: 10px 24px;
  background: #f1f5f9;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background: #e2e8f0;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .lead-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .lead-info {
    width: 100%;
  }
  
  .lead-status {
    width: 100%;
  }
  
  .status-select {
    width: 100%;
  }
  
  .lead-contact {
    flex-direction: column;
    gap: 8px;
  }
  
  .lead-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .detail-row {
    flex-direction: column;
    gap: 4px;
  }
  
  .detail-label {
    width: auto;
  }
}

@media (max-width: 480px) {
  .status-filters {
    gap: 8px;
  }
  
  .filter-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .lead-avatar {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }
  
  .lead-name {
    font-size: 14px;
  }
  
  .contact-link {
    font-size: 12px;
  }
}
</style>