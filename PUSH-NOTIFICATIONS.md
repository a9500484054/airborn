# 🔔 Push-уведомления для чата

## Что реализовано

1. **Backend модуль** для управления push-подписками и отправки уведомлений
2. **Service Worker** для получения push-уведомлений в браузере
3. **Composable** `usePushNotifications()` для управления подпиской
4. **Кнопка включения/выключения** уведомлений в шапке чата
5. **Автоматическая отправка** push при новом сообщении

## 📋 Настройка

### 1. Добавьте VAPID ключи в backend/.env

Сгенерируйте ключи:
```bash
cd backend
node scripts/generate-vapid-keys.js
```

Скопируйте ключи в `backend/.env`:
```env
VAPID_PUBLIC_KEY=ваш_публичный_ключ
VAPID_PRIVATE_KEY=ваш_приватный_ключ
```

### 2. Пересоберите Docker образы

```bash
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

### 3. Проверьте работу

1. Откройте чат в браузере
2. Нажмите на колокольчик 🔔 в шапке
3. Разрешите уведомления когда браузер запросит
4. Откройте чат в другом браузере/устройстве
5. Отправьте сообщение
6. Вы должны получить push-уведомление!

## 🎯 Как это работает

### Подписка на уведомления

```
Пользователь нажимает 🔔
       ↓
Запрос разрешения браузера
       ↓
Создание подписки (PushManager)
       ↓
Отправка подписки на сервер (POST /api/push/subscribe)
       ↓
Сохранение в БД (таблица push_subscriptions)
```

### Отправка уведомлений

```
Пользователь отправляет сообщение
       ↓
ChatGateway.handleMessage()
       ↓
Сохранение в БД + broadcast через WebSocket
       ↓
PushNotificationService.sendToOthers()
       ↓
Отправка push всем кроме отправителя
```

### Получение уведомлений

```
Service Worker получает push (sw.js)
       ↓
Отображение уведомления (showNotification)
       ↓
Клик по уведомлению
       ↓
Открытие/фокусировка окна с чатом
```

## 📱 Поддержка устройств

| Платформа | Поддержка | Примечание |
|-----------|-----------|------------|
| Chrome Desktop | ✅ | Полная поддержка |
| Firefox Desktop | ✅ | Полная поддержка |
| Safari Desktop | ❌ | Не поддерживает Web Push API |
| Chrome Android | ✅ | Работает отлично |
| Firefox Android | ✅ | Работает |
| iOS Safari | ⚠️ | Ограниченная поддержка (iOS 16.4+) |
| Samsung Internet | ✅ | Работает |

## 🔧 Тестирование

### Отправить тестовое уведомление

```bash
curl -X POST http://localhost:3000/api/push/test \
  -H "Authorization: Bearer ВАШ_TOKEN" \
  -H "Content-Type: application/json"
```

### Проверить подписки в БД

```sql
SELECT * FROM push_subscriptions WHERE is_active = true;
```

### Проверить Service Worker

1. Откройте DevTools (F12)
2. Перейдите в Application → Service Workers
3. Должен быть активный `/sw.js`

## ⚙️ Конфигурация

### Настройка уведомлений

В `frontend/composables/usePushNotifications.ts` можно изменить:
- `VAPID_PUBLIC_KEY` - публичный ключ сервера

В `backend/src/modules/push-notification/push-notification.service.ts`:
- Email для VAPID (сейчас `mailto:admin@airborn.com`)

### Формат push-уведомления

```typescript
{
  title: "AirBorn - Имя отправителя",
  body: "Текст сообщения",
  icon: "/logo.svg",
  badge: "/logo.svg",
  data: {
    url: "/chat",
    messageId: "uuid",
    senderId: "uuid",
    senderName: "Имя"
  }
}
```

## 🐛 Troubleshooting

### Уведомления не приходят

1. Проверьте что VAPID ключи настроены в `.env`
2. Проверьте логи backend: `docker logs airborn-backend`
3. Проверьте что Service Worker активен (DevTools)
4. Проверьте разрешение уведомлений (настройки браузера)

### "Notifications not supported"

- Обновите браузер до последней версии
- Проверьте что используете HTTPS (для production)
- localhost работает для разработки

### Push не работает на iOS

iOS Safari имеет ограниченную поддержку Web Push:
- Требуется iOS 16.4+
- Пользователь должен добавить сайт на главный экран
- Уведомления работают только когда Safari открыт

## 📚 Технологии

- **web-push** - библиотека для отправки push-уведомлений
- **Push API** - браузерный API для push
- **Service Worker** - фоновый скрипт для получения push
- **VAPID** - протокол авторизации для push-уведомлений
