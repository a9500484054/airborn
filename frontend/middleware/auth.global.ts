// middleware/auth.global.ts

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // публичные страницы
  const publicRoutes = [
    '/',
    '/login',
    '/verify-email',
    '/reset-password',
    '/under-construction',
  ]

  // если публичная страница — пропускаем
  if (publicRoutes.includes(to.path)) {
    return
  }

  // страницы, требующие авторизации
  const protectedPrefixes = [
    '/dashboard',
    '/projects',
    '/admin',
    '/chat',
  ]

  const requiresAuth = protectedPrefixes.some(prefix =>
    to.path === prefix || to.path.startsWith(prefix + '/')
  )

  if (!requiresAuth) {
    return
  }

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

  // не авторизован → главная
  if (!authStore.isAuthenticated) {
    return navigateTo('/')
  }
})