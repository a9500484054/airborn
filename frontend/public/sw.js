/* eslint-disable no-restricted-globals */
/**
 * Service Worker для Push-уведомлений
 * Обрабатывает получение и отображение push-уведомлений
 */

const CACHE_NAME = 'airborn-v1';

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installed');
  self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// Обработка push-уведомлений
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');

  if (!event.data) {
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: 'AirBorn',
      body: event.data.text(),
      icon: '/logo.svg',
      badge: '/logo.svg',
    };
  }

  const title = data.title || 'AirBorn';
  const options = {
    body: data.body || 'Новое сообщение',
    icon: data.icon || '/logo.svg',
    badge: data.badge || '/logo.svg',
    image: data.image || null,
    data: data.data || {},
    tag: data.data?.messageId || 'default',
    renotify: true,
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Открыть чат',
        icon: '/logo.svg',
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/logo.svg',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Открываем или фокусируем окно приложения
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Ищем уже открытое окно
      for (const client of clients) {
        if (client.url.includes('/chat') && 'focus' in client) {
          return client.focus();
        }
      }

      // Если нет окна с чатом, открываем новое
      if (self.clients.openWindow) {
        return self.clients.openWindow(event.notification.data?.url || '/chat');
      }
    })
  );
});

// Обработка закрытия уведомления
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed');
});

// Кэширование статики (только GET запросы)
self.addEventListener('fetch', (event) => {
  // Пропускаем нестандартные схемы
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Кэшируем ТОЛЬКО GET запросы для статики (изображения, шрифты, CSS, JS)
  if (event.request.method !== 'GET') {
    return; // Не трогаем POST, PUT, DELETE и т.д.
  }

  // Для изображений и шрифтов используем cache-first
  const isStaticAsset = 
    event.request.destination === 'image' ||
    event.request.destination === 'font' ||
    event.request.destination === 'style' ||
    event.request.destination === 'script';

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
    );
    return;
  }

  // Для HTML страниц используем network-first
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Для всего остального (включая API) - только network без кэша
  event.respondWith(fetch(event.request));
});
