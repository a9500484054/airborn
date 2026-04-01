<template>
  <NuxtLayout name="authenticated">
    <div class="project-detail-page">
      <!-- Loading State -->
      <div v-if="projectsStore.isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Загрузка проекта...</p>
      </div>

      <template v-else-if="projectsStore.currentProject">
        <!-- Back Navigation -->
        <div class="back-nav">
          <NuxtLink to="/projects" class="back-link">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Все проекты
          </NuxtLink>
        </div>

        <!-- Project Header -->
        <div class="project-header">
          <div>
            <div class="project-badge" :class="`status-${projectsStore.currentProject.status}`">
              {{ getStatusText(projectsStore.currentProject.status) }}
            </div>
            <h1 class="project-title">{{ projectsStore.currentProject.title }}</h1>
            <p class="project-subtitle">{{ projectsStore.currentProject.shortDescription }}</p>
          </div>
          <div class="project-actions">
            <button class="action-btn" @click="shareProject">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 6.66667C16.3807 6.66667 17.5 5.54738 17.5 4.16667C17.5 2.78595 16.3807 1.66667 15 1.66667C13.6193 1.66667 12.5 2.78595 12.5 4.16667C12.5 5.54738 13.6193 6.66667 15 6.66667Z" stroke="currentColor" stroke-width="1.2"/>
                <path d="M5 11.6667C6.38071 11.6667 7.5 10.5474 7.5 9.16667C7.5 7.78595 6.38071 6.66667 5 6.66667C3.61929 6.66667 2.5 7.78595 2.5 9.16667C2.5 10.5474 3.61929 11.6667 5 11.6667Z" stroke="currentColor" stroke-width="1.2"/>
                <path d="M15 16.6667C16.3807 16.6667 17.5 15.5474 17.5 14.1667C17.5 12.7859 16.3807 11.6667 15 11.6667C13.6193 11.6667 12.5 12.7859 12.5 14.1667C12.5 15.5474 13.6193 16.6667 15 16.6667Z" stroke="currentColor" stroke-width="1.2"/>
                <path d="M7.19995 10.6667L12.8 13.6667M12.8 6.33333L7.19995 9.33333" stroke="currentColor" stroke-width="1.2"/>
              </svg>
              Поделиться
            </button>
            <NuxtLink :to="`/projects/${projectsStore.currentProject.id}/edit`" class="action-btn edit">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M14.1667 2.5L17.5 5.83333M6.66667 16.6667L2.5 17.5L3.33333 13.3333L13.3333 3.33333L16.6667 6.66667L6.66667 16.6667Z" stroke="currentColor" stroke-width="1.2"/>
              </svg>
              Редактировать
            </NuxtLink>
          </div>
        </div>

        <!-- Project Gallery -->
        <div class="project-gallery">
          <div class="main-image">
            <img
              v-if="mainImage"
              :src="mainImage"
              :alt="projectsStore.currentProject.title"
            />
            <div v-else class="image-placeholder">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <rect x="20" y="20" width="40" height="40" rx="4" stroke="currentColor" stroke-width="1.5"/>
                <path d="M30 35L35 40L50 25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div v-if="projectsStore.currentProject.images?.length > 1" class="image-counter">
              {{ currentImageIndex + 1 }} / {{ projectsStore.currentProject.images?.length }}
            </div>
          </div>
          
          <div v-if="projectsStore.currentProject.images?.length > 1" class="thumbnails">
            <button
              v-for="(image, index) in projectsStore.currentProject.images"
              :key="index"
              class="thumbnail"
              :class="{ active: currentImageIndex === index }"
              @click="currentImageIndex = index"
            >
              <img :src="image" :alt="`Image ${index + 1}`" loading="lazy" />
            </button>
          </div>
        </div>

        <!-- Project Details Grid -->
        <div class="project-details-grid">
          <!-- Description Card -->
          <div class="card description-card">
            <div class="card-header">
              <div class="card-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2.5 5H17.5M2.5 10H17.5M2.5 15H12.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
              </div>
              <h2 class="card-title">Описание проекта</h2>
            </div>
            <div class="card-body">
              <div class="description-content" v-html="formatDescription(projectsStore.currentProject.description || '')"></div>
            </div>
          </div>

          <!-- Project Info Card -->
          <div class="card info-card">
            <div class="card-header">
              <div class="card-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M10 4V10L13 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
              </div>
              <h2 class="card-title">Информация</h2>
            </div>
            <div class="card-body">
              <div class="info-list">
                <div class="info-item">
                  <span class="info-label">Статус</span>
                  <span class="info-value">
                    <span class="status-badge" :class="`status-${projectsStore.currentProject.status}`">
                      {{ getStatusText(projectsStore.currentProject.status) }}
                    </span>
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-label">Дата создания</span>
                  <span class="info-value">{{ formatDate(projectsStore.currentProject.createdAt) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Последнее обновление</span>
                  <span class="info-value">{{ formatDate(projectsStore.currentProject.updatedAt) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Медиафайлы</span>
                  <span class="info-value">{{ projectsStore.currentProject.images?.length || 0 }} изображений</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Документы</span>
                  <span class="info-value">{{ projectsStore.currentProject.files?.length || 0 }} файлов</span>
                </div>
              </div>
              
              <!-- Progress Section -->
              <div v-if="projectsStore.currentProject.progress !== undefined" class="progress-section">
                <div class="progress-header">
                  <span class="progress-label">Прогресс выполнения</span>
                  <span class="progress-percent">{{ projectsStore.currentProject.progress }}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: projectsStore.currentProject.progress + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Files Card -->
          <div class="card files-card">
            <div class="card-header">
              <div class="card-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4.16667 3.33333H15.8333C16.75 3.33333 17.5 4.08333 17.5 5V15C17.5 15.9167 16.75 16.6667 15.8333 16.6667H4.16667C3.25 16.6667 2.5 15.9167 2.5 15V5C2.5 4.08333 3.25 3.33333 4.16667 3.33333Z" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M12.5 7.5H7.5M12.5 10H7.5M10 12.5H7.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
              </div>
              <h2 class="card-title">Файлы и документы</h2>
            </div>
            <div class="card-body">
              <div v-if="projectsStore.currentProject.files?.length" class="files-list">
                <div
                  v-for="(file, index) in projectsStore.currentProject.files"
                  :key="index"
                  class="file-item"
                >
                  <div class="file-icon" :class="getFileIconClass(file.mimeType)">
                    {{ getFileIcon(file.mimeType) }}
                  </div>
                  <div class="file-info">
                    <span class="file-name">{{ file.name }}</span>
                    <span class="file-size">{{ formatFileSize(file.size) }}</span>
                  </div>
                  <a
                    :href="file.url"
                    class="download-link"
                    download
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 2.25V11.25M9 11.25L11.25 9M9 11.25L6.75 9M3 15.75H15" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                    </svg>
                  </a>
                </div>
              </div>
              <div v-else class="empty-files">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M24 12V36M12 24H36" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <p>Нет загруженных файлов</p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Not Found -->
      <div v-else class="not-found">
        <div class="not-found-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="35" stroke="currentColor" stroke-width="1.5"/>
            <path d="M40 25V45M40 55H40.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <h2>Проект не найден</h2>
        <p class="not-found-text">Проект, который вы ищете, не существует или был удален</p>
        <NuxtLink to="/projects" class="btn-primary-not-found">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Вернуться к проектам
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});

const route = useRoute();
const projectsStore = useProjectsStore();
const currentImageIndex = ref(0);

const mainImage = computed(() => {
  return projectsStore.currentProject?.images?.[currentImageIndex.value];
});

onMounted(async () => {
  const projectId = route.params.id as string;
  await projectsStore.loadProject(projectId);
});

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Дата не указана';
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const formatDescription = (text: string) => {
  if (!text) return '<p class="no-description">Описание отсутствует</p>';
  return text.replace(/\n/g, '<br>');
};

const getFileIcon = (mimeType: string) => {
  if (mimeType?.includes('pdf')) return '📄';
  if (mimeType?.includes('word') || mimeType?.includes('document')) return '📝';
  if (mimeType?.includes('excel') || mimeType?.includes('sheet')) return '📊';
  if (mimeType?.includes('image')) return '🖼️';
  if (mimeType?.includes('zip') || mimeType?.includes('archive')) return '📦';
  return '📎';
};

const getFileIconClass = (mimeType: string) => {
  if (mimeType?.includes('pdf')) return 'file-pdf';
  if (mimeType?.includes('word')) return 'file-word';
  if (mimeType?.includes('excel')) return 'file-excel';
  if (mimeType?.includes('image')) return 'file-image';
  return '';
};

const getStatusText = (status?: string) => {
  const statusMap: Record<string, string> = {
    active: 'Активный',
    completed: 'Завершен',
    pending: 'В ожидании',
    draft: 'Черновик'
  };
  return statusMap[status || 'draft'] || 'Не указан';
};

const shareProject = async () => {
  const url = `${window.location.origin}/projects/${projectsStore.currentProject?.id}`;
  try {
    await navigator.clipboard.writeText(url);
    // Здесь можно добавить уведомление об успешном копировании
    console.log('Ссылка скопирована');
  } catch (err) {
    console.error('Ошибка копирования:', err);
  }
};

useHead({
  title: projectsStore.currentProject?.title
    ? `${projectsStore.currentProject.title} - AirBorn`
    : 'Детали проекта - AirBorn',
});
</script>

<style scoped>
.project-detail-page {
  max-width: 1200px;
  margin: 0 auto;
}

/* Back Navigation */
.back-nav {
  margin-bottom: 24px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.back-link:hover {
  color: #3b82f6;
  gap: 10px;
}

/* Project Header */
.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 20px;
}

.project-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.status-active {
  background: #d1fae5;
  color: #10b981;
}

.status-completed {
  background: #e0e7ff;
  color: #6366f1;
}

.status-pending {
  background: #ffedd5;
  color: #f59e0b;
}

.status-draft {
  background: #f1f5f9;
  color: #64748b;
}

.project-title {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.project-subtitle {
  font-size: 16px;
  color: #64748b;
}

.project-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: inline-flex;
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
  text-decoration: none;
}

.action-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-1px);
}

.action-btn.edit:hover {
  border-color: #10b981;
  color: #10b981;
}

/* Gallery */
.project-gallery {
  margin-bottom: 40px;
}

.main-image {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  margin-bottom: 16px;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}

.image-counter {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: white;
}

.thumbnails {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.thumbnail.active {
  border-color: #3b82f6;
  transform: scale(1.05);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Project Details Grid */
.project-details-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 28px;
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
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.card-icon {
  width: 36px;
  height: 36px;
  background: #eff6ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.card-body {
  padding: 24px;
}

/* Description */
.description-content {
  line-height: 1.8;
  color: #334155;
}

.no-description {
  color: #94a3b8;
  text-align: center;
  padding: 20px;
}

/* Info List */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-label {
  font-size: 13px;
  color: #64748b;
}

.info-value {
  font-weight: 500;
  color: #0f172a;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

/* Progress Section */
.progress-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 13px;
  color: #64748b;
}

.progress-percent {
  font-size: 14px;
  font-weight: 600;
  color: #3b82f6;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Files */
.files-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.file-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.file-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.file-icon.file-pdf {
  color: #ef4444;
}

.file-icon.file-word {
  color: #3b82f6;
}

.file-icon.file-excel {
  color: #10b981;
}

.file-icon.file-image {
  color: #a855f7;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  display: block;
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

.download-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 8px;
  color: #64748b;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.download-link:hover {
  background: #3b82f6;
  color: white;
  transform: scale(1.05);
}

.empty-files {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.empty-files svg {
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-files p {
  font-size: 14px;
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

/* Not Found */
.not-found {
  text-align: center;
  padding: 80px 20px;
}

.not-found-icon {
  color: #cbd5e1;
  margin-bottom: 24px;
}

.not-found h2 {
  font-size: 24px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.not-found-text {
  color: #64748b;
  margin-bottom: 32px;
}

.btn-primary-not-found {
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
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary-not-found:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 1024px) {
  .project-details-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .project-header {
    flex-direction: column;
  }
  
  .project-title {
    font-size: 24px;
  }
  
  .main-image {
    height: 300px;
  }
  
  .thumbnails {
    gap: 8px;
  }
  
  .thumbnail {
    width: 60px;
    height: 60px;
  }
  
  .card-header {
    padding: 16px 20px;
  }
  
  .card-body {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .project-actions {
    width: 100%;
  }
  
  .action-btn {
    flex: 1;
    justify-content: center;
  }
  
  .main-image {
    height: 250px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>