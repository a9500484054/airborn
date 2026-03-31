<template>
  <NuxtLayout name="authenticated">
    <div class="admin-users-page">
      <div class="page-header">
        <div>
          <h1 class="page-title mb-sm">User Management</h1>
          <NuxtLink to="/admin" class="text-sm text-muted">← Back to Admin</NuxtLink>
        </div>
        <div class="header-actions">
          <input
            v-model="searchQuery"
            type="text"
            class="form-input"
            placeholder="Search users..."
            @input="handleSearch"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading users...</p>
      </div>

      <!-- Users Table -->
      <div v-else-if="users.length" class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <div class="user-cell">
                  <div class="user-avatar-small">
                    {{ getUserInitials(user.name) }}
                  </div>
                  <span>{{ user.name }}</span>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone || '—' }}</td>
              <td>
                <select
                  :value="user.role"
                  class="form-select form-select-sm"
                  @change="updateUserRole(user.id, ($event.target as HTMLSelectElement).value)"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <span
                  class="badge"
                  :class="user.isBlocked ? 'badge-error' : 'badge-success'"
                >
                  {{ user.isBlocked ? 'Blocked' : 'Active' }}
                </span>
              </td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td>
                <div class="actions-cell">
                  <button
                    class="btn btn-sm"
                    :class="user.isBlocked ? 'btn-success' : 'btn-outline'"
                    @click="toggleBlock(user)"
                  >
                    {{ user.isBlocked ? 'Unblock' : 'Block' }}
                  </button>
                  <button
                    class="btn btn-sm btn-error"
                    @click="deleteUser(user)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            class="btn btn-outline btn-sm"
            :disabled="currentPage === 1"
            @click="loadUsers(currentPage - 1)"
          >
            Previous
          </button>
          <span class="pagination-info">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            class="btn btn-outline btn-sm"
            :disabled="currentPage === totalPages"
            @click="loadUsers(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">👥</div>
        <h3>No Users Found</h3>
        <p class="text-muted">
          {{ searchQuery ? 'Try a different search term' : 'No users available' }}
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  roles: ['admin'],
});

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
  createdAt: string;
}

const config = useRuntimeConfig();
const authStore = useAuthStore();

const users = ref<User[]>([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const searchDebounce = ref<NodeJS.Timeout | null>(null);

onMounted(async () => {
  await loadUsers(1);
});

const loadUsers = async (page: number) => {
  isLoading.value = true;

  try {
    const searchParam = searchQuery.value ? `&search=${encodeURIComponent(searchQuery.value)}` : '';
    const { data } = await useFetch(
      `${config.public.apiUrl}/users?page=${page}&limit=20${searchParam}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    if (data.value) {
      const response = data.value as any;
      users.value = response.data.data;
      currentPage.value = response.data.meta.page;
      totalPages.value = response.data.meta.totalPages;
    }
  } catch (error) {
    console.error('Failed to load users:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = () => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value);
  }

  searchDebounce.value = setTimeout(async () => {
    currentPage.value = 1;
    await loadUsers(1);
  }, 300);
};

const updateUserRole = async (userId: string, newRole: string) => {
  if (!confirm(`Change user role to ${newRole}?`)) return;

  try {
    await useFetch(`${config.public.apiUrl}/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      body: { role: newRole },
    });

    await loadUsers(currentPage.value);
  } catch (error) {
    alert('Failed to update user role');
  }
};

const toggleBlock = async (user: User) => {
  const action = user.isBlocked ? 'Unblock' : 'Block';
  if (!confirm(`${action} user ${user.name}?`)) return;

  try {
    await useFetch(`${config.public.apiUrl}/users/${userId}/block`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      body: { isBlocked: !user.isBlocked },
    });

    await loadUsers(currentPage.value);
  } catch (error) {
    alert('Failed to update user status');
  }
};

const deleteUser = async (user: User) => {
  if (!confirm(`Delete user ${user.name}? This action cannot be undone.`)) return;

  try {
    await useFetch(`${config.public.apiUrl}/users/${user.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    await loadUsers(currentPage.value);
  } catch (error) {
    alert('Failed to delete user');
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getUserInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

useHead({
  title: 'Manage Users - AirBorn',
});
</script>

<style scoped>
.admin-users-page {
  max-width: 1400px;
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

.header-actions input {
  min-width: 300px;
}

.mb-sm {
  margin-bottom: var(--spacing-sm);
}

.table-container {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.data-table th {
  background-color: var(--color-bg-secondary);
  font-weight: 600;
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.data-table tr:hover {
  background-color: var(--color-bg-secondary);
}

.user-cell {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.user-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.form-select-sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.actions-cell {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-error {
  background-color: var(--color-error);
  color: var(--color-text-inverse);
}

.btn-error:hover {
  background-color: #dc2626;
}

.btn-success {
  background-color: var(--color-success);
  color: var(--color-text-inverse);
}

.btn-success:hover {
  background-color: #059669;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--color-bg-secondary);
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

@media (max-width: 1024px) {
  .table-container {
    overflow-x: auto;
  }

  .data-table {
    min-width: 800px;
  }
}
</style>
