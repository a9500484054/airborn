<template>
  <NuxtLayout name="authenticated">
    <div class="admin-page">
      <h1 class="page-title">Admin Panel</h1>

      <div class="admin-grid">
        <!-- Users Management Card -->
        <NuxtLink to="/admin/users" class="admin-card">
          <div class="card-icon">👥</div>
          <h2>Users</h2>
          <p class="card-description">Manage user accounts, roles, and permissions</p>
          <span class="card-link">Manage Users →</span>
        </NuxtLink>

        <!-- Projects Management Card -->
        <NuxtLink to="/admin/projects" class="admin-card">
          <div class="card-icon">📁</div>
          <h2>Projects</h2>
          <p class="card-description">Create, edit, and delete portfolio projects</p>
          <span class="card-link">Manage Projects →</span>
        </NuxtLink>

        <!-- Leads Card -->
        <NuxtLink to="/admin/leads" class="admin-card">
          <div class="card-icon">📬</div>
          <h2>Leads</h2>
          <p class="card-description">View and manage contact form submissions</p>
          <span class="card-link">View Leads →</span>
        </NuxtLink>

        <!-- System Stats Card -->
        <div class="admin-card stats-card">
          <div class="card-icon">📊</div>
          <h2>System Stats</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">-</div>
              <div class="stat-label">Total Users</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">-</div>
              <div class="stat-label">Projects</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">-</div>
              <div class="stat-label">Messages</div>
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
  roles: ['admin'],
});

useHead({
  title: 'Admin Panel - AirBorn',
});
</script>

<style scoped>
.admin-page {
  max-width: 1200px;
  margin: 0 auto;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-xl);
}

.admin-card {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-xl);
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  text-decoration: none;
  color: var(--color-text-primary);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.admin-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.admin-card h2 {
  margin-bottom: var(--spacing-sm);
}

.card-description {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
  flex: 1;
}

.card-link {
  color: var(--color-primary);
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  width: 100%;
}

.stat-item {
  text-align: center;
  padding: var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}
</style>
