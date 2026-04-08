/**
 * Composable для управления Push-уведомлениями
 * Регистрация, подписка и управление push-уведомлениями
 */

import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useChatStore } from '~/stores/chat'

export function usePushNotifications() {
  const isSupported = ref(false)
  const isSubscribed = ref(false)
  const permission = ref(Notification.permission)
  const config = useRuntimeConfig()

  // VAPID публичный ключ (можно получить с бэкенда или захардкодить)
  // В production лучше получать с бэкенда через API
  const VAPID_PUBLIC_KEY = 'BOqJy-Le8PVItD8rQ6O9xZYMk5yWo_TqlTyRU6rwVGfA6qQ9VmmmCWISN89stoa0GaFFRrbVqwvqnG9B9xOuQYw'

  /**
   * Конвертирует base64 в Uint8Array
   */
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  /**
   * Проверяет поддержку push-уведомлений
   */
  function checkSupport() {
    isSupported.value = 
      'serviceWorker' in navigator && 
      'PushManager' in window &&
      'Notification' in window
    
    return isSupported.value
  }

  /**
   * Запрашивает разрешение на уведомления
   */
  async function requestPermission() {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      console.warn('Notification permission denied')
      return false
    }

    try {
      const permissionResult = await Notification.requestPermission()
      permission.value = permissionResult
      return permissionResult === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  /**
   * Регистрирует Service Worker
   */
  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })
      console.log('[Push] Service Worker registered')
      return registration
    } catch (error) {
      console.error('[Push] Service Worker registration failed:', error)
      throw error
    }
  }

  /**
   * Подписывается на push-уведомления
   */
  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready
      
      // Проверяем существующую подписку
      let subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        console.log('[Push] Already subscribed')
        isSubscribed.value = true
        return subscription
      }

      // Создаём новую подписку
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      })

      console.log('[Push] Subscribed to push notifications')
      isSubscribed.value = true

      // Отправляем подписку на сервер
      await sendSubscriptionToServer(subscription)

      return subscription
    } catch (error) {
      console.error('[Push] Subscription failed:', error)
      throw error
    }
  }

  /**
   * Отправляет подписку на сервер
   */
  async function sendSubscriptionToServer(subscription: PushSubscription) {
    try {
      const authStore = useAuthStore()
      
      const response = await fetch(`${config.public.apiUrl}/push/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.accessToken}`,
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.toJSON().keys?.p256dh,
            auth: subscription.toJSON().keys?.auth,
          },
        }),
      })

      if (response.ok) {
        console.log('[Push] Subscription sent to server')
      } else {
        console.error('[Push] Failed to send subscription to server')
      }
    } catch (error) {
      console.error('[Push] Error sending subscription to server:', error)
    }
  }

  /**
   * Отписывается от push-уведомлений
   */
  async function unsubscribe() {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        await subscription.unsubscribe()
        isSubscribed.value = false
        console.log('[Push] Unsubscribed')
      }
    } catch (error) {
      console.error('[Push] Unsubscribe failed:', error)
      throw error
    }
  }

  /**
   * Инициализация push-уведомлений
   */
  async function initialize() {
    if (!checkSupport()) {
      console.warn('[Push] Push notifications not supported')
      return false
    }

    try {
      // Регистрируем Service Worker
      await registerServiceWorker()

      // Если уже есть разрешение, подписываемся
      if (Notification.permission === 'granted') {
        await subscribeToPush()
        return true
      }

      return false
    } catch (error) {
      console.error('[Push] Initialization failed:', error)
      return false
    }
  }

  /**
   * Полная настройка push-уведомлений (запрос разрешения + подписка)
   */
  async function enableNotifications() {
    // Проверяем поддержку
    if (!checkSupport()) {
      alert('Ваш браузер не поддерживает push-уведомления')
      return false
    }

    // Запрашиваем разрешение
    const granted = await requestPermission()
    if (!granted) {
      return false
    }

    // Подписываемся
    await subscribeToPush()
    
    console.log('[Push] Notifications enabled')
    return true
  }

  onMounted(() => {
    checkSupport()
    
    // Проверяем статус подписки
    if (isSupported.value) {
      navigator.serviceWorker.ready.then(async (registration) => {
        const subscription = await registration.pushManager.getSubscription()
        isSubscribed.value = !!subscription
      })
    }
  })

  return {
    isSupported,
    isSubscribed,
    permission,
    initialize,
    enableNotifications,
    unsubscribe,
    requestPermission,
  }
}
