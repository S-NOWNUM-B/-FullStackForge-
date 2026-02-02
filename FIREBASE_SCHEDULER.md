# Firebase Cloud Scheduler Setup

Firebase Cloud Scheduler позволяет запускать cron-задачи напрямую от Google, не полагаясь на сторонние сервисы.

## Альтернативный вариант: Google Cloud Scheduler

**Преимущества Google Cloud Scheduler:**
- Встроено в экосистему Google Cloud / Firebase
- Надежнее внешних сервисов типа cron-job.org
- Бесплатно первые 3 задачи в месяц
- После: $0.10 за задачу в месяц

## Текущая конфигурация

Сейчас используются:
1. **Render Cron Jobs** - каждые 5 минут
2. **Резервная копия**: Можно добавить внешний сервис

## Как добавить Google Cloud Scheduler

### 1. Создать Cloud Function для пинга

```bash
# В Firebase Console перейти в Functions
# Создать новую функцию:
```

**Функция (Node.js):**
```javascript
const https = require('https');

exports.keepaliveScheduled = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'fullstackforge.onrender.com',
        path: '/api/health',
        method: 'GET'
      };

      https.request(options, (res) => {
        console.log(`Keepalive ping sent. Status: ${res.statusCode}`);
        resolve();
      }).on('error', (err) => {
        console.error('Keepalive ping failed:', err);
        reject(err);
      }).end();
    });
  });
```

### 2. Развернуть функцию

```bash
firebase deploy --only functions:keepaliveScheduled
```

### 3. Настроить Cloud Scheduler в Google Cloud Console

1. Перейти в Google Cloud Console
2. Cloud Scheduler → Create Job
3. Frequency: `*/5 * * * *`
4. Timezone: `UTC`
5. Execution type: `Pub/Sub`
6. Topic: `projects/YOUR_PROJECT_ID/topics/keepalive`

## Рекомендация

**Оставить текущую конфигурацию (Render + cron-job.org)**, так как:
- Render Cron Jobs встроены и не требуют доп. настройки
- Уже настроено в render.yaml
- Работает на free tier
- Резервная cron-job.org тоже активна

**Добавить Firebase Cloud Scheduler для экономии**, если нужна более надежная система.

## Текущие пингования

- **Render Cron Jobs**: каждые 5 минут → `/api/cron`
- **cron-job.org**: резервно (если нужно включить)

Это гарантирует, что сервис не будет усыпляться на free tier Render.
