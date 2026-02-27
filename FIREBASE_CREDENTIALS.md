# Firebase Integration - Инструкции по получению Credentials

## 📋 Шаг 1: Получите Web App конфигурацию

1. Откройте [Firebase Console](https://console.firebase.google.com/project/fullstackforge-6618e/overview)
2. Нажмите на значок **⚙️ Settings** (правый верхний угол)
3. Перейдите в **Project Settings**
4. Выберите вкладку **Your apps** или **General**
5. Если нет веб-приложения, нажмите **Create web app** `</>`
6. Скопируйте конфигурацию:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "fullstackforge-6618e",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 📋 Шаг 2: Получите Service Account Key (для backend)

1. В **Project Settings** перейдите в вкладку **Service Accounts**
2. Нажмите **Generate New Private Key**
3. Скачается JSON файл с ключом
4. Откройте его и скопируйте данные:
   - `project_id`
   - `client_email`
   - `private_key`

## 📝 Шаг 3: Создайте `.env.local`

Скопируйте `.env.example` в `.env.local` и заполните:

```bash
cp .env.example .env.local
```

Отредактируйте `.env.local`:
```dotenv
# Firebase Backend (из Service Account Key)
FIREBASE_PROJECT_ID=fullstackforge-6618e
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@fullstackforge-6618e.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Frontend (из Web App конфигурации) - добавьте эти переменные
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fullstackforge-6618e.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fullstackforge-6618e
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fullstackforge-6618e.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

# Authentication
AUTH_SECRET=openssl rand -base64 32
ADMIN_PASSWORD_HASH=ваш_хеш_пароля

# URLs
NEXT_PUBLIC_BASE_URL=https://fullstackforge-6618e.web.app
NEXTAUTH_URL=https://fullstackforge-6618e.web.app

# Другие переменные
CRON_SECRET=ваш_секрет
UPLOADTHING_APP_ID=ваш_id
UPLOADTHING_TOKEN=ваш_токен
```

## 🔐 Важно!

⚠️ **Никогда не коммитьте `.env.local` в репозиторий!** Он уже в `.gitignore`.

Переменные формата `NEXT_PUBLIC_*` видны в браузере (это нормально, они для frontend-а).
Переменные без префикса приватные (только с backend-а и Cloud Functions).

## ✅ Проверка конфигурации

После заполнения `.env.local`:

```bash
pnpm install
pnpm run dev
```

Откройте http://localhost:3000 и проверьте что все работает.

## 🚀 Деплой на Firebase Hosting

Когда готово к деплою:

```bash
pnpm run firebase:build
pnpm run firebase:deploy
```

Сайт будет доступен на: https://fullstackforge-6618e.web.app
