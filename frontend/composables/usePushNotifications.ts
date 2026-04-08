/**
 * Composable для Push-уведомлений
 * iOS НЕ поддерживает Web Push API (кроме 16.4+ на Home Screen)
 */

export function usePushNotifications() {
  const isSupported = ref(false)
  const isSubscribed = ref(false)
  const permission = ref(Notification?.permission || 'default')
  const isIOS = ref(false)

  // Проверяем ТОЛЬКО на клиенте
  if (typeof window !== 'undefined') {
    isIOS.value = /iPad|iPhone|iPod/.test(navigator.userAgent)
    isSupported.value = 
      !isIOS.value && // iOS не поддерживает
      'serviceWorker' in navigator && 
      'PushManager' in window &&
      'Notification' in window
  }

  async function initialize() {
    if (!isSupported.value) {
      console.log('[Push] Not supported (iOS or old browser)')
      return false
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' })

      if (Notification.permission === 'granted') {
        return await subscribeToPush(registration)
      }
      
      return false
    } catch (error) {
      console.error('[Push] Init failed:', error)
      return false
    }
  }

  async function enableNotifications() {
    if (isIOS.value) {
      alert('На iOS push-уведомления работают только если добавить сайт на главный экран (iOS 16.4+)')
      return false
    }

    if (!isSupported.value) {
      alert('Push-уведомления не поддерживаются в этом браузере')
      return false
    }

    try {
      const result = await Notification.requestPermission()
      permission.value = result

      if (result === 'granted') {
        const registration = await navigator.serviceWorker.ready
        return await subscribeToPush(registration)
      }
      
      return false
    } catch (error) {
      console.error('[Push] Permission error:', error)
      return false
    }
  }

  async function subscribeToPush(registration) {
    try {
      let subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        isSubscribed.value = true
        await sendSubscriptionToServer(subscription)
        return true
      }

      // VAPID public key
      const applicationServerKey = urlBase64ToUint8Array(
        'BOqJy-Le8PVItD8rQ6O9xZYMk5yWo_TqlTyRU6rwVGfA6qQ9VmmmCWISN89stoa0GaFFRrbVqwvqnG9B9xOuQYw'
      )
      
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      })

      isSubscribed.value = true
      return await sendSubscriptionToServer(subscription)
    } catch (error) {
      console.error('[Push] Subscribe failed:', error)
      return false
    }
  }

  async function sendSubscriptionToServer(subscription) {
    try {
      const authStore = useAuthStore()
      const config = useRuntimeConfig()
      
      const response = await $fetch(`${config.public.apiUrl}/push/subscribe`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        body: {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.toJSON().keys?.p256dh,
            auth: subscription.toJSON().keys?.auth,
          },
        },
      })

      console.log('[Push] Subscription sent:', response)
      return true
    } catch (error) {
      console.error('[Push] Send subscription failed:', error)
      return false
    }
  }

  async function unsubscribe() {
    if (!isSupported.value) return

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        await subscription.unsubscribe()
        isSubscribed.value = false
      }
    } catch (error) {
      console.error('[Push] Unsubscribe failed:', error)
    }
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  return {
    isSupported,
    isSubscribed,
    isIOS,
    permission,
    initialize,
    enableNotifications,
    unsubscribe,
  }
}
