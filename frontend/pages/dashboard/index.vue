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
            Вот обзор вашей активности и быстрые действия
          </p>
        </div>
        <div class="date-badge">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6.66667 1.66667V4.16667M13.3333 1.66667V4.16667M2.5 7.5H17.5M3.33333 3.33333H16.6667C17.5833 3.33333 18.3333 4.08333 18.3333 5V16.6667C18.3333 17.5833 17.5833 18.3333 16.6667 18.3333H3.33333C2.41667 18.3333 1.66667 17.5833 1.66667 16.6667V5C1.66667 4.08333 2.41667 3.33333 3.33333 3.33333Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>{{ currentDate }}</span>
        </div>
      </div>

      <!-- Profile Card -->
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            <img 
              v-if="avatarUrl" 
              :src="avatarUrl" 
              alt="Avatar" 
              class="avatar-image"
            />
            <span v-else class="avatar-initials">{{ authStore.userInitials }}</span>
          </div>
          <div class="profile-info">
            <h2 class="profile-name">{{ authStore.userName }}</h2>
            <p class="profile-email">{{ authStore.user?.email }}</p>
            <!-- <div class="profile-badge" :class="`badge-${authStore.user?.role}`">
              {{ authStore.user?.role === 'admin' ? 'Администратор' : 'Пользователь' }}
            </div> -->
          </div>
        </div>
        
        <div class="profile-details">
          <div class="detail-item">
            <div class="detail-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M12.25 10.5V12.25C12.2504 12.4487 12.2109 12.6453 12.134 12.8285C12.0571 13.0116 11.9442 13.1777 11.8024 13.3169C11.6606 13.4562 11.4927 13.5657 11.3084 13.6396C11.1242 13.7135 10.9274 13.7503 10.7292 13.7479C8.47604 13.0064 6.4146 11.7554 4.70833 10.0833C3.00207 8.4112 1.74594 6.35703 1 4.10417C0.997119 3.9072 1.03337 3.71161 1.10656 3.52848C1.17976 3.34535 1.28833 3.17848 1.42646 3.03755C1.56459 2.89662 1.72965 2.78445 1.9117 2.70794C2.09375 2.63143 2.28919 2.59234 2.48646 2.59375H4.34375C4.60325 2.59228 4.8558 2.67516 5.0625 2.83073C5.2692 2.9863 5.41941 3.20605 5.48958 3.45417C5.63542 3.9401 5.83682 4.4073 6.08854 4.84583C6.22279 5.08471 6.28628 5.35768 6.27083 5.63177C6.25538 5.90585 6.16175 6.16947 6 6.39062L5.28125 7.34375C6.12646 8.82396 7.35417 10.0026 8.82292 10.7292L9.76042 10.0208C9.98405 9.85854 10.2495 9.76287 10.5253 9.74499C10.801 9.72711 11.0767 9.78786 11.3177 9.91979C11.766 10.1711 12.247 10.3683 12.75 10.5Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
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
        
        <NuxtLink to="/dashboard/profile" class="edit-profile-btn">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M12.75 2.25L15.75 5.25M6 15L2.25 16.5L3.75 12.75L12.75 3.75L15.75 6.75L6.75 15.75L6 15Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          Редактировать профиль
        </NuxtLink>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2 class="section-title">Быстрые действия</h2>
        <div class="actions-grid">
          <NuxtLink to="/projects" class="action-card">
            <div class="action-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="4" y="6" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
                <path d="M8 12H20M8 16H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="action-info">
              <h3>Проекты</h3>
              <p>Просмотр и управление проектами</p>
            </div>
            <svg class="action-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </NuxtLink>
          
          <NuxtLink to="/chat" class="action-card">
            <div class="action-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M22 14C22 18.4183 18.4183 22 14 22C11.5 22 9 20.5 7.5 19L3.5 20.5L5 16.5C3.5 15 3 13 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="19" cy="17" r="4" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </div>
            <div class="action-info">
              <h3>Чат команды</h3>
              <p>Общение с коллегами</p>
            </div>
            <svg class="action-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </NuxtLink>

          <NuxtLink to="/admin" class="action-card" v-if="authStore.isAdmin">
            <div class="action-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 17C17.3137 17 20 14.3137 20 11C20 7.68629 17.3137 5 14 5C10.6863 5 8 7.68629 8 11C8 14.3137 10.6863 17 14 17Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M21 23C19.5 20.5 17 18 14 18C11 18 8.5 20.5 7 23" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="14" cy="14" r="11" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </div>
            <div class="action-info">
              <h3>Админ-панель</h3>
              <p>Управление системой</p>
            </div>
            <svg class="action-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Activity (optional - can be removed if not needed) -->
      <!-- <div v-if="recentActivities.length" class="recent-activity">
        <div class="section-header">
          <h2 class="section-title">Недавняя активность</h2>
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
});

const authStore = useAuthStore();
const config = useRuntimeConfig();

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

// Computed avatar URL with base API URL
const avatarUrl = computed(() => {
  if (!authStore.user?.avatar) return '';
  if (authStore.user.avatar.startsWith('/')) {
    const baseUrl = config.public.apiUrl.replace(/\/api$/, '');
    return `${baseUrl}${authStore.user.avatar}`;
  }
  return authStore.user.avatar;
});

// Recent activity data (можно подключить реальные данные из API)
const recentActivities = ref([
  {
    id: 1,
    type: 'project',
    text: 'Проект "Вентиляция ТЦ" был обновлен',
    time: '15 минут назад'
  },
  {
    id: 2,
    type: 'lead',
    text: 'Новая заявка от компании ООО "СтройИнвест"',
    time: '1 час назад'
  },
  {
    id: 3,
    type: 'user',
    text: 'Ваш профиль был обновлен',
    time: '3 часа назад'
  }
]);

useHead({
  title: 'Дашборд - AirBorn',
});
</script>

<style scoped>
.dashboard-page {
  max-width: 1200px;
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
  white-space: nowrap; /* Запрещаем перенос внутри слова */
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

/* Profile Card */
.profile-card {
  background: white;
  border-radius: 24px;
  border: 1px solid #eef2ff;
  padding: 32px;
  margin-bottom: 40px;
  transition: all 0.3s ease;
}

.profile-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
}

.profile-header {
  display: flex;
  gap: 24px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 600;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
}

.avatar-initials {
  font-size: 36px;
  font-weight: 600;
  color: white;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.profile-email {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 12px;
}

.profile-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
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
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px 0;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}

.detail-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.detail-icon {
  width: 32px;
  height: 32px;
  background: #f8fafc;
  border-radius: 10px;
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

.edit-profile-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  color: #475569;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.edit-profile-btn:hover {
  background: #f1f5f9;
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-2px);
}

/* Quick Actions */
.quick-actions {
  margin-bottom: 40px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 20px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.25s ease;
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-2px);
  border-color: #3b82f6;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.1);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f1f5f9;
  color: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-card:hover .action-icon {
  background: #3b82f6;
  color: white;
}

.action-info h3 {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
}

.action-info p {
  font-size: 12px;
  color: #64748b;
}

.action-arrow {
  color: #cbd5f5;
  transition: 0.2s;
}

.action-card:hover .action-arrow {
  transform: translateX(4px);
  color: #3b82f6;
}


.action-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-icon.blue {
  background: #eff6ff;
  color: #3b82f6;
}

.action-icon.green {
  background: #d1fae5;
  color: #10b981;
}

.action-icon.purple {
  background: #f3e8ff;
  color: #a855f7;
}

.action-icon.orange {
  background: #ffedd5;
  color: #f97316;
}

.action-info {
  flex: 1;
}

.action-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.action-info p {
  font-size: 12px;
  color: #64748b;
}

.action-arrow {
  color: #94a3b8;
  transition: transform 0.2s ease;
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
@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .welcome-title {
    font-size: 24px;
  }
  
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .profile-avatar {
    width: 80px;
    height: 80px;
    font-size: 28px;
  }
  
  .profile-info {
    text-align: center;
  }
  
  .profile-details {
    align-items: center;
  }
  
  .detail-item {
    justify-content: center;
  }
  
  .edit-profile-btn {
    width: 100%;
    justify-content: center;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .action-card {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .profile-card {
    padding: 20px;
  }
  
  .profile-name {
    font-size: 20px;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .detail-icon {
    margin-bottom: 8px;
  }
}
</style>