import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

if (!MONGODB_URI) {
  throw new Error('Пожалуйста, определите переменную окружения MONGODB_URI в файле .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: CachedConnection | undefined;
}

let cached: CachedConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Попытки подключения с экспоненциальным backoff.
 * При неудаче даём ясную подсказку в логах чтобы быстро решить проблему
 * (например: проверить MONGODB_URI и белый список IP в MongoDB Atlas).
 */
async function connectWithRetry(retries = 2): Promise<typeof mongoose> {
  let attempt = 0;

  const tryConnect = async (): Promise<typeof mongoose> => {
    attempt += 1;
    try {
      const opts = {
        // Быстрее таймаут для ускорения ответа
        serverSelectionTimeoutMS: 3000,
        socketTimeoutMS: 3000,
        connectTimeoutMS: 3000,
        bufferCommands: false,
      } as const;

      const m = await mongoose.connect(MONGODB_URI, opts);
      console.log('✅ MongoDB подключен успешно');
      return m;
    } catch (err: any) {
      const msg = err?.message || err;
      console.error(`Ошибка подключения к MongoDB (попытка ${attempt}/${retries}):`, msg);

      if (attempt >= retries) {
        console.error('❗ Не удалось подключиться к MongoDB после нескольких попыток.');
        console.error('Проверьте следующие вещи:');
        console.error('- Переменная окружения `MONGODB_URI` настроена корректно.');
        console.error('- В MongoDB Atlas добавлен белый список IP (Network Access).');
        console.error("  Для Render используйте временно 0.0.0.0/0 или настройте VPC Peering/Private Endpoint.");
        console.error('- Кластер доступен и не в режиме обслуживания.');
        console.error('Документация Atlas (whitelist): https://www.mongodb.com/docs/atlas/security/whitelist/');
        throw err;
      }

      // Уменьшенный backoff
      const delayMs = 1000 * attempt;
      await new Promise((res) => setTimeout(res, delayMs));
      return tryConnect();
    }
  };

  return tryConnect();
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = connectWithRetry().then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Ошибка подключения к MongoDB (в dbConnect):', (e as any)?.message || e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
