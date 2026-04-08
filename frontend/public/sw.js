/* eslint-disable no-restricted-globals */
/**
 * Service Worker для AirBorn
 * Push-уведомления (Android/Desktop Chrome)
 * НА iOS НЕ РАБОТАЕТ - iOS не поддерживает Web Push API
 */

// Установка
self.addEventListener('install', (event) => {
  console.log('[SW] Installed');
  self.skipWaiting();
});

// Активация
self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  event.waitUntil(self.clients.claim());
});

// Обработка push-уведомлений
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: 'AirBorn',
      body: 'Новое сообщение',
      icon: '/logo.svg',
      badge: '/logo.svg',
    };
  }

  const title = data.title || 'AirBorn';
  const options = {
    body: data.body || 'Новое сообщение',
    icon: data.icon || '/logo.svg',
    badge: data.badge || '/logo.svg',
    data: data.data || {},
    tag: data.data?.messageId || 'default',
    renotify: true,
    requireInteraction: false,
    actions: [
      { action: 'open', title: 'Открыть' },
      { action: 'close', title: 'Закрыть' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Клик по уведомлению
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  event.notification.close();

  if (event.action !== 'close') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        for (const client of clients) {
          if (client.url.includes('/chat') && 'focus' in client) {
            return client.focus();
          }
        }
        return self.clients.openWindow('/chat');
      })
    );
  }
});

// Кэширование ТОЛЬКО GET запросов для статики
self.addEventListener('fetch', (event) => {
  // Пропускаем всё кроме http/https
  if (!event.request.url.startsWith('http')) return;
  
  // ВАЖНО: Только GET запросы!
  if (event.request.method !== 'GET') return;

  // Кэшируем только статику
  const isStatic = ['image', 'style', 'script', 'font'].includes(event.request.destination);
  
  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        
        return fetch(event.request).then((res) => {
          if (res.status === 200) {
            const clone = res.clone();
            caches.open('airborn-v1').then((cache) => cache.put(event.request, clone));
          }
          return res;
        }).catch(() => fetch(event.request));
      })
    );
  }
});
