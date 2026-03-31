<template>
  <NuxtLayout name="authenticated">
    <div class="admin-projects-page">
      <div class="page-header">
        <div>
          <h1 class="page-title mb-sm">Project Management</h1>
          <NuxtLink to="/admin" class="text-sm text-muted">← Back to Admin</NuxtLink>
        </div>
        <button class="btn btn-primary" @click="showCreateModal = true">
          + Create Project
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="projectsStore.isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading projects...</p>
      </div>

      <!-- Projects List -->
      <div v-else-if="projectsStore.hasProjects" class="projects-list">
        <div
          v-for="project in projectsStore.projects"
          :key="project.id"
          class="project-item"
        >
          <div class="project-image">
            <img
              v-if="project.images?.[0]"
              :src="project.images[0]"
              :alt="project.title"
              loading="lazy"
            />
            <div v-else class="image-placeholder">📁</div>
          </div>
          <div class="project-info">
            <h3>{{ project.title }}</h3>
            <p>{{ project.shortDescription }}</p>
            <div class="project-meta">
              <span class="text-muted text-sm">
                {{ project.images?.length || 0 }} images
              </span>
              <span class="text-muted text-sm">
                {{ project.files?.length || 0 }} files
              </span>
              <span class="text-muted text-sm">
                Created {{ formatDate(project.createdAt) }}
              </span>
            </div>
          </div>
          <div class="project-actions">
            <button class="btn btn-outline btn-sm" @click="editProject(project)">
              Edit
            </button>
            <button class="btn btn-error btn-sm" @click="deleteProject(project)">
              Delete
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="projectsStore.hasMore" class="pagination">
          <button
            class="btn btn-outline"
            @click="loadMore"
            :disabled="projectsStore.isLoading"
          >
            {{ projectsStore.isLoading ? 'Loading...' : 'Load More' }}
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">📁</div>
        <h3>No Projects Found</h3>
        <p class="text-muted">Create your first project to get started</p>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showCreateModal || editingProject" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>{{ editingProject ? 'Edit Project' : 'Create Project' }}</h2>
            <button class="modal-close" @click="closeModal">✕</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitProject" class="project-form">
              <div class="form-group">
                <label class="form-label" for="title">Title *</label>
                <input
                  id="title"
                  v-model="formData.title"
                  type="text"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="shortDescription">Short Description *</label>
                <textarea
                  id="shortDescription"
                  v-model="formData.shortDescription"
                  class="form-textarea"
                  rows="2"
                  required
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label" for="description">Full Description *</label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  class="form-textarea"
                  rows="6"
                  required
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleImagesSelect"
                  class="form-input"
                />
                <div v-if="formData.images?.length" class="selected-files">
                  <span v-for="(img, i) in formData.images" :key="i" class="file-tag">
                    {{ img }}
                  </span>
                </div>
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Saving...' : (editingProject ? 'Update' : 'Create') }}
                </button>
              </div>

              <div v-if="submitError" class="alert alert-error">
                {{ submitError }}
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
  if (!confirm(`Delete project "${project.title}"? This cannot be undone.`)) return;

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
    submitError.value = result.error || 'Failed to save project';
  }

  isSubmitting.value = false;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

useHead({
  title: 'Manage Projects - AirBorn',
});
</script>

<style scoped>
.admin-projects-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.mb-sm {
  margin-bottom: var(--spacing-sm);
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.project-item {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  align-items: flex-start;
}

.project-image {
  width: 200px;
  height: 150px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: var(--color-bg-secondary);
  flex-shrink: 0;
}

.project-image img {
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
  font-size: 3rem;
  color: var(--color-text-light);
}

.project-info {
  flex: 1;
}

.project-info h3 {
  margin-bottom: var(--spacing-sm);
}

.project-info p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.project-meta {
  display: flex;
  gap: var(--spacing-lg);
}

.project-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.btn-error {
  background-color: var(--color-error);
  color: var(--color-text-inverse);
}

.btn-error:hover {
  background-color: #dc2626;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-lg);
}

.modal-content {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-close {
  background: none;
  border: none;
  font-size: var(--font-size-xl);
  cursor: pointer;
  opacity: 0.7;
}

.modal-close:hover {
  opacity: 1;
}

.modal-body {
  padding: var(--spacing-lg);
}

.selected-files {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.file-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
}

.form-actions {
  margin-top: var(--spacing-lg);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
}

.pagination {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

@media (max-width: 768px) {
  .project-item {
    flex-direction: column;
  }

  .project-image {
    width: 100%;
  }
}
</style>
