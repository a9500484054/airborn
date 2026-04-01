<template>
  <div class="layout-auth">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-mobile-open': mobileMenuOpen }">
      <div class="sidebar-header">
        <NuxtLink to="/dashboard" class="logo">
          <div class="logo-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L4 12L16 20L28 12L16 4Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M4 20L16 28L28 20" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <circle cx="16" cy="12" r="2" fill="currentColor"/>
            </svg>
          </div>
          <span class="logo-text">AirBorn</span>
        </NuxtLink>
        <button class="mobile-close" @click="mobileMenuOpen = false">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <NuxtLink to="/dashboard" class="sidebar-link" :class="{ active: $route.path === '/dashboard' }">
          <div class="link-icon-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2.5 7.5L10 2.5L17.5 7.5L10 12.5L2.5 7.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M5 10L5 15L10 17.5L15 15L15 10" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
          <span>Дашборд</span>
        </NuxtLink>

        <NuxtLink to="/projects" class="sidebar-link" :class="{ active: $route.path.startsWith('/projects') }">
          <div class="link-icon-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2.5" y="3.5" width="15" height="13" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M6.5 7.5H13.5M6.5 10.5H10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <span>Проекты</span>
        </NuxtLink>

        <NuxtLink to="/chat" class="sidebar-link" :class="{ active: $route.path === '/chat' }">
          <div class="link-icon-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C8.5 17.5 7.5 17 6.5 16.5L2.5 17.5L3.5 13.5C3 12.5 2.5 11.5 2.5 10Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
          <span>Чат</span>
        </NuxtLink>

        <template v-if="authStore.isAdmin">
          <div class="sidebar-divider"></div>
          <NuxtLink to="/admin" class="sidebar-link" :class="{ active: $route.path.startsWith('/admin') }">
            <div class="link-icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 12.5C12.0711 12.5 13.75 10.8211 13.75 8.75C13.75 6.67893 12.0711 5 10 5C7.92893 5 6.25 6.67893 6.25 8.75C6.25 10.8211 7.92893 12.5 10 12.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <path d="M15.5 16.25C14.5 15 12.5 13.75 10 13.75C7.5 13.75 5.5 15 4.5 16.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>
            </div>
            <span>Администрирование</span>
          </NuxtLink>
        </template>
      </nav>

      <!-- User Menu at Bottom -->
      <div class="sidebar-footer">
        <div class="user-menu-bottom" @click="toggleUserMenu">
          <div class="user-avatar-bottom">
            {{ authStore.userInitials }}
          </div>
          <div class="user-info-bottom">
            <div class="user-name-bottom">{{ authStore.userName }}</div>
            <div class="user-role-bottom" :class="`role-${authStore.user?.role}`">
              {{ authStore.user?.role === 'admin' ? 'Администратор' : 'Пользователь' }}
            </div>
          </div>
          <svg 
            class="dropdown-arrow" 
            :class="{ 'dropdown-arrow-open': userMenuOpen }"
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none"
          >
            <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>

        <!-- Dropdown Menu -->
        <transition name="dropdown">
          <div v-if="userMenuOpen" class="user-dropdown">
              <!-- <div class="dropdown-item" @click="handleProfile">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="currentColor" stroke-width="1.2"/>
                <path d="M14.25 14.25C13.125 12.75 11.25 11.25 9 11.25C6.75 11.25 4.875 12.75 3.75 14.25" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                <circle cx="9" cy="9" r="7.5" stroke="currentColor" stroke-width="1.2"/>
              </svg>
              <span>Профиль</span>
            </div>
            <div class="dropdown-item" @click="handleSettings">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="currentColor" stroke-width="1.2"/>
                <path d="M14.25 14.25C13.125 12.75 11.25 11.25 9 11.25C6.75 11.25 4.875 12.75 3.75 14.25" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                <circle cx="9" cy="9" r="7.5" stroke="currentColor" stroke-width="1.2"/>
              </svg>
              <span>Настройки</span>
            </div>
            <div class="dropdown-divider"></div> -->
            <div class="dropdown-item logout-item" @click="handleLogout">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M6.75 2.25H3.75C3.35218 2.25 2.97064 2.40804 2.68934 2.68934C2.40804 2.97064 2.25 3.35218 2.25 3.75V14.25C2.25 14.6478 2.40804 15.0294 2.68934 15.3107C2.97064 15.592 3.35218 15.75 3.75 15.75H6.75M12 12.75L15.75 9L12 5.25M15.75 9H6.75" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
              <span>Выйти</span>
            </div>
          </div>
        </transition>
      </div>
    </aside>

    <!-- Mobile Menu Overlay -->
    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="mobileMenuOpen = false"></div>

    <!-- Main Content -->
    <div class="auth-content">
      <!-- Top Bar -->
      <header class="top-bar">
        <button class="mobile-menu-btn" @click="mobileMenuOpen = true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <div class="user-menu">
          <div class="user-info-compact">
            <span class="user-name-compact">{{ authStore.userName }}</span>
            <span class="user-role-compact" :class="`role-${authStore.user?.role}`">
              {{ authStore.user?.role === 'admin' ? 'Admin' : 'User' }}
            </span>
          </div>
          <div class="user-avatar-compact" @click="toggleUserMenuMobile">
            {{ authStore.userInitials }}
          </div>
        </div>

        <!-- Mobile Dropdown -->
        <transition name="dropdown">
          <div v-if="userMenuOpenMobile" class="user-dropdown-mobile">
            <!-- <div class="dropdown-item" @click="handleProfile">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="currentColor" stroke-width="1.2"/>
                <path d="M14.25 14.25C13.125 12.75 11.25 11.25 9 11.25C6.75 11.25 4.875 12.75 3.75 14.25" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                <circle cx="9" cy="9" r="7.5" stroke="currentColor" stroke-width="1.2"/>
              </svg>
              <span>Профиль</span>
            </div>
            <div class="dropdown-item" @click="handleSettings">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="currentColor" stroke-width="1.2"/>
                <path d="M14.25 14.25C13.125 12.75 11.25 11.25 9 11.25C6.75 11.25 4.875 12.75 3.75 14.25" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                <circle cx="9" cy="9" r="7.5" stroke="currentColor" stroke-width="1.2"/>
              </svg>
              <span>Настройки</span>
            </div> -->
            <!-- <div class="dropdown-divider"></div> -->
            <div class="dropdown-item logout-item" @click="handleLogout">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M6.75 2.25H3.75C3.35218 2.25 2.97064 2.40804 2.68934 2.68934C2.40804 2.97064 2.25 3.35218 2.25 3.75V14.25C2.25 14.6478 2.40804 15.0294 2.68934 15.3107C2.97064 15.592 3.35218 15.75 3.75 15.75H6.75M12 12.75L15.75 9L12 5.25M15.75 9H6.75" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
              <span>Выйти</span>
            </div>
          </div>
        </transition>
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
const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);
const userMenuOpenMobile = ref(false);

const handleLogout = async () => {
  userMenuOpen.value = false;
  userMenuOpenMobile.value = false;
  await authStore.logout();
};

const handleProfile = () => {
  userMenuOpen.value = false;
  userMenuOpenMobile.value = false;
  navigateTo('/profile');
};

const handleSettings = () => {
  userMenuOpen.value = false;
  userMenuOpenMobile.value = false;
  navigateTo('/settings');
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

const toggleUserMenuMobile = () => {
  userMenuOpenMobile.value = !userMenuOpenMobile.value;
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.sidebar-footer') && !target.closest('.user-menu-bottom')) {
    userMenuOpen.value = false;
  }
  if (!target.closest('.top-bar') && !target.closest('.user-avatar-compact')) {
    userMenuOpenMobile.value = false;
  }
};

// Close mobile menu on route change
watch(() => useRoute().path, () => {
  mobileMenuOpen.value = false;
  userMenuOpen.value = false;
  userMenuOpenMobile.value = false;
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.layout-auth {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  transition: transform 0.3s ease;
  z-index: 100;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  padding: 24px 24px 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.sidebar-header .logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-icon-wrapper {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.5px;
}

.mobile-close {
  display: none;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mobile-close:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

/* Sidebar Navigation */
.sidebar-nav {
  flex: 1;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.link-icon-wrapper {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
  transform: translateX(4px);
}

.sidebar-link.active {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.sidebar-link.active .link-icon-wrapper svg {
  stroke: white;
}

.sidebar-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 16px 0;
}

/* Sidebar Footer with User Menu */
.sidebar-footer {
  padding: 16px;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.user-menu-bottom {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
}

.user-menu-bottom:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.user-avatar-bottom {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.user-info-bottom {
  flex: 1;
  min-width: 0;
}

.user-name-bottom {
  font-weight: 600;
  color: white;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role-bottom {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.user-role-bottom.role-admin {
  color: #f87171;
}

.user-role-bottom.role-user {
  color: #4ade80;
}

.dropdown-arrow {
  color: rgba(255, 255, 255, 0.6);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.dropdown-arrow-open {
  transform: rotate(180deg);
}

/* User Dropdown Menu */
.user-dropdown {
  position: absolute;
  bottom: 100%;
  left: 16px;
  right: 16px;
  margin-bottom: 8px;
  background: white;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #1e293b;
  font-size: 14px;
  font-weight: 500;
}

.dropdown-item:hover {
  background: #f1f5f9;
}

.dropdown-item svg {
  color: #64748b;
}

.dropdown-item:hover svg {
  color: #3b82f6;
}

.logout-item {
  color: #ef4444;
}

.logout-item svg {
  color: #ef4444;
}

.logout-item:hover {
  background: #fef2f2;
}

.dropdown-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 8px 0;
}

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Main Content */
.auth-content {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Top Bar */
.top-bar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 12px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  min-height: 65px;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  color: #1e293b;
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
  background: #f1f5f9;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.user-info-compact {
  text-align: right;
}

.user-name-compact {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  
}

.user-role-compact {
  display: block;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-role-compact.role-admin {
  color: #ef4444;
}

.user-role-compact.role-user {
  color: #22c55e;
}

.user-avatar-compact {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.user-avatar-compact:hover {
  transform: scale(1.05);
}

/* Mobile Dropdown */
.user-dropdown-mobile {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 12px;
  padding: 8px;
  min-width: 200px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

/* Page Content */
.page-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 99;
  display: none;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar {
    width: 260px;
  }
  
  .auth-content {
    margin-left: 260px;
  }
  
  .page-content {
    padding: 24px;
  }

}

@media (max-width: 768px) {

  .sidebar {
    transform: translateX(-100%);
    width: 280px;
  }
  
  .sidebar-mobile-open {
    transform: translateX(0);
  }
  
  .mobile-close {
    display: flex;
  }
  
  .mobile-overlay {
    display: block;
  }
  
  .auth-content {
    margin-left: 0;
  }
  
  .top-bar {
    padding: 12px 20px;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .user-info-compact {
    display: none;
  }
  
  .page-content {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .page-content {
    padding: 16px;
  }
  
  .top-bar {
    padding: 10px 16px;
  }
  
  .user-avatar-compact {
    width: 36px;
    height: 36px;
    font-size: 12px;
  }
}
@media (min-width: 768px) {
  .top-bar {
    display: none;
  }
}

/* Scrollbar Styling */
.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.page-content::-webkit-scrollbar {
  width: 6px;
}

.page-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.page-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
</style>