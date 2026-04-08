/**
 * Скрипт для генерации VAPID ключей для push-уведомлений
 * Запускать: node scripts/generate-vapid-keys.js
 */

const crypto = require('crypto');

function generateVAPIDKeys() {
  // Генерируем случайную кривую P-256
  const curve = crypto.createECDH('prime256v1');
  curve.generateKeys();
  
  // Получаем публичный и приватный ключи
  const publicKey = curve.getPublicKey('base64url');
  const privateKey = curve.getPrivateKey('base64url');

  console.log('\n🔑 VAPID Keys для push-уведомлений:\n');
  console.log('VAPID_PUBLIC_KEY=' + publicKey);
  console.log('VAPID_PRIVATE_KEY=' + privateKey);
  console.log('\n📋 Добавьте эти ключи в файл backend/.env\n');
  
  return { publicKey, privateKey };
}

generateVAPIDKeys();
