/* eslint-disable no-restricted-globals */
/**
 * Service Worker для AirBorn
 * Поддержка push-уведомлений (Android + iOS PWA)
 */

const CACHE_NAME = 'airborn-v1';

// Install
self.addEventListener('install', (event) => {
  console.log('[SW] Installed');
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  event.waitUntil(self.clients.claim());
});

// Push Notification
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');

  let data = {
    title: 'AirBorn',
    body: 'Новое сообщение',
    icon: '/icon-192.png',
    badge: '/icon-72.png'
  };

  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch (e) {
    console.warn('[SW] Invalid push payload');
  }

  const options = {
    body: data.body || 'У вас новое сообщение',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-72.png',
    data: data.data || { url: '/chat' },
    tag: 'airborn-chat-message',
    renotify: true,
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open', title: 'Открыть чат' },
      { action: 'close', title: 'Закрыть' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Click on notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const urlToOpen = event.notification.data?.url || '/chat';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clients => {
        for (const client of clients) {
          if (client.url.includes('/chat') && 'focus' in client) {
            return client.focus();
          }
        }
        return self.clients.openWindow(urlToOpen);
      })
  );
});