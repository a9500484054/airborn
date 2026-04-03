<template>
  <NuxtLayout name="authenticated">
    <div class="admin-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Админ-панель</h1>
          <p class="page-subtitle">Управление системой и пользователями</p>
        </div>
        <div class="admin-badge">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 12.5C12.0711 12.5 13.75 10.8211 13.75 8.75C13.75 6.67893 12.0711 5 10 5C7.92893 5 6.25 6.67893 6.25 8.75C6.25 10.8211 7.92893 12.5 10 12.5Z" stroke="currentColor" stroke-width="1.2"/>
            <path d="M15.5 16.25C14.5 15 12.5 13.75 10 13.75C7.5 13.75 5.5 15 4.5 16.25" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.2"/>
          </svg>
          <span>Администратор</span>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 20C20.4183 20 24 16.4183 24 12C24 7.58172 20.4183 4 16 4C11.5817 4 8 7.58172 8 12C8 16.4183 11.5817 20 16 20Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M4 28C5.5 25.5 10 22 16 22C22 22 26.5 25.5 28 28" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalUsers }}</div>
            <div class="stat-label">Всего пользователей</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.2"/>
              <path d="M8 8H16M8 12H13M8 16H10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalProjects }}</div>
            <div class="stat-label">Всего проектов</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M5 9L16 16L27 9M5 23V9L16 16L27 9V23M5 23H27M5 23L12 16M27 23L20 16" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.activeProjects }}</div>
            <div class="stat-label">Активных заявок</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="1.2"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalMessages }}</div>
            <div class="stat-label">Всего чатов</div>
          </div>
        </div>
      </div>

      <!-- Management Cards Grid -->
      <div class="admin-grid">
        <!-- Users Management Card -->
        <NuxtLink to="/admin/users" class="admin-card">
          <div class="card-icon-wrapper blue-bg">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 20C20.4183 20 24 16.4183 24 12C24 7.58172 20.4183 4 16 4C11.5817 4 8 7.58172 8 12C8 16.4183 11.5817 20 16 20Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M4 28C5.5 25.5 10 22 16 22C22 22 26.5 25.5 28 28" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="card-content">
            <h2 class="card-title">Пользователи</h2>
            <p class="card-description">Управление учетными записями, ролями и правами доступа</p>
            <div class="card-footer-admin">
              <span class="card-link">Управление →</span>
            </div>
          </div>
        </NuxtLink>

        <!-- Projects Management Card -->
        <NuxtLink to="/admin/projects" class="admin-card">
          <div class="card-icon-wrapper green-bg">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="6" y="10" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12 14H20M12 18H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M10 6H22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="card-content">
            <h2 class="card-title">Проекты</h2>
            <p class="card-description">Создание, редактирование и управление портфолио проектов</p>
            <div class="card-footer-admin">
              <span class="card-link">Управление →</span>
            </div>
          </div>
        </NuxtLink>

        <!-- Leads Management Card -->
        <NuxtLink to="/admin/leads" class="admin-card">
          <div class="card-icon-wrapper purple-bg">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M5 9L16 16L27 9M5 23V9L16 16L27 9V23M5 23H27M5 23L12 16M27 23L20 16" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="card-content">
            <h2 class="card-title">Заявки</h2>
            <p class="card-description">Просмотр и обработка контактных форм и заявок клиентов</p>
            <div class="card-footer-admin">
              <span class="card-link">Просмотр →</span>
            </div>
          </div>
        </NuxtLink>

        <!-- Settings Card -->
        <!-- <NuxtLink to="/admin/settings" class="admin-card">
          <div class="card-icon-wrapper orange-bg">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="4" stroke="currentColor" stroke-width="1.5"/>
              <path d="M23.5 9.5L25 11M6.5 21L8 22.5M25 21L23.5 22.5M8 9.5L6.5 11M9 4L11 5.5M21 5.5L23 4M11 26.5L9 28M23 28L21 26.5M4 11H5.5M26.5 11H28M4 21H5.5M26.5 21H28M11 4L9 2.5M21 2.5L23 4M9 29.5L11 28M23 28L21 26.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="card-content">
            <h2 class="card-title">Настройки</h2>
            <p class="card-description">Конфигурация системы, уведомления и общие настройки</p>
            <div class="card-footer-admin">
              <span class="card-link">Настроить →</span>
            </div>
          </div>
        </NuxtLink> -->
      </div>

      <!-- Recent Activity Section -->
      <!-- <div class="recent-activity">
        <div class="section-header">
          <h2 class="section-title">Последняя активность</h2>
          <button class="view-all-btn">
            Все действия
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </button>
        </div>
        <div class="activity-list">
          <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <div class="activity-icon" :class="activity.type">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path v-if="activity.type === 'user'" d="M10 12.5C12.0711 12.5 13.75 10.8211 13.75 8.75C13.75 6.67893 12.0711 5 10 5C7.92893 5 6.25 6.67893 6.25 8.75C6.25 10.8211 7.92893 12.5 10 12.5Z" stroke="currentColor" stroke-width="1.2"/>
                <path v-if="activity.type === 'project'" d="M4 4H16C17.1 4 18 4.9 18 6V14C18 15.1 17.1 16 16 16H4C2.9 16 2 15.1 2 14V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="1.2"/>
                <path v-if="activity.type === 'lead'" d="M2.5 6L10 10.5L17.5 6M2.5 14V6L10 10.5L17.5 6V14" stroke="currentColor" stroke-width="1.2"/>
              </svg>
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.text }}</p>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  roles: ['admin'],
});

// Mock data - replace with real API calls
const stats = ref({
  totalUsers: 156,
  totalProjects: 42,
  activeProjects: 28,
  totalMessages: 1243,
  unreadLeads: 8
});

const recentActivities = ref([
  {
    id: 1,
    type: 'user',
    text: 'Новый пользователь Иван Петров зарегистрировался',
    time: '5 минут назад'
  },
  {
    id: 2,
    type: 'project',
    text: 'Проект "Вентиляция ТЦ" был обновлен',
    time: '15 минут назад'
  },
  {
    id: 3,
    type: 'lead',
    text: 'Новая заявка от компании ООО "СтройИнвест"',
    time: '1 час назад'
  },
  {
    id: 4,
    type: 'user',
    text: 'Роль пользователя Елена Смирнова изменена на администратора',
    time: '3 часа назад'
  },
  {
    id: 5,
    type: 'project',
    text: 'Добавлен новый проект "Монтаж кондиционеров в бизнес-центре"',
    time: '5 часов назад'
  }
]);

useHead({
  title: 'Админ-панель - AirBorn',
});
</script>

<style scoped>
.admin-page {
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
  gap: 16px;
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

.admin-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f1f5f9;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
}

.admin-badge svg {
  color: #3b82f6;
}

/* Stats Overview */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
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
  width: 56px;
  height: 56px;
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

/* Admin Grid */
.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.admin-card {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 24px;
  background: white;
  border: 1px solid #eef2ff;
  border-radius: 24px;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.admin-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  border-color: #e0e7ff;
}

.card-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon-wrapper.blue-bg {
  background: #eff6ff;
  color: #3b82f6;
}

.card-icon-wrapper.green-bg {
  background: #d1fae5;
  color: #10b981;
}

.card-icon-wrapper.purple-bg {
  background: #f3e8ff;
  color: #a855f7;
}

.card-icon-wrapper.orange-bg {
  background: #ffedd5;
  color: #f97316;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.card-description {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 16px;
}

.card-footer-admin {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-link {
  font-size: 14px;
  font-weight: 500;
  color: #3b82f6;
  transition: all 0.2s ease;
}

.admin-card:hover .card-link {
  transform: translateX(4px);
}

.card-badge {
  padding: 4px 10px;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.card-badge.warning {
  background: #fef3c7;
  color: #d97706;
}

/* Recent Activity */
.recent-activity {
  background: white;
  border: 1px solid #eef2ff;
  border-radius: 24px;
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 500;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  gap: 10px;
  color: #2563eb;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.activity-item:hover {
  background: #f8fafc;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.user {
  background: #eff6ff;
  color: #3b82f6;
}

.activity-icon.project {
  background: #d1fae5;
  color: #10b981;
}

.activity-icon.lead {
  background: #fef3c7;
  color: #f59e0b;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 14px;
  color: #1e293b;
  margin-bottom: 4px;
  line-height: 1.4;
}

.activity-time {
  font-size: 12px;
  color: #94a3b8;
}

/* Responsive */
@media (max-width: 1024px) {
  .admin-grid {
    grid-template-columns: repeat(2, 1fr);
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
  
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .admin-grid {
    grid-template-columns: 1fr;
  }
  
  .admin-card {
    padding: 20px;
  }
  
  .card-icon-wrapper {
    width: 48px;
    height: 48px;
  }
  
  .card-icon-wrapper svg {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 480px) {
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-value {
    font-size: 24px;
  }
  
  .recent-activity {
    padding: 20px;
  }
  
  .activity-item {
    padding: 8px;
  }
  
  .activity-icon {
    width: 32px;
    height: 32px;
  }
  
  .activity-text {
    font-size: 13px;
  }
}
</style>