<template>
  <NuxtLayout name="authenticated">
    <div class="dashboard-page">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="welcome-content">
          <h1 class="welcome-title">
            Добро пожаловать, <span class="welcome-name">{{ authStore.userName }}</span>!
          </h1>
          <p class="welcome-subtitle">
            Вот обзор вашей активности и последние обновления
          </p>
        </div>
        <div class="date-badge">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6.66667 1.66667V4.16667M13.3333 1.66667V4.16667M2.5 7.5H17.5M3.33333 3.33333H16.6667C17.5833 3.33333 18.3333 4.08333 18.3333 5V16.6667C18.3333 17.5833 17.5833 18.3333 16.6667 18.3333H3.33333C2.41667 18.3333 1.66667 17.5833 1.66667 16.6667V5C1.66667 4.08333 2.41667 3.33333 3.33333 3.33333Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>{{ currentDate }}</span>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Profile Card -->
        <div class="card profile-card">
          <div class="card-header">
            <h2 class="card-title">Профиль</h2>
            <NuxtLink to="/dashboard/profile" class="edit-link">
              Редактировать
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11.3333 2L14 4.66667M5.33333 13.3333L2 14L2.66667 10.6667L10.6667 2.66667L13.3333 5.33333L5.33333 13.3333Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
            </NuxtLink>
          </div>
          <div class="card-body">
            <div class="profile-header">
              <div class="profile-avatar">
                {{ authStore.userInitials }}
              </div>
              <div class="profile-info">
                <h3 class="profile-name">{{ authStore.user?.name }}</h3>
                <p class="profile-email">{{ authStore.user?.email }}</p>
                <div class="profile-badge" :class="`badge-${authStore.user?.role}`">
                  {{ authStore.user?.role === 'admin' ? 'Администратор' : 'Пользователь' }}
                </div>
              </div>
            </div>

            <div class="profile-details">
              <div class="detail-item">
                <div class="detail-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M16.5 12.75V15.75C16.5008 16.0488 16.4259 16.3433 16.2823 16.606C16.1386 16.8687 15.9308 17.0918 15.6778 17.2561C15.4248 17.4204 15.1345 17.521 14.8327 17.5494C14.5308 17.5777 14.2271 17.5331 13.9475 17.4194C10.9817 16.378 8.40744 14.5819 6.46405 12.185C4.54864 9.77029 3.3163 6.91248 2.87459 3.88217C2.83227 3.58849 2.86258 3.28865 2.9632 3.00863C3.06382 2.72861 3.23209 2.47694 3.45418 2.27546C3.67627 2.07398 3.9456 1.9291 4.23802 1.85347C4.53044 1.77784 4.83731 1.77358 5.13144 1.84103L8.13144 2.5247C8.38697 2.58282 8.61646 2.72154 8.78696 2.92091C8.95746 3.12028 9.06046 3.37001 9.08154 3.63427C9.12391 4.09264 9.22356 4.54277 9.37761 4.97219C9.50285 5.32188 9.52858 5.70024 9.45205 6.06338C9.37552 6.42652 9.20037 6.75983 8.94615 7.0235L8.29348 7.68591C9.07031 9.11003 10.2481 10.2866 11.6735 11.062L12.341 10.413C12.6043 10.1597 12.9369 9.98527 13.2993 9.90885C13.6616 9.83244 14.0392 9.85765 14.3885 9.98173C14.8227 10.1348 15.2781 10.2344 15.741 10.2776C16.0055 10.2987 16.2554 10.4019 16.4549 10.5727C16.6543 10.7435 16.7929 10.9733 16.8508 11.2291L17.5344 14.2291C17.6004 14.5217 17.5955 14.8269 17.5203 15.1177C17.4451 15.4085 17.3015 15.6765 17.1021 15.8978C16.9028 16.119 16.6538 16.2871 16.3766 16.3885C16.0995 16.4899 15.8027 16.5215 15.5114 16.481L15.5114 16.481Z" stroke="currentColor" stroke-width="1.2"/>
                  </svg>
                </div>
                <div>
                  <span class="detail-label">Телефон:</span>
                  <span class="detail-value">{{ authStore.user?.phone || 'Не указан' }}</span>
                </div>
              </div>
              <div class="detail-item">
                <div class="detail-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="currentColor" stroke-width="1.2"/>
                    <path d="M9 4.5V9L12 10.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                  </svg>
                </div>
                <div>
                  <span class="detail-label">Дата регистрации:</span>
                  <span class="detail-value">{{ formatDate(authStore.user?.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Overview -->
        <div class="card stats-overview">
          <div class="card-header">
            <h2 class="card-title">Статистика</h2>
          </div>
          <div class="card-body">
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-icon">📊</div>
                <div class="stat-content">
                  <div class="stat-value">0</div>
                  <div class="stat-label">Проектов</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">💬</div>
                <div class="stat-content">
                  <div class="stat-value">0</div>
                  <div class="stat-label">Сообщений</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">⏱️</div>
                <div class="stat-content">
                  <div class="stat-value">0</div>
                  <div class="stat-label">Часов работы</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">🏆</div>
                <div class="stat-content">
                  <div class="stat-value">0</div>
                  <div class="stat-label">Достижений</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card actions-card">
          <div class="card-header">
            <h2 class="card-title">Быстрые действия</h2>
          </div>
          <div class="card-body">
            <div class="actions-grid">
              <NuxtLink to="/projects" class="action-item">
                <div class="action-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </div>
                <span>Проекты</span>
              </NuxtLink>
              <NuxtLink to="/chat" class="action-item">
                <div class="action-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </div>
                <span>Чат</span>
              </NuxtLink>
              <template v-if="authStore.isAdmin">
                <NuxtLink to="/admin/users" class="action-item">
                  <div class="action-icon-wrapper">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="1.5"/>
                      <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1615 16.5523C21.6185 15.8519 20.8609 15.3516 20 15.13" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M16 3.13C16.8604 3.35031 17.6184 3.85071 18.1615 4.55132C18.7045 5.25192 18.9993 6.11304 19 6.99965C18.9993 7.88627 18.7045 8.74738 18.1615 9.44799C17.6184 10.1486 16.8604 10.649 16 10.8693" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                  </div>
                  <span>Пользователи</span>
                </NuxtLink>
                <NuxtLink to="/admin/projects" class="action-item">
                  <div class="action-icon-wrapper">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 4V20M20 12H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                  </div>
                  <span>Управление</span>
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card activity-card">
          <div class="card-header">
            <h2 class="card-title">Недавняя активность</h2>
            <button class="view-all-btn">
              Все записи
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="card-body">
            <div class="activity-empty">
              <div class="empty-icon">📭</div>
              <p class="empty-text">Пока нет активности</p>
              <p class="empty-subtext">Начните работать с проектами или напишите сообщение в чат</p>
            </div>
          </div>
        </div>

        <!-- Recent Projects -->
        <div class="card projects-card">
          <div class="card-header">
            <h2 class="card-title">Последние проекты</h2>
            <NuxtLink to="/projects" class="view-all-link">
              Все проекты
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </NuxtLink>
          </div>
          <div class="card-body">
            <div class="projects-empty">
              <div class="empty-icon">📂</div>
              <p class="empty-text">Нет активных проектов</p>
              <p class="empty-subtext">Ваши проекты появятся здесь после начала работы</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});

const authStore = useAuthStore();

const currentDate = computed(() => {
  return new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Не указано';
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

useHead({
  title: 'Дашборд - AirBorn',
});
</script>

<style scoped>
.dashboard-page {
  max-width: 1400px;
  margin: 0 auto;
}

/* Welcome Section */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.welcome-title {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.welcome-name {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-subtitle {
  color: #64748b;
  font-size: 14px;
}

.date-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border-radius: 12px;
  font-size: 14px;
  color: #475569;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.date-badge svg {
  color: #3b82f6;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Cards */
.card {
  background: white;
  border-radius: 20px;
  border: 1px solid #eef2ff;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.card-body {
  padding: 24px;
}

/* Profile Card */
.profile-card {
  grid-column: span 1;
}

.edit-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.edit-link:hover {
  gap: 8px;
  color: #2563eb;
}

.profile-header {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.profile-email {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
}

.profile-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-admin {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.badge-user {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.profile-details {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.detail-icon {
  width: 28px;
  height: 28px;
  background: #f8fafc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detail-icon svg {
  color: #3b82f6;
}

.detail-label {
  color: #64748b;
  font-size: 13px;
  margin-right: 8px;
}

.detail-value {
  color: #0f172a;
  font-size: 13px;
  font-weight: 500;
}

/* Stats Overview */
.stats-overview {
  grid-column: span 1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 16px;
  transition: all 0.2s ease;
}

.stat-item:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 28px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
}

/* Actions Card */
.actions-card {
  grid-column: span 1;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 12px;
  background: #f8fafc;
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.action-item:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  border-color: transparent;
}

.action-item:hover .action-icon-wrapper svg,
.action-item:hover span {
  color: white;
  stroke: white;
}

.action-icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon-wrapper svg {
  stroke: #3b82f6;
  transition: all 0.3s ease;
}

.action-item span {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  transition: all 0.3s ease;
}

/* Activity & Projects Cards */
.activity-card,
.projects-card {
  grid-column: span 1;
}

.view-all-btn,
.view-all-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #3b82f6;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.view-all-btn:hover,
.view-all-link:hover {
  gap: 8px;
  color: #2563eb;
}

.activity-empty,
.projects-empty {
  text-align: center;
  padding: 32px 16px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
  margin-bottom: 8px;
}

.empty-subtext {
  font-size: 12px;
  color: #94a3b8;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .dashboard-grid {
    gap: 20px;
  }
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .profile-card {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .welcome-title {
    font-size: 24px;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-card {
    grid-column: span 1;
  }
  
  .card-header {
    padding: 16px 20px;
  }
  
  .card-body {
    padding: 20px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .profile-avatar {
    width: 100px;
    height: 100px;
    font-size: 36px;
  }
  
  .profile-info {
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-item {
    justify-content: center;
  }
}
</style>