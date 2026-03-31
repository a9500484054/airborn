<template>
  <NuxtLayout name="authenticated">
    <div class="dashboard-page">
      <h1 class="page-title">Dashboard</h1>

      <div class="dashboard-grid">
        <!-- Profile Card -->
        <div class="card profile-card">
          <div class="card-header">
            <h2>Your Profile</h2>
          </div>
          <div class="card-body">
            <div class="profile-header">
              <div class="profile-avatar">
                {{ authStore.userInitials }}
              </div>
              <div class="profile-info">
                <h3>{{ authStore.user?.name }}</h3>
                <p class="text-muted">{{ authStore.user?.email }}</p>
                <span class="badge" :class="`badge-${authStore.user?.role === 'admin' ? 'primary' : 'success'}`">
                  {{ authStore.user?.role }}
                </span>
              </div>
            </div>

            <div class="profile-details">
              <div class="detail-item">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">{{ authStore.user?.phone || 'Not set' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Member since:</span>
                <span class="detail-value">{{ formatDate(authStore.user?.createdAt) }}</span>
              </div>
            </div>

            <NuxtLink to="/dashboard/profile" class="btn btn-outline btn-sm">
              Edit Profile
            </NuxtLink>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card actions-card">
          <div class="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div class="card-body">
            <div class="actions-grid">
              <NuxtLink to="/projects" class="action-item">
                <span class="action-icon">📁</span>
                <span>Browse Projects</span>
              </NuxtLink>
              <NuxtLink to="/chat" class="action-item">
                <span class="action-icon">💬</span>
                <span>Open Chat</span>
              </NuxtLink>
              <template v-if="authStore.isAdmin">
                <NuxtLink to="/admin/users" class="action-item">
                  <span class="action-icon">👥</span>
                  <span>Manage Users</span>
                </NuxtLink>
                <NuxtLink to="/admin/projects" class="action-item">
                  <span class="action-icon">✏️</span>
                  <span>Edit Projects</span>
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card activity-card">
          <div class="card-header">
            <h2>Recent Activity</h2>
          </div>
          <div class="card-body">
            <p class="text-muted">Your recent activity will appear here.</p>
          </div>
        </div>

        <!-- Stats -->
        <div class="card stats-card">
          <div class="card-header">
            <h2>Statistics</h2>
          </div>
          <div class="card-body">
            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-value">0</div>
                <div class="stat-label">Projects Viewed</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">0</div>
                <div class="stat-label">Messages Sent</div>
              </div>
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

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

useHead({
  title: 'Dashboard - AirBorn',
});
</script>

<style scoped>
.dashboard-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  margin-bottom: var(--spacing-xl);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
}

.profile-card {
  grid-column: span 2;
}

.profile-header {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  flex-shrink: 0;
}

.profile-info h3 {
  margin-bottom: var(--spacing-xs);
}

.profile-details {
  margin-bottom: var(--spacing-lg);
}

.detail-item {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.detail-label {
  color: var(--color-text-secondary);
  min-width: 120px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
}

.action-item:hover {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  transform: translateY(-2px);
}

.action-icon {
  font-size: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.stat-box {
  text-align: center;
  padding: var(--spacing-lg);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.stat-value {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .profile-card {
    grid-column: span 1;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
