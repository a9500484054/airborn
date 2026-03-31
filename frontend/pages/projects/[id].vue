<template>
  <NuxtLayout name="authenticated">
    <div class="project-detail-page">
      <!-- Loading State -->
      <div v-if="projectsStore.isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading project...</p>
      </div>

      <template v-else-if="projectsStore.currentProject">
        <!-- Back Button -->
        <div class="back-nav">
          <NuxtLink to="/projects" class="btn btn-outline btn-sm">← Back to Projects</NuxtLink>
        </div>

        <!-- Project Title -->
        <h1 class="project-title">{{ projectsStore.currentProject.title }}</h1>

        <!-- Project Images -->
        <div class="project-gallery">
          <div class="main-image">
            <img
              v-if="mainImage"
              :src="mainImage"
              :alt="projectsStore.currentProject.title"
            />
            <div v-else class="image-placeholder">📁</div>
          </div>
          <div v-if="projectsStore.currentProject.images?.length > 1" class="thumbnails">
            <button
              v-for="(image, index) in projectsStore.currentProject.images"
              :key="index"
              class="thumbnail"
              :class="{ active: index === currentImageIndex }"
              @click="currentImageIndex = index"
            >
              <img :src="image" :alt="`Image ${index + 1}`" loading="lazy" />
            </button>
          </div>
        </div>

        <!-- Project Info -->
        <div class="project-info-grid">
          <!-- Description -->
          <div class="card">
            <div class="card-header">
              <h2>Description</h2>
            </div>
            <div class="card-body">
              <p class="short-description">
                <strong>Overview:</strong> {{ projectsStore.currentProject.shortDescription }}
              </p>
              <div class="full-description" v-html="formatDescription(projectsStore.currentProject.description)"></div>
            </div>
          </div>

          <!-- Files -->
          <div class="card">
            <div class="card-header">
              <h2>Files & Documents</h2>
            </div>
            <div class="card-body">
              <div v-if="projectsStore.currentProject.files?.length" class="files-list">
                <div
                  v-for="(file, index) in projectsStore.currentProject.files"
                  :key="index"
                  class="file-item"
                >
                  <div class="file-icon">
                    {{ getFileIcon(file.mimeType) }}
                  </div>
                  <div class="file-info">
                    <span class="file-name">{{ file.name }}</span>
                    <span class="file-size">{{ formatFileSize(file.size) }}</span>
                  </div>
                  <a
                    :href="file.url"
                    class="btn btn-outline btn-sm"
                    download
                  >
                    Download
                  </a>
                </div>
              </div>
              <p v-else class="text-muted">No files available</p>
            </div>
          </div>

          <!-- Project Meta -->
          <div class="card">
            <div class="card-header">
              <h2>Project Info</h2>
            </div>
            <div class="card-body">
              <div class="meta-item">
                <span class="meta-label">Created:</span>
                <span class="meta-value">{{ formatDate(projectsStore.currentProject.createdAt) }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Updated:</span>
                <span class="meta-value">{{ formatDate(projectsStore.currentProject.updatedAt) }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Images:</span>
                <span class="meta-value">{{ projectsStore.currentProject.images?.length || 0 }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Files:</span>
                <span class="meta-value">{{ projectsStore.currentProject.files?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Not Found -->
      <div v-else class="not-found">
        <div class="not-found-icon">❌</div>
        <h2>Project Not Found</h2>
        <p class="text-muted">The project you're looking for doesn't exist.</p>
        <NuxtLink to="/projects" class="btn btn-primary">
          Back to Projects
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
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const formatDescription = (text: string) => {
  if (!text) return '';
  return text.replace(/\n/g, '<br>');
};

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word')) return '📝';
  if (mimeType.includes('excel')) return '📊';
  if (mimeType.includes('image')) return '🖼️';
  return '📎';
};

useHead({
  title: projectsStore.currentProject?.title
    ? `${projectsStore.currentProject.title} - AirBorn`
    : 'Project Details - AirBorn',
});
</script>

<style scoped>
.project-detail-page {
  max-width: 1200px;
  margin: 0 auto;
}

.back-nav {
  margin-bottom: var(--spacing-lg);
}

.project-title {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-xl);
}

.project-gallery {
  margin-bottom: var(--spacing-xl);
}

.main-image {
  width: 100%;
  height: 500px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--color-bg-secondary);
  margin-bottom: var(--spacing-md);
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
  font-size: 6rem;
  color: var(--color-text-light);
}

.thumbnails {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
  padding-bottom: var(--spacing-sm);
}

.thumbnail {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.thumbnail.active {
  border-color: var(--color-primary);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-info-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-xl);
}

.short-description {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.full-description {
  line-height: 1.8;
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.file-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.file-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.file-name {
  font-weight: 500;
  word-break: break-word;
}

.file-size {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.meta-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-border);
}

.meta-item:last-child {
  border-bottom: none;
}

.meta-label {
  color: var(--color-text-secondary);
}

.meta-value {
  font-weight: 500;
}

.loading-state,
.not-found {
  text-align: center;
  padding: var(--spacing-2xl);
}

.not-found-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
}

.not-found h2 {
  margin-bottom: var(--spacing-sm);
}

@media (max-width: 768px) {
  .project-info-grid {
    grid-template-columns: 1fr;
  }

  .main-image {
    height: 300px;
  }
}
</style>
