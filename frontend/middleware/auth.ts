/**
 * Auth Middleware
 * Protects routes that require authentication
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  
  // Initialize auth from localStorage if needed
  if (!authStore.isAuthenticated) {
    authStore.initFromStorage();
  }

  // Check if route requires auth
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Try to refresh token
    if (authStore.refreshToken) {
      const refreshed = await authStore.refreshToken();
      if (refreshed) {
        await authStore.fetchUser();
        return;
      }
    }
    
    // Redirect to login with return URL
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }

  // Check role-based access
  if (to.meta.roles && authStore.isAuthenticated) {
    const requiredRoles = to.meta.roles as string[];
    if (!requiredRoles.includes(authStore.user?.role || '')) {
      return navigateTo('/dashboard');
    }
  }

  // Redirect logged-in users away from auth pages
  if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    return navigateTo('/dashboard');
  }
});
