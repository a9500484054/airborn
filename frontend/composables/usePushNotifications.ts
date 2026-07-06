// composables/usePushNotifications.ts
export function usePushNotifications() {
  const isSupported = ref(false)
  const isSubscribed = ref(false)
  const permission = ref<'default' | 'granted' | 'denied'>('default')
  const isIOS = ref(false)

  const config = useRuntimeConfig()

  if (typeof window !== 'undefined') {
    isIOS.value = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'iPad' && 'ontouchend' in document)
    
    isSupported.value = 'serviceWorker' in navigator && 
                       'PushManager' in window && 
                       'Notification' in window
  }

  async function enableNotifications() {
    if (!isSupported.value) return false

    try {
      const result = await Notification.requestPermission()
      permission.value = result

      if (result === 'granted') {
        const registration = await navigator.serviceWorker.register('/sw.js')
        
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            'BDoyA9IH2uICx4pe2YANLiipZnUf_1ixGj9IFsGGuKYHGYsl9hWA99YfbpLWnDNGxwY3z5y0-10kKehT33qFoEc'
          )
        })

        await sendSubscriptionToServer(subscription)
        isSubscribed.value = true
        return true
      }
      return false
    } catch (error) {
      console.error('[Push] Enable failed:', error)
      return false
    }
  }

  async function sendSubscriptionToServer(subscription: PushSubscription) {
    const authStore = useAuthStore()
    if (!authStore.accessToken) return false

    try {
      await $fetch(`${config.public.apiUrl}/push/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        body: {
          endpoint: subscription.endpoint,
          keys: subscription.toJSON().keys
        }
      })
      console.log('[Push] Subscription sent successfully')
      return true
    } catch (e) {
      console.error('[Push] Send subscription failed:', e)
      return false
    }
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
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
    enableNotifications
  }
}