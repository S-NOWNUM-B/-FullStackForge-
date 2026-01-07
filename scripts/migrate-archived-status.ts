/**
 * Скрипт для миграции проектов со статусом 'archived' в 'draft'
 * Запуск из корня проекта: node --loader tsx scripts/migrate-archived-status.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('✗ Ошибка: MONGODB_URI не найден в .env.local');
  process.exit(1);
}

async function migrate() {
  try {
    console.log('Подключение к MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Подключено к MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('База данных недоступна');
    }

    const projectsCollection = db.collection('projects');

    // Находим все проекты со статусом 'archived'
    const archivedProjects = await projectsCollection.find({ status: 'archived' }).toArray();
    
    console.log(`\nНайдено проектов со статусом 'archived': ${archivedProjects.length}`);

    if (archivedProjects.length > 0) {
      // Обновляем статус на 'draft'
      const result = await projectsCollection.updateMany(
        { status: 'archived' },
        { $set: { status: 'draft' } }
      );

      console.log(`✓ Обновлено проектов: ${result.modifiedCount}`);
      
      // Показываем обновленные проекты
      archivedProjects.forEach(project => {
        console.log(`  - ${project.title} (${project._id})`);
      });
    } else {
      console.log('✓ Проектов со статусом "archived" не найдено');
    }

    console.log('\n✓ Миграция завершена успешно!');
  } catch (error) {
    console.error('✗ Ошибка миграции:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Отключено от MongoDB');
  }
}

migrate();
