<template>
  <NuxtLayout name="authenticated">
    <div class="projects-page">
      <div class="page-header">
        <h1 class="page-title">Projects</h1>
        <div class="header-actions">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              class="form-input"
              placeholder="Search projects..."
              @input="handleSearch"
            />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="projectsStore.isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading projects...</p>
      </div>

      <!-- Projects Grid -->
      <div v-else-if="projectsStore.hasProjects" class="projects-grid">
        <div
          v-for="project in projectsStore.projects"
          :key="project.id"
          class="project-card"
        >
          <div class="project-images">
            <img
              v-if="project.images?.[0]"
              :src="project.images[0]"
              :alt="project.title"
              loading="lazy"
            />
            <div v-else class="project-image-placeholder">
              📁
            </div>
          </div>
          <div class="project-content">
            <h3>{{ project.title }}</h3>
            <p>{{ project.shortDescription }}</p>
            <div class="project-meta">
              <span class="text-muted text-sm">
                {{ project.images?.length || 0 }} images
              </span>
              <span class="text-muted text-sm">
                {{ project.files?.length || 0 }} files
              </span>
            </div>
            <NuxtLink :to="`/projects/${project.id}`" class="btn btn-primary btn-sm">
              View Details
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">📁</div>
        <h3>No Projects Found</h3>
        <p class="text-muted">
          {{ searchQuery ? 'Try a different search term' : 'No projects available yet' }}
        </p>
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
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});

const projectsStore = useProjectsStore();
const searchQuery = ref('');
const searchDebounce = ref<NodeJS.Timeout | null>(null);

onMounted(async () => {
  await projectsStore.loadProjects(1);
});

const handleSearch = () => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value);
  }

  searchDebounce.value = setTimeout(async () => {
    await projectsStore.search(searchQuery.value);
  }, 300);
};

const loadMore = async () => {
  await projectsStore.loadProjects(projectsStore.page + 1);
};

useHead({
  title: 'Projects - AirBorn',
});
</script>

<style scoped>
.projects-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.header-actions {
  display: flex;
  gap: var(--spacing-md);
}

.search-box {
  min-width: 300px;
}

.search-box input {
  min-width: 100%;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.project-card {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.project-images {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: var(--color-bg-secondary);
}

.project-images img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.project-card:hover .project-images img {
  transform: scale(1.1);
}

.project-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: var(--color-text-light);
}

.project-content {
  padding: var(--spacing-lg);
}

.project-content h3 {
  margin-bottom: var(--spacing-sm);
}

.project-content p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-meta {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
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

.empty-state h3 {
  margin-bottom: var(--spacing-sm);
}

.pagination {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-box {
    width: 100%;
    min-width: auto;
  }
}
</style>
