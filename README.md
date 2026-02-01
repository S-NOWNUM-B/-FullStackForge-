<div align="center">

## FullStackForge

### Современный и элегантный веб-сайт для презентации профессионального портфолио

**Интуитивный интерфейс · Современные технологии · Полный контроль**

</div>

---

## Содержание

- [Быстрый запуск для новых устройств](#быстрый-запуск-для-новых-устройств)
- [Быстрый запуск (обычный)](#быстрый-запуск-обычный)
- [Системные требования](#системные-требования)
- [Технологический стек](#технологический-стек)
- [Основные возможности](#основные-возможности)
- [Конфигурация проекта](#конфигурация-проекта)
- [Команды разработки](#команды-разработки)
- [Решение проблем](#решение-проблем)

---

## Быстрый запуск для новых устройств

> **Первый раз запускаете проект? Начните здесь!**

### 1. Клонируйте репозиторий

```bash
git clone <repository-url> Buisnes-website
cd Buisnes-website
```

### 2. Установите зависимости

```bash
pnpm install
```

**Если pnpm не установлен:**
```bash
npm install -g pnpm
```

### 3. Настройте переменные окружения

```bash
cp .env.example .env.local
```

**Отредактируйте `.env.local`:**
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/portfolio

# Admin Panel Password
ADMIN_PASSWORD=your_secure_password
```

### 4. Запуск проекта

```bash
pnpm dev
```

### 5. Откройте браузер

```
http://localhost:3000
```

**Готово!** Проект полностью настроен и готов к работе.

---

## Быстрый запуск (обычный)

> **Стандартный процесс запуска приложения**

### Способ 1: Режим разработки (Рекомендуется)

```bash
pnpm dev
```

Откройте [http://localhost:3000](http://localhost:3000) — изменения применяются автоматически.

### Способ 2: Production режим

```bash
pnpm build
pnpm start
```

Оптимизированная сборка для продакшена.

---

## Системные требования

<div align="center">

| Компонент | Минимум | Рекомендуется | Проверка |
|:---------:|:-------:|:-------------:|:--------:|
| **Node.js**  | 18.0+    | 20.0+         | `node --version`  |
| **pnpm** | 9.0+ | 10.0+           | `pnpm --version`    |
| **npm**     | 10+      | 10+           | `npm --version`     |
| **Порты** | 3000 | Свободен | Автоматическая проверка |
| **RAM** | 512 MB | 2 GB+ | — |
| **Диск** | 200 MB | 500 MB+ | Зависимости + данные |

</div>

---

## Технологический стек

<table>
<tr>
<td width="50%">

### Frontend

- **Next.js** — React фреймворк для production
- **React** — библиотека для построения UI
- **TypeScript** — типизированный JavaScript
- **Tailwind CSS** — utility-first CSS фреймворк
- **Framer Motion** — библиотека анимаций
- **Radix UI** — unstyled UI компоненты
- **Lucide React** — набор иконок

</td>
<td width="50%">

### Backend & Tools

- **Next.js API Routes** — серверные API endpoints
- **MongoDB** — NoSQL база данных
- **Mongoose** — ODM для MongoDB
- **JWT** — токены авторизации
- **React Hook Form** — управление формами
- **Zod** — валидация схем данных
- **Axios** — HTTP клиент
- **pnpm** — менеджер пакетов
- **ESLint** — линтер для кода

</td>
</tr>
</table>

---

## Основные возможности

<table>
<tr>
<td width="50%">

### Главная страница

- **Привлекательный дизайн**  
  Современная hero-секция с призывами к действию
  
- **Плавные анимации**  
  Framer Motion для плавных переходов
  
- **Адаптивный макет**  
  Отлично выглядит на всех устройствах
  
- **Оптимизация производительности**  
  Быстрая загрузка и отзывчивость
  
- **SEO-оптимизация**  
  Правильная структура для поисковых систем
  
- **Темная/светлая тема**  
  Поддержка переключения тем

</td>
<td width="50%">

### Страница "О себе"

- **Детальная информация**  
  Профессиональные навыки и опыт
  
- **Технологические стеки**  
  Визуализация технологий с иконками
  
- **Интерактивные элементы**  
  Hover-эффекты и анимации
  
- **Загрузка с MongoDB**  
  Динамическое обновление контента
  
- **Модульная архитектура**  
  Переиспользуемые компоненты
  
- **TypeScript типизация**  
  Безопасность типов на всех уровнях

</td>
</tr>
<tr>
<td width="50%">

### Портфолио проектов

- **Интерактивная галерея**  
  Карточки проектов с превью
  
- **Фильтрация по технологиям**  
  Быстрый поиск нужных проектов
  
- **Детальные страницы**  
  Полное описание каждого проекта
  
- **Ссылки на демо и GitHub**  
  Прямой доступ к проектам
  
- **Адаптивная сетка**  
  Оптимальное отображение на любых экранах
  
- **Lazy loading**  
  Оптимизация загрузки изображений

</td>
<td width="50%">

### Контакты и обратная связь

- **Контактная форма**  
  React Hook Form с валидацией
  
- **Отправка сообщений**  
  Сохранение в MongoDB
  
- **Валидация с Zod**  
  Проверка на клиенте и сервере
  
- **Toast-уведомления**  
  Обратная связь для пользователя
  
- **Часто задаваемые вопросы**  
  Раздел FAQ с ответами
  
- **Социальные сети**  
  Ссылки на профили

</td>
</tr>
</table>

### Административная панель

<div align="center">

| Функция | Описание |
|:--------|:---------|
| **Управление проектами** | Добавление, редактирование и удаление проектов |
| **Настройки сайта** | Изменение основной информации и контента |
| **Просмотр сообщений** | Доступ к сообщениям из контактной формы |
| **Защита паролем** | JWT-авторизация для безопасности |
| **Интуитивный интерфейс** | Простое управление без технических знаний |

</div>

---

## Конфигурация проекта

### Структура .env файлов

<div align="center">

| Файл | Назначение | Обязательность |
|:-----|:-----------|:--------------:|
| `.env.local` | MongoDB URI, пароль админ-панели | Да |
| `.env.example` | Шаблон для переменных окружения | Рекомендуется |

</div>

### Настройка переменных окружения

<details>
<summary><b>Развернуть для настройки .env</b></summary>

<br>

#### .env.local
```env
# MongoDB Connection (ОБЯЗАТЕЛЬНО!)
MONGODB_URI=mongodb://localhost:27017/portfolio
# Для MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority

# Admin Panel Authentication (ОБЯЗАТЕЛЬНО!)
ADMIN_PASSWORD=your_secure_password_here

# JWT Secret (опционально, генерируется автоматически)
JWT_SECRET=your_jwt_secret_key_32_characters

# Next.js Configuration (опционально)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Генерация безопасных ключей

```bash
# Генерация JWT secret (32 символа, URL-safe)
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"

# Генерация пароля (20 символов)
node -e "console.log(require('crypto').randomBytes(20).toString('hex'))"
```

#### Настройка MongoDB

**Локальная установка:**
```bash
# macOS (через Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Проверка
mongosh
```

**MongoDB Atlas (облачная):**
1. Зарегистрируйтесь на [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Создайте бесплатный кластер (M0)
3. Добавьте IP адрес (0.0.0.0/0 для разработки)
4. Создайте пользователя БД
5. Скопируйте connection string в `.env.local`

</details>

---

## Команды разработки

<div align="center">

| Задача | Команда                       |
|:-------|:------------------------------|
| **Запустить dev сервер** | `pnpm dev`                    |
| **Собрать для продакшена** | `pnpm build`                  |
| **Запустить prod сервер** | `pnpm start`                   |
| **Проверить линтером** | `pnpm lint`                   |
| **Установить зависимости** | `pnpm install`                |
| **Обновить зависимости** | `pnpm update`                 |
| **Очистить кеш** | `pnpm clean`                  |
| **Проверка Node.js** | `node --version`              |
| **Проверка pnpm** | `pnpm --version`              |
| **Проверка портов** | `lsof -i :3000` (macOS/Linux) |

</div>

---

## Решение проблем

<details>
<summary><b>Обновил код из репозитория, но изменения не применяются</b></summary>

<br>

**Проблема:** После `git pull` новый код не работает, старые ошибки остаются.

**Причина:** Dev сервер работает в памяти со старой конфигурацией. Перезагрузка браузера не помогает!

**Решение:**

```bash
# 1. Остановите dev сервер
# Нажмите Ctrl+C в терминале где запущен pnpm dev

# 2. Обновите код
git pull origin main

# 3. Обновите зависимости (если изменился package.json)
pnpm install

# 4. Перезапустите проект
pnpm dev
```

**Проверка успешного обновления:**
- Откройте http://localhost:3000 в **новой вкладке** (Cmd+T / Ctrl+T)
- Очистите кеш браузера: Cmd+Shift+R (Mac) или Ctrl+Shift+R (Windows/Linux)
- Проверьте терминал на наличие ошибок компиляции

</details>

<details>
<summary><b>Dev сервер не запускается</b></summary>

<br>

```bash
# Проверьте версии
node --version      # Требуется 18.0+
pnpm --version      # Требуется 9.0+

# Переустановите зависимости
rm -rf node_modules .next
pnpm install

# Запуск с подробными логами
pnpm dev --debug
```

**Типичные проблемы:**
- `Module not found` → Запустите `pnpm install`
- `Port 3000 already in use` → См. следующий раздел
- `MongoDB connection failed` → Проверьте `MONGODB_URI` в `.env.local`

</details>

<details>
<summary><b>Порт 3000 занят</b></summary>

<br>

**Проверка занятого порта:**

```bash
# macOS/Linux
lsof -i :3000

# Windows
netstat -an | findstr :3000
```

**Освобождение порта:**

```bash
# macOS/Linux
kill -9 $(lsof -ti:3000)

# Windows
taskkill /F /PID <PID_NUMBER>
```

**Использование другого порта:**

```bash
# Запуск на порту 3001
pnpm dev -p 3001
```

</details>

<details>
<summary><b>Проблемы с MongoDB</b></summary>

<br>

```bash
# Проверка работы MongoDB (локально)
mongosh

# Проверка подключения
mongosh "mongodb://localhost:27017/portfolio"

# Перезапуск MongoDB (macOS)
brew services restart mongodb-community

# Проверка логов
tail -f /usr/local/var/log/mongodb/mongo.log
```

**Типичные проблемы:**
- `connection refused` → MongoDB не запущен
- `authentication failed` → Проверьте credentials в `MONGODB_URI`
- `database does not exist` → База создастся автоматически при первом запуске
- `timeout` → Проверьте сетевое подключение (для Atlas)

</details>

<details>
<summary><b>Проблемы с зависимостями</b></summary>

<br>

```bash
# Полная переустановка
rm -rf node_modules .next pnpm-lock.yaml
pnpm install

# Проверка устаревших пакетов
pnpm outdated

# Обновление всех пакетов
pnpm update

# Проверка конфликтов
pnpm ls
```

**Если pnpm не установлен:**
```bash
npm install -g pnpm
```

**Альтернатива с npm:**
```bash
npm install
npm run dev
```

</details>

<details>
<summary><b>Проблемы с админ-панелью</b></summary>

<br>

**Не могу войти в админ-панель:**

```bash
# Проверьте .env.local
cat .env.local | grep ADMIN_PASSWORD

# Убедитесь что пароль установлен
echo "ADMIN_PASSWORD=new_secure_password" >> .env.local

# Перезапустите dev сервер
pnpm dev
```

**JWT ошибки:**
```bash
# Сгенерируйте новый JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"

# Добавьте в .env.local
echo "JWT_SECRET=<generated_secret>" >> .env.local
```

</details>

<details>
<summary><b>Расширенная диагностика</b></summary>

<br>

```bash
# Полная диагностика системы
pnpm dev --debug 2>&1 | tee debug.log

# Проверка процессов
ps aux | grep node
ps aux | grep next

# Проверка использования портов
lsof -i :3000  # Next.js
lsof -i :27017 # MongoDB

# Проверка переменных окружения
cat .env.local

# Очистка всех кешей
rm -rf node_modules .next .pnpm-store
pnpm store prune
pnpm install
```

</details>

---

<div align="center">

**[Вернуться наверх](#личный-сайт-визитка)**

</div>
