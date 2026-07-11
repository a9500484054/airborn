// middleware/auth.ts

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // восстановление сессии
  if (!authStore.isAuthenticated) {
    authStore.initFromStorage()
  }

  if (!authStore.isAuthenticated && authStore.refreshToken) {
    const refreshed = await authStore.refreshToken()
    if (refreshed) {
      await authStore.fetchUser()
      return
    }
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/')
  }
})