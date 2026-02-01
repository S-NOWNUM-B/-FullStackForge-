# FullStackForge

Портфолио-сайт на Next.js 16 + Firebase Firestore.

Production: https://fullstackforge.onrender.com

---

## Технологии

Frontend: Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion, Radix UI

Backend: Firebase Firestore, NextAuth.js v5, bcrypt

Hosting: Render.com, pnpm

---

## Установка

```bash
git clone https://github.com/S-NOWNUM-B/-FullStackForge-.git
cd fullStackForge
pnpm install
pnpm dev
```

http://localhost:3000

---

## Команды

```bash
pnpm dev                # Dev сервер
pnpm build              # Production сборка
pnpm lint               # ESLint
pnpm update             # Обновить зависимости

git add .
git commit -m "msg"
git push origin main
```

---

## Ссылки

Deployment:
- https://fullstackforge.onrender.com (Live)
- https://dashboard.render.com (Render Dashboard)
- https://github.com/S-NOWNUM-B/-FullStackForge- (GitHub)

Firebase:
- https://console.firebase.google.com (Firebase Console)
- https://console.firebase.google.com/project/fullstackforge-6618e/firestore (Firestore)
- https://console.firebase.google.com/project/fullstackforge-6618e/settings/serviceaccounts/adminsdk (Service Accounts)

---

## Переменные окружения

.env.local:

```env
FIREBASE_PROJECT_ID=fullstackforge-6618e
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@fullstackforge-6618e.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
AUTH_SECRET=your_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$10$...
NEXTAUTH_URL=http://localhost:3000
```

Render.com: То же самое, NEXTAUTH_URL=https://fullstackforge.onrender.com

---

## Структура

```
src/
├── app/           Pages, API routes
├── components/    React компоненты
├── config/        Auth config
├── constants/     Constants
├── services/      Firebase
├── utils/         Utilities
├── types/         TypeScript types
└── hooks/         Custom hooks
```

---

## Админ-панель

/admin (NextAuth.js защита)

Функции: управление проектами, работой, социальными ссылками

---

## Решение проблем

React Error #418 / 503 на /Projects:
- Проверить .env.local - все 3 Firebase переменные должны быть
- На Render: добавить переменные в Environment
- Перезапустить сервис

Dev не запускается:
```bash
rm -rf .next node_modules
pnpm install
pnpm dev
```

Ошибка Firebase:
```bash
echo $FIREBASE_PRIVATE_KEY
# Проверить что содержит \n между BEGIN и END
```

---

Автодеплой на Render при push. Firebase Firestore: 1GB, 50K reads/day. Коллекции: projects, contactMessages, workInfo, socialLinks.
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
