# 🚀 AirBorn - Полноценное Веб-Приложение

Современное production-ready веб-приложение, построенное на **NestJS** (Backend) и **Nuxt 4** (Frontend), с реальным временем (чат), управлением проектами, аутентификацией пользователей и админ-панелью.

---

## 📋 Содержание

- [Возможности](#-возможности)
- [Технологии](#-технологии)
- [Структура проекта](#-структура-проекта)
- [Требования](#-требования)
- [Быстрый старт](#-быстрый-старт)
- [Разработка](#-разработка)
- [Production развертывание](#-production-развертывание)
- [Документация API](#-документация-api)
- [Миграции БД](#-миграции-бд)
- [Seed данные](#-seed-данные)
- [Переменные окружения](#-переменные-окружения)
- [Устранение проблем](#-устранение-проблем)

---

## ✨ Возможности

### Публичные функции
- 🏠 **Лендинг** - Современный одностраничный сайт
- 📱 **Адаптивность** - Работает на всех устройствах
- 📬 **Форма обратной связи** - Генерация лидов с email уведомлениями

### Пользовательские функции
- 🔐 **Аутентификация** - JWT с access и refresh токенами
- 👤 **Профиль** - Редактирование профиля, смена пароля, аватар
- 📁 **Проекты** - Просмотр портфолио с детальными страницами
- 💬 **Чат** - Real-time чат на WebSockets с обменом файлами
- 🔍 **Поиск** - Полнотекстовый поиск в чате и проектах

### Административные функции
- 👥 **Управление пользователями** - Просмотр, редактирование, блокировка
- 🎭 **Роли** - Назначение ролей админ/пользователь
- 📊 **Проекты** - CRUD проектов портфолио
- 📬 **Лиды** - Просмотр заявок с формы

---

## 🛠️ Технологии

### Backend
| Технология | Версия | Назначение |
|------------|---------|---------|
| NestJS | 10.x | Backend фреймворк |
| TypeScript | 5.x | Типизированный JavaScript |
| TypeORM | 0.3.x | ORM для PostgreSQL |
| PostgreSQL | 15 | Основная БД |
| JWT | - | Аутентификация |
| Socket.IO | 4.x | WebSocket сервер |
| Swagger | - | Документация API |
| bcrypt | 5.x | Хеширование паролей |
| class-validator | - | Валидация DTO |
| helmet | - | Заголовки безопасности |
| @nestjs/throttler | - | Rate limiting |

### Frontend
| Технология | Версия | Назначение |
|------------|---------|---------|
| Nuxt | 4.x / 3.9+ | Vue фреймворк |
| Vue | 3.4+ | UI фреймворк |
| TypeScript | 5.x | Типизация |
| Pinia | 2.x | State management |
| Socket.IO Client | 4.x | WebSocket клиент |
| VueUse | 10.x | Утилиты composition API |

### Инфраструктура
| Технология | Назначение |
|------------|---------|
| Docker | Контейнеризация |
| Docker Compose | Оркестрация |
| Nginx | Reverse proxy |
| PostgreSQL | База данных |

---

## 📁 Структура проекта

```
airborn/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── common/            # Общие утилиты
│   │   │   ├── decorators/    # Декораторы
│   │   │   ├── dto/           # DTO
│   │   │   ├── filters/       # Фильтры исключений
│   │   │   ├── guards/        # Guards авторизации
│   │   │   ├── interceptors/  # Интерсепторы
│   │   │   └── pipes/         # Pipes валидации
│   │   ├── database/          # Миграции и seeders
│   │   │   ├── migrations/    # Миграции TypeORM
│   │   │   └── seeds/         # Seed данные
│   │   ├── modules/           # Модули
│   │   │   ├── auth/          # Аутентификация
│   │   │   ├── users/         # Пользователи
│   │   │   ├── projects/      # Проекты
│   │   │   ├── messages/      # Сообщения чата
│   │   │   ├── leads/         # Лиды
│   │   │   └── files/         # Загрузка файлов
│   │   ├── websocket/         # WebSocket шлюз
│   │   ├── app.module.ts      # Корневой модуль
│   │   └── main.ts            # Точка входа
│   ├── uploads/               # Загруженные файлы
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── frontend/                   # Nuxt Frontend
│   ├── assets/
│   │   └── css/
│   │       └── main.css       # Глобальные стили
│   ├── composables/           # Vue composables
│   ├── layouts/               # Лейауты
│   ├── middleware/            # Middleware маршрутов
│   ├── pages/                 # Страницы
│   │   ├── admin/             # Админ панели
│   │   ├── dashboard/         # Личный кабинет
│   │   ├── projects/          # Проекты
│   │   ├── index.vue          # Лендинг
│   │   ├── login.vue          # Вход
│   │   ├── register.vue       # Регистрация
│   │   └── chat.vue           # Чат
│   ├── stores/                # Pinia stores
│   ├── app.vue                # Корневой компонент
│   ├── nuxt.config.ts         # Конфигурация Nuxt
│   ├── package.json
│   └── Dockerfile
│
├── docker/                     # Docker конфигурация
│   ├── nginx/
│   │   └── nginx.conf         # Nginx reverse proxy
│   ├── docker-compose.yml     # Production compose
│   └── docker-compose.dev.yml # Development compose
│
├── docs/                       # Документация
│   └── deployment.md          # Руководство по деплою
│
└── README.md                   # Этот файл
```

---

## 📦 Требования

- **Node.js** 20.x LTS
- **Docker** 20.x +
- **Docker Compose** 2.x
- **npm** или **yarn**

---

## 🚀 Быстрый старт

### Вариант 1: Docker (Рекомендуется)

```bash
# Клонировать репозиторий
cd airborn

# Запустить все сервисы (production режим)
docker-compose -f docker/docker-compose.yml up --build

# Доступ к приложению
# Frontend: http://localhost
# Backend API: http://localhost/api
# Swagger Docs: http://localhost/docs
```

### Вариант 2: Локальная разработка

```bash
# Запустить PostgreSQL
docker-compose -f docker/docker-compose.yml up -d postgres

# Установить зависимости backend
cd backend
npm install

# Установить зависимости frontend
cd ../frontend
npm install

# Настроить окружение
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Запустить миграции БД
cd backend
npm run migration:run

# Запустить seed данные
npm run seed

# Запустить backend (порт 3000)
npm run start:dev

# Запустить frontend (порт 3001)
cd ../frontend
npm run dev
```

---

## 💻 Разработка

### Backend разработка

```bash
cd backend

# Установить зависимости
npm install

# Запустить в режиме watch
npm run start:dev

# Собрать для production
npm run build

# Запустить production сборку
npm run start:prod

# Создать миграцию
npm run migration:generate -- -n MigrationName

# Запустить миграции
npm run migration:run

# Откатить миграции
npm run migration:revert

# Запустить seed данные
npm run seed
```

### Frontend разработка

```bash
cd frontend

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev

# Собрать для production
npm run build

# Preview production сборки
npm run preview

# Lint кода
npm run lint
```

---

## 🌐 Production развертывание

### Использование Docker Compose

```bash
# Собрать и запустить production контейнеры
docker-compose -f docker/docker-compose.yml up -d --build

# Просмотр логов
docker-compose -f docker/docker-compose.yml logs -f

# Остановить все сервисы
docker-compose -f docker/docker-compose.yml down

# Остановить и удалить тома (ВНИМАНИЕ: удаляет данные)
docker-compose -f docker/docker-compose.yml down -v
```

### Ручное развертывание

1. **Собрать Backend:**
```bash
cd backend
npm install --production
npm run build
```

2. **Собрать Frontend:**
```bash
cd frontend
npm install
npm run build
```

3. **Настроить окружение:**
Установить production переменные (см. [Переменные окружения](#переменные-окружения))

4. **Запустить миграции:**
```bash
cd backend
npm run migration:run
npm run seed
```

5. **Запустить сервисы:**
```bash
# Backend
cd backend
npm run start:prod

# Frontend (рекомендуется PM2)
cd frontend
pm2 start npm --name "airborn-frontend" -- start
```

---

## 📚 Документация API

### Swagger UI

Интерактивная документация API доступна по адресу:
- **Локально:** http://localhost:3000/docs
- **Production:** http://your-domain/docs

### API Endpoints

#### Аутентификация
| Метод | Endpoint | Описание |
|--------|----------|-------------|
| POST | `/api/auth/register` | Регистрация пользователя |
| POST | `/api/auth/login` | Вход в систему |
| POST | `/api/auth/refresh` | Обновление токена |
| POST | `/api/auth/logout` | Выход из системы |
| GET | `/api/auth/me` | Получить текущего пользователя |

#### Пользователи
| Метод | Endpoint | Описание | Доступ |
|--------|----------|-------------|--------|
| GET | `/api/users` | Список пользователей | Admin |
| GET | `/api/users/:id` | Профиль пользователя | Auth |
| PUT | `/api/users/:id` | Обновить профиль | Auth |
| DELETE | `/api/users/:id` | Удалить пользователя | Admin |
| PATCH | `/api/users/:id/role` | Изменить роль | Admin |
| PATCH | `/api/users/:id/block` | Блокировать/разблокировать | Admin |

#### Проекты
| Метод | Endpoint | Описание | Доступ |
|--------|----------|-------------|--------|
| GET | `/api/projects` | Список проектов | Auth |
| GET | `/api/projects/:id` | Детали проекта | Auth |
| POST | `/api/projects` | Создать проект | Admin |
| PUT | `/api/projects/:id` | Обновить проект | Admin |
| DELETE | `/api/projects/:id` | Удалить проект | Admin |

#### Сообщения
| Метод | Endpoint | Описание | Доступ |
|--------|----------|-------------|--------|
| GET | `/api/messages` | Список сообщений | Auth |
| GET | `/api/messages/search` | Поиск сообщений | Auth |
| DELETE | `/api/messages/:id` | Удалить сообщение | Auth |

#### WebSocket События
| Событие | Направление | Описание |
|-------|-----------|-------------|
| `send_message` | Client → Server | Отправить сообщение |
| `new_message` | Server → Client | Получить сообщение |
| `typing_start` | Client → Server | Начал печатать |
| `typing_stop` | Client → Server | Перестал печатать |
| `user_typing` | Server → Client | Индикатор набора |
| `mark_read` | Client → Server | Отметить прочитанным |

#### Лиды
| Метод | Endpoint | Описание | Доступ |
|--------|----------|-------------|--------|
| POST | `/api/leads` | Отправить заявку | Public |
| GET | `/api/leads` | Список заявок | Admin |
| PATCH | `/api/leads/:id/status` | Обновить статус | Admin |

#### Файлы
| Метод | Endpoint | Описание | Доступ |
|--------|----------|-------------|--------|
| POST | `/api/files/upload` | Загрузить файл(ы) | Auth |
| GET | `/api/files/:id` | Скачать файл | Auth |
| DELETE | `/api/files/:id` | Удалить файл | Admin |

---

## 🗄️ Миграции БД

### Запуск миграций

```bash
cd backend

# Запустить все миграции
npm run migration:run

# Откатить последнюю миграцию
npm run migration:revert
```

### Создание новой миграции

```bash
# Автоматическая генерация (изменения в entity)
npm run migration:generate -- -n NewMigration

# Или вручную создать файл в src/database/migrations/
```

### Список миграций

Файлы миграций находятся в `backend/src/database/migrations/`:

1. `CreateUsersTable` - Таблица пользователей
2. `CreateProjectsTable` - Таблица проектов
3. `CreateMessagesTable` - Таблица сообщений
4. `CreateLeadsTable` - Таблица лидов

---

## 🌱 Seed Данные

Скрипт seed заполняет БД тестовыми данными:

- **2 Admin пользователя**
  - `admin@airborn.com` / `Admin123!`
  - `admin2@airborn.com` / `Admin123!`

- **10 Обычных пользователей**
  - `user1@airborn.com` до `user10@airborn.com`
  - Пароль: `User123!`

- **5 Проектов** с изображениями и файлами

- **50 Сообщений** в чате

### Запуск Seed

```bash
cd backend
npm run seed
```

---

## 🔐 Переменные окружения

### Backend (.env)

```env
# Приложение
NODE_ENV=development
PORT=3000
API_PREFIX=api

# База данных
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=airborn

# JWT
JWT_SECRET=ваш-секретный-ключ-jwt
JWT_EXPIRATION=15m
REFRESH_SECRET=ваш-секретный-ключ-refresh
REFRESH_EXPIRATION=7d

# Throttler
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Загрузка файлов
MAX_FILE_SIZE=20971520
UPLOAD_PATH=./uploads

# CORS
CORS_ORIGIN=http://localhost:3001

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@airborn.com
```

### Frontend (.env)

```env
NUXT_PUBLIC_API_URL=http://localhost:3000/api
NUXT_PUBLIC_WS_URL=ws://localhost:3000/chat
```

---

## 🔧 Устранение проблем

### Частые ошибки

**1. Ошибка подключения к БД**
```bash
# Проверить что PostgreSQL запущен
docker ps | grep postgres

# Перезапустить контейнер PostgreSQL
docker-compose -f docker/docker-compose.yml restart postgres
```

**2. Порт уже используется**
```bash
# Изменить PORT в backend/.env
# Изменить NUXT_PUBLIC_API_URL в frontend/.env
```

**3. Ошибки миграций**
```bash
# Сбросить миграции (ВНИМАНИЕ: удаляет данные)
docker-compose -f docker/docker-compose.yml down -v
docker-compose -f docker/docker-compose.yml up --build
```

**4. WebSocket не подключается**
- Проверить CORS настройки в backend
- Убедиться что WS_URL во frontend совпадает с backend
- Проверить настройки фаервола

**5. Загрузка файлов не работает**
- Убедиться что папка `uploads/` существует и доступна для записи
- Проверить MAX_FILE_SIZE в .env
- Убедиться что MIME типы файлов разрешены

### Логи

```bash
# Просмотр всех логов
docker-compose -f docker/docker-compose.yml logs -f

# Логи конкретного сервиса
docker-compose -f docker/docker-compose.yml logs -f backend
docker-compose -f docker/docker-compose.yml logs -f frontend
```

---

## 📞 Поддержка

По вопросам и проблемам:
- **Email:** support@airborn.com

---

## 📄 Лицензия

Проприетарное ПО. Все права защищены.

---

## 🎯 Учетные данные по умолчанию

| Роль | Email | Пароль |
|------|-------|--------|
| Admin | admin@airborn.com | Admin123! |
| Admin | admin2@airborn.com | Admin123! |
| User | user1@airborn.com | User123! |
| User | user2@airborn.com | User123! |
| ... | user[3-10]@airborn.com | User123! |

**⚠️ ВАЖНО:** Измените эти данные в production!

---

Создано с ❤️ командой AirBorn
