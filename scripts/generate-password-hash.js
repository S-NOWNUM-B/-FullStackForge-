/**
 * Скрипт для генерации хеша пароля администратора
 * Запуск: node scripts/generate-password-hash.js YOUR_PASSWORD
 */

const bcrypt = require('bcrypt');

const password = process.argv[2];

if (!password) {
  console.error('❌ Использование: node scripts/generate-password-hash.js YOUR_PASSWORD');
  process.exit(1);
}

async function generateHash() {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('\n✅ Хеш пароля успешно сгенерирован!\n');
    console.log('Добавьте эту строку в ваш .env файл:\n');
    console.log(`ADMIN_PASSWORD_HASH="${hash}"\n`);
    console.log('⚠️  Не коммитьте файл .env в Git!\n');
  } catch (error) {
    console.error('❌ Ошибка при генерации хеша:', error);
    process.exit(1);
  }
}

generateHash();
