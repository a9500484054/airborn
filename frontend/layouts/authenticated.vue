<template>
  <div class="layout-auth">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <NuxtLink to="/dashboard" class="logo">
          <span class="logo-icon">✈</span>
          <span class="logo-text">AirBorn</span>
        </NuxtLink>
      </div>

      <nav class="sidebar-nav">
        <NuxtLink to="/dashboard" class="sidebar-link" :class="{ active: $route.path === '/dashboard' }">
          <span class="link-icon">👤</span>
          <span>Profile</span>
        </NuxtLink>
        <NuxtLink to="/projects" class="sidebar-link" :class="{ active: $route.path.startsWith('/projects') }">
          <span class="link-icon">📁</span>
          <span>Projects</span>
        </NuxtLink>
        <NuxtLink to="/chat" class="sidebar-link" :class="{ active: $route.path === '/chat' }">
          <span class="link-icon">💬</span>
          <span>Chat</span>
        </NuxtLink>
        <template v-if="authStore.isAdmin">
          <NuxtLink to="/admin" class="sidebar-link" :class="{ active: $route.path.startsWith('/admin') }">
            <span class="link-icon">⚙️</span>
            <span>Admin</span>
          </NuxtLink>
        </template>
      </nav>

      <div class="sidebar-footer">
        <button @click="handleLogout" class="btn btn-outline btn-sm logout-btn">
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="auth-content">
      <!-- Top Bar -->
      <header class="top-bar">
        <div class="user-menu">
          <div class="user-avatar">
            {{ authStore.userInitials }}
          </div>
          <div class="user-info">
            <span class="user-name">{{ authStore.userName }}</span>
            <span class="user-role badge" :class="`badge-${authStore.user?.role === 'admin' ? 'primary' : 'success'}`">
              {{ authStore.user?.role }}
            </span>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="page-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
};
</script>

<style scoped>
.layout-auth {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-bg-secondary);
}

.sidebar {
  width: 260px;
  background-color: var(--color-bg-dark);
  color: var(--color-text-inverse);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header .logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text-inverse);
  text-decoration: none;
}

.sidebar-nav {
  flex: 1;
  padding: var(--spacing-lg) 0;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--color-text-light);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.sidebar-link:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--color-text-inverse);
}

.sidebar-link.active {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.link-icon {
  font-size: 1.25em;
}

.sidebar-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  justify-content: center;
  gap: var(--spacing-sm);
  color: var(--color-text-light);
  border-color: rgba(255, 255, 255, 0.2);
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-text-inverse);
}

.auth-content {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
}

.top-bar {
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  justify-content: flex-end;
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: var(--font-size-sm);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.user-name {
  font-weight: 600;
  color: var(--color-text-primary);
}

.user-role {
  font-size: var(--font-size-xs);
  text-transform: capitalize;
}

.page-content {
  flex: 1;
  padding: var(--spacing-xl);
  overflow-y: auto;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .auth-content {
    margin-left: 0;
  }

  .layout-auth {
    flex-direction: column;
  }
}
</style>
