<template>
  <NuxtLayout name="authenticated">
    <div class="admin-projects-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Управление проектами</h1>
          <p class="page-subtitle">Создание, редактирование и управление портфолио проектов</p>
        </div>
        <div class="header-right">
          <div class="stats-badge">
            <div class="stats-badge-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="3" y="3" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.2"/>
                <path d="M6 9H12M9 6V12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="stats-badge-info">
              <span class="stats-badge-value">{{ projectsStore.projects.length }}</span>
            </div>
          </div>

          <button class="create-btn" @click="showCreateModal = true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Создать проект
          </button>
          <NuxtLink to="/admin" class="back-link">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 14L6 9L11 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Назад
          </NuxtLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="projectsStore.isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Загрузка проектов...</p>
      </div>

      <!-- Projects Grid -->
      <div v-else-if="projectsStore.hasProjects" class="projects-grid">
        <div
          v-for="project in projectsStore.projects"
          :key="project.id"
          class="project-card"
        >
          <div class="project-image">
            <img
              v-if="project.images?.[0]"
              :src="project.images[0]"
              :alt="project.title"
              loading="lazy"
            />
            <div v-else class="image-placeholder">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="12" y="12" width="24" height="24" rx="4" stroke="currentColor" stroke-width="1.5"/>
                <path d="M18 24L22 28L30 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="project-badge">
              {{ project.images?.length || 0 }} фото
            </div>
          </div>
          
          <div class="project-content">
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-description">{{ project.shortDescription }}</p>
            
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
                  <path d="M2.33333 2.33333H11.6667C12.5833 2.33333 13.3333 3.08333 13.3333 4V10C13.3333 10.9167 12.5833 11.6667 11.6667 11.6667H2.33333C1.41667 11.6667 0.666667 10.9167 0.666667 10V4C0.666667 3.08333 1.41667 2.33333 2.33333 2.33333Z" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M13.3333 4L7 8L0.666667 4" stroke="currentColor" stroke-width="1.2"/>
                </svg>
                <span>{{ project.files?.length || 0 }} файлов</span>
              </div>
            </div>
            
            <div class="project-actions">
              <button class="action-btn edit" @click="editProject(project)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11.3333 2L14 4.66667M5.33333 13.3333L2 14L2.66667 10.6667L10.6667 2.66667L13.3333 5.33333L5.33333 13.3333Z" stroke="currentColor" stroke-width="1.2"/>
                </svg>
                Редактировать
              </button>
              <button class="action-btn delete" @click="deleteProject(project)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4H14M6 4V2.66667C6 2.31304 6.14048 1.97391 6.39052 1.72386C6.64057 1.47381 6.97971 1.33333 7.33333 1.33333H8.66667C9.02029 1.33333 9.35943 1.47381 9.60948 1.72386C9.85952 1.97391 10 2.31304 10 2.66667V4M12.6667 4V12.6667C12.6667 13.0203 12.5262 13.3594 12.2761 13.6095C12.0261 13.8595 11.6869 14 11.3333 14H4.66667C4.31304 14 3.97391 13.8595 3.72386 13.6095C3.47381 13.3594 3.33333 13.0203 3.33333 12.6667V4H12.6667Z" stroke="currentColor" stroke-width="1.2"/>
                </svg>
                Удалить
              </button>
            </div>
          </div>
        </div>

        <!-- Load More -->
        <div v-if="projectsStore.hasMore" class="load-more">
          <button
            class="load-more-btn"
            @click="loadMore"
            :disabled="projectsStore.isLoading"
          >
            <span v-if="!projectsStore.isLoading">Загрузить еще</span>
            <div v-else class="spinner-small"></div>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <rect x="20" y="20" width="40" height="40" rx="5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M30 40H50M40 30V50" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <h3>Нет проектов</h3>
        <p class="empty-text">Создайте первый проект, чтобы начать работу</p>
        <button class="create-empty-btn" @click="showCreateModal = true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Создать проект
        </button>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showCreateModal || editingProject" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <div class="modal-header-left">
              <div class="modal-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M12 8V16M8 12H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <h2 class="modal-title">{{ editingProject ? 'Редактирование проекта' : 'Создание проекта' }}</h2>
            </div>
            <button class="modal-close" @click="closeModal">✕</button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="submitProject" class="project-form">
              <div class="form-group">
                <label class="form-label">
                  <span class="label-text">Название проекта</span>
                  <span class="label-required">*</span>
                </label>
                <input
                  v-model="formData.title"
                  type="text"
                  class="form-input"
                  placeholder="Введите название проекта"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="label-text">Краткое описание</span>
                  <span class="label-required">*</span>
                </label>
                <textarea
                  v-model="formData.shortDescription"
                  class="form-textarea"
                  rows="2"
                  placeholder="Краткое описание проекта (до 200 символов)"
                  required
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="label-text">Полное описание</span>
                  <span class="label-required">*</span>
                </label>
                <textarea
                  v-model="formData.description"
                  class="form-textarea"
                  rows="6"
                  placeholder="Подробное описание проекта, технологии, результаты..."
                  required
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Изображения проекта</label>
                <div class="file-upload-area" @click="$refs.imageInput.click()">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 6V26M6 16H26" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  <p>Нажмите для загрузки изображений</p>
                  <span class="file-hint">Поддерживаются JPG, PNG, WEBP (макс. 10MB)</span>
                </div>
                <input
                  ref="imageInput"
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleImagesSelect"
                  style="display: none"
                />

                <div v-if="formData.images.length" class="image-preview-list">
                  <div v-for="(img, i) in formData.images" :key="i" class="image-preview">
                    <img :src="img" :alt="`Preview ${i + 1}`" />
                    <button type="button" class="remove-image" @click="removeImage(i)">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" stroke-width="1.2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Файлы проекта</label>
                <div class="file-upload-area" @click="$refs.fileInput.click()">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 6V26M6 16H26" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  <p>Нажмите для загрузки файлов</p>
                  <span class="file-hint">Поддерживаются PDF, DOC, DOCX, XLS, XLSX, ZIP (макс. 20MB)</span>
                </div>
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt"
                  @change="handleFilesSelect"
                  style="display: none"
                />

                <div v-if="formData.files.length" class="file-preview-list">
                  <div v-for="(file, i) in formData.files" :key="i" class="file-preview-item">
                    <div class="file-icon" :class="getFileIconClass(file.name)">
                      {{ getFileIcon(file.name) }}
                    </div>
                    <div class="file-info">
                      <span class="file-name">{{ file.name }}</span>
                      <span class="file-size">{{ formatFileSize(file.size) }}</span>
                    </div>
                    <button type="button" class="remove-file" @click="removeFile(i)">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-cancel" @click="closeModal">
                  Отмена
                </button>
                <button type="submit" class="btn-submit" :disabled="isSubmitting">
                  <svg v-if="!isSubmitting" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M13.5 2.25L15.75 4.5M6.75 15.75L2.25 14.25L3.75 9.75L12.75 0.75L17.25 5.25L8.25 14.25L6.75 15.75Z" stroke="currentColor" stroke-width="1.2"/>
                  </svg>
                  <div v-else class="spinner-small-white"></div>
                  {{ isSubmitting ? 'Сохранение...' : (editingProject ? 'Обновить' : 'Создать') }}
                </button>
              </div>

              <div v-if="submitError" class="alert-error">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M9 5V9M9 11H9.01" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
                <span>{{ submitError }}</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  roles: ['admin'],
});

const projectsStore = useProjectsStore();
const authStore = useAuthStore();
const config = useRuntimeConfig();

const showCreateModal = ref(false);
const editingProject = ref<any>(null);
const isSubmitting = ref(false);
const submitError = ref('');
const imageInput = ref<HTMLInputElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const formData = ref({
  title: '',
  shortDescription: '',
  description: '',
  images: [] as string[],
  files: [] as any[],
});

onMounted(async () => {
  await projectsStore.loadProjects(1);
});

const loadMore = async () => {
  await projectsStore.loadProjects(projectsStore.page + 1);
};

const editProject = (project: any) => {
  editingProject.value = project;
  formData.value = {
    title: project.title,
    shortDescription: project.shortDescription,
    description: project.description,
    images: project.images || [],
    files: project.files || [],
  };
  showCreateModal.value = true;
};

const deleteProject = async (project: any) => {
  if (!confirm(`Удалить проект "${project.title}"? Это действие нельзя отменить.`)) return;

  const result = await projectsStore.deleteProject(project.id);
  if (!result.success) {
    alert(result.error);
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingProject.value = null;
  formData.value = {
    title: '',
    shortDescription: '',
    description: '',
    images: [],
    files: [],
  };
  submitError.value = '';
};

const handleImagesSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const files = Array.from(target.files);
  const uploadedUrls: string[] = [];

  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) {
      alert(`Файл ${file.name} превышает 10MB`);
      continue;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('files', file);

    try {
      const { data } = await useFetch(`${config.public.apiUrl}/files/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        body: formDataUpload,
      });

      if (data.value) {
        const response = data.value as any;
        uploadedUrls.push(response.data.files[0].url);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  }

  formData.value.images = [...formData.value.images, ...uploadedUrls];
};

const removeImage = (index: number) => {
  formData.value.images.splice(index, 1);
};

const handleFilesSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const files = Array.from(target.files);

  for (const file of files) {
    if (file.size > 20 * 1024 * 1024) {
      alert(`Файл ${file.name} превышает 20MB`);
      continue;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('files', file);

    try {
      const { data } = await useFetch(`${config.public.apiUrl}/files/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        body: formDataUpload,
      });

      if (data.value) {
        const response = data.value as any;
        const uploadedFile = response.data.files[0];
        formData.value.files.push({
          name: uploadedFile.originalName || file.name,
          url: uploadedFile.url,
          size: uploadedFile.size || file.size,
          mimeType: uploadedFile.mimeType,
        });
      }
    } catch (error) {
      console.error('File upload failed:', error);
    }
  }
};

const removeFile = (index: number) => {
  formData.value.files.splice(index, 1);
};

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return '📄';
  if (['doc', 'docx'].includes(ext || '')) return '📝';
  if (['xls', 'xlsx'].includes(ext || '')) return '📊';
  if (['zip', 'rar'].includes(ext || '')) return '📦';
  return '📎';
};

const getFileIconClass = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'file-pdf';
  if (['doc', 'docx'].includes(ext || '')) return 'file-word';
  if (['xls', 'xlsx'].includes(ext || '')) return 'file-excel';
  if (['zip', 'rar'].includes(ext || '')) return 'file-archive';
  return 'file-default';
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const submitProject = async () => {
  isSubmitting.value = true;
  submitError.value = '';

  const payload = {
    title: formData.value.title,
    shortDescription: formData.value.shortDescription,
    description: formData.value.description,
    images: formData.value.images,
    files: formData.value.files,
  };

  let result;
  if (editingProject.value) {
    result = await projectsStore.updateProject(editingProject.value.id, payload);
  } else {
    result = await projectsStore.createProject(payload);
  }

  if (result.success) {
    await projectsStore.loadProjects(1);
    closeModal();
  } else {
    submitError.value = result.error || 'Не удалось сохранить проект';
  }

  isSubmitting.value = false;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

useHead({
  title: 'Управление проектами - AirBorn',
});
</script>

<style scoped>
.admin-projects-page {
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

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-btn:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 28px;
  margin-bottom: 32px;
}

.project-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #eef2ff;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.project-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}

.project-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  color: white;
}

.project-content {
  padding: 20px;
}

.project-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
  line-height: 1.3;
}

.project-description {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

.project-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.action-btn.edit {
  background: #eff6ff;
  color: #3b82f6;
}

.action-btn.edit:hover {
  background: #e0e7ff;
  gap: 10px;
}

.action-btn.delete {
  background: #fef2f2;
  color: #ef4444;
}

.action-btn.delete:hover {
  background: #fee2e2;
  gap: 10px;
}

/* Load More */
.load-more {
  text-align: center;
  padding: 20px;
}

.load-more-btn {
  padding: 12px 32px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-more-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-2px);
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

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin: 0 auto;
}

.spinner-small-white {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
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
  margin-bottom: 24px;
}

.create-empty-btn {
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

.create-empty-btn:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  transform: translateY(-2px);
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
  max-width: 600px;
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

.modal-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icon {
  width: 40px;
  height: 40px;
  background: #eff6ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.modal-title {
  font-size: 20px;
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

/* Form */
.project-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

.label-required {
  color: #ef4444;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

/* File Upload */
.file-upload-area {
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-upload-area:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.file-upload-area svg {
  color: #94a3b8;
  margin-bottom: 12px;
}

.file-upload-area p {
  font-size: 14px;
  color: #475569;
  margin-bottom: 4px;
}

.file-hint {
  font-size: 11px;
  color: #94a3b8;
}

.image-preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.image-preview {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
}

.remove-image:hover {
  background: #ef4444;
}

/* File Preview List */
.file-preview-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.file-preview-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.file-preview-item:hover {
  background: #f1f5f9;
}

.file-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.file-icon.file-pdf {
  background: #fef2f2;
  color: #ef4444;
}

.file-icon.file-word {
  background: #eff6ff;
  color: #3b82f6;
}

.file-icon.file-excel {
  background: #f0fdf4;
  color: #22c55e;
}

.file-icon.file-archive {
  background: #fefce8;
  color: #eab308;
}

.file-icon.file-default {
  background: #f1f5f9;
  color: #64748b;
}

.file-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.file-name {
  font-size: 13px;
  font-weight: 500;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 11px;
  color: #94a3b8;
}

.remove-file {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.remove-file:hover {
  background: #fef2f2;
  color: #ef4444;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-cancel {
  padding: 10px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.btn-submit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Alert */
.alert-error {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fef2f2;
  border-radius: 12px;
  color: #dc2626;
  font-size: 13px;
}

/* Responsive */
@media (max-width: 1024px) {
  .projects-grid {
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
  
  .header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-submit {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .stats-badge {
    display: none;
  }
  
  .project-actions {
    flex-direction: column;
  }
  
  .modal-body {
    padding: 20px;
  }
}
</style>