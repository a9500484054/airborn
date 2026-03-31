<template>
  <NuxtLayout name="authenticated">
    <div class="admin-leads-page">
      <div class="page-header">
        <div>
          <h1 class="page-title mb-sm">Leads Management</h1>
          <NuxtLink to="/admin" class="text-sm text-muted">← Back to Admin</NuxtLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading leads...</p>
      </div>

      <!-- Leads List -->
      <div v-else-if="leads.length" class="leads-list">
        <div
          v-for="lead in leads"
          :key="lead.id"
          class="lead-card"
        >
          <div class="lead-header">
            <div class="lead-info">
              <h3>{{ lead.name }}</h3>
              <p class="text-muted text-sm">{{ lead.email }}</p>
            </div>
            <select
              :value="lead.status"
              class="form-select form-select-sm status-select"
              @change="updateStatus(lead.id, ($event.target as HTMLSelectElement).value)"
            >
              <option value="new">New</option>
              <option value="processed">Processed</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div class="lead-body">
            <div class="lead-detail">
              <strong>Phone:</strong> {{ lead.phone }}
            </div>
            <div v-if="lead.comment" class="lead-detail">
              <strong>Comment:</strong> {{ lead.comment }}
            </div>
            <div class="lead-detail">
              <strong>Submitted:</strong> {{ formatDate(lead.createdAt) }}
            </div>
            <div v-if="lead.ipAddress" class="lead-detail">
              <strong>IP:</strong> {{ lead.ipAddress }}
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            class="btn btn-outline btn-sm"
            :disabled="currentPage === 1"
            @click="loadLeads(currentPage - 1)"
          >
            Previous
          </button>
          <span class="pagination-info">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            class="btn btn-outline btn-sm"
            :disabled="currentPage === totalPages"
            @click="loadLeads(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">📬</div>
        <h3>No Leads Yet</h3>
        <p class="text-muted">Contact form submissions will appear here</p>
      </div>
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
    alert('Failed to update status');
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

useHead({
  title: 'Manage Leads - AirBorn',
});
</script>

<style scoped>
.admin-leads-page {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

.mb-sm {
  margin-bottom: var(--spacing-sm);
}

.leads-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.lead-card {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.lead-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg-secondary);
}

.lead-info h3 {
  margin-bottom: var(--spacing-xs);
}

.status-select {
  min-width: 120px;
}

.lead-body {
  padding: var(--spacing-lg);
}

.lead-detail {
  margin-bottom: var(--spacing-sm);
}

.lead-detail strong {
  color: var(--color-text-secondary);
  margin-right: var(--spacing-sm);
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.pagination-info {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
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
</style>
