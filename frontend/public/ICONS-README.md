# 📱 Мета-теги и иконки AirBorn

## Что добавлено

### 1. OG (Open Graph) мета-теги
При отправке ссылки в мессенджерах (Telegram, WhatsApp, VK) будет отображаться:
- **Заголовок**: AirBorn - Innovative Solutions
- **Описание**: Professional project development and innovative solutions
- **Изображение**: `/og-image.jpg` (1200x630px)

### 2. PWA (Progressive Web App) поддержка
Сайт можно добавить на главный экран телефона с иконкой:
- **iOS**: Apple Touch Icon (180x180)
- **Android**: Web App Manifest с иконками 192x192 и 512x512
- **Тема**: Цвет темы `#3b82f6` (синий)

### 3. Мета-теги для мобильных устройств
- Theme color для мобильных браузеров
- Apple Web App Capable (полноэкранный режим)
- Status bar style для iOS
- Viewport с поддержкой notch (iPhone X+)

## 📋 Необходимые файлы иконок

Все файлы должны находиться в `frontend/public/`:

| Файл | Размер | Назначение |
|------|--------|------------|
| `logo.svg` | Вектор | Основная SVG иконка (уже есть) |
| `favicon-16x16.png` | 16x16 | Фавикон для браузеров |
| `favicon-32x32.png` | 32x32 | Фавикон для браузеров |
| `apple-touch-icon.png` | 180x180 | Иконка для iOS (главный экран) |
| `icon-192x192.png` | 192x192 | Android/PWA иконка |
| `icon-512x512.png` | 512x512 | Android/PWA большая иконка |
| `og-image.jpg` | 1200x630 | Изображение для соцсетей |
| `manifest.json` | - | PWA манифест (уже создан) |

## 🎨 Как создать реальные иконки

### Способ 1: Использовать генератор (Рекомендуется)

1. Запустите проект локально:
   ```bash
   cd frontend
   npm run dev
   ```

2. Откройте в браузере: `http://localhost:3000/generate-icons.html`

3. Нажмите **"Скачать все иконки"**

4. Переместите скачанные файлы в `frontend/public/`

### Способ 2: Figma / Sketch

1. Откройте ваш дизайн логотипа
2. Экспортируйте в размерах: 16x16, 32x32, 180x180, 192x192, 512x512
3. Для OG Image создайте дизайн 1200x630px
4. Сохраните в `frontend/public/`

### Способ 3: Онлайн генераторы

- **RealFaviconGenerator**: https://realfavicongenerator.net/
- Загрузите `logo.svg` и скачайте все форматы
- Переместите файлы в `frontend/public/`

## 🔧 Проверка работы

### OG мета-теги
Используйте инструменты для предпросмотра:
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **Telegram**: Отправьте ссылку себе и посмотрите превью

### PWA на телефоне
1. Откройте сайт на телефоне
2. Нажмите "Добавить на главный экран"
3. Должна появиться иконка AirBorn
4. При открытии - полноэкранный режим без адресной строки

## 📝 Что в коде

### nuxt.config.ts
```typescript
app: {
  head: {
    meta: [
      // OG теги
      { property: 'og:title', content: 'AirBorn...' },
      { property: 'og:image', content: '/og-image.jpg' },
      
      // iOS
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      
      // Тема
      { name: 'theme-color', content: '#3b82f6' },
    ],
    link: [
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/manifest.json' },
    ]
  }
}
```

### manifest.json
Определяет как сайт ведёт себя при добавлении на главный экран:
- **name**: Полное название
- **short_name**: Короткое название под иконкой
- **icons**: Набор иконок для разных устройств
- **display**: standalone (без адресной строки)

## ⚠️ Важно

Сейчас используются **placeholder** файлы. Для production обязательно замените их на реальные иконки с вашим логотипом!

## 🎯 Рекомендуемые действия

1. ✅ Создайте реальные иконки (см. способы выше)
2. ✅ Замените placeholder файлы в `frontend/public/`
3. ✅ Пересоберите Docker образ
4. ✅ Проверьте OG теги через валидаторы
5. ✅ Протестируйте добавление на главный экран телефона
