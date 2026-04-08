/**
 * Скрипт для генерации иконок из logo.svg
 * Запускать: node scripts/generate-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'logo.svg');

// Проверяем существование SVG
if (!fs.existsSync(svgPath)) {
  console.error('❌ Файл logo.svg не найден!');
  process.exit(1);
}

// Настройки иконок
const icons = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
];

// Настройки OG Image
const ogImage = {
  name: 'og-image.jpg',
  width: 1200,
  height: 630,
};

async function generateIcon(inputSvg, outputPath, size) {
  try {
    await sharp(Buffer.from(inputSvg))
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
    
    console.log(`✓ ${outputPath} (${size}x${size})`);
  } catch (error) {
    console.error(`✗ Ошибка создания ${outputPath}:`, error.message);
  }
}

async function generateOGImage(inputSvg, outputPath, width, height) {
  try {
    // Создаём SVG с фоном и логотипом для OG image
    const ogSvg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6" />
            <stop offset="100%" style="stop-color:#2563eb" />
          </linearGradient>
        </defs>
        
        <!-- Фон -->
        <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
        
        <!-- Логотип по центру -->
        <g transform="translate(${width/2 - 80}, ${height/2 - 120}) scale(4)">
          ${inputSvg.match(/<g[^>]*>([\s\S]*)<\/g>/)?.[1] || ''}
        </g>
        
        <!-- Текст -->
        <text x="${width/2}" y="${height/2 + 80}" 
              font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
              font-size="48" 
              font-weight="bold" 
              fill="white" 
              text-anchor="middle">
          AirBorn
        </text>
        
        <text x="${width/2}" y="${height/2 + 130}" 
              font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
              font-size="24" 
              fill="rgba(255,255,255,0.9)" 
              text-anchor="middle">
          Professional project development
        </text>
      </svg>
    `;

    await sharp(Buffer.from(ogSvg))
      .resize(width, height)
      .jpeg({ quality: 90 })
      .toFile(outputPath);
    
    console.log(`✓ ${outputPath} (${width}x${height})`);
  } catch (error) {
    console.error(`✗ Ошибка создания ${outputPath}:`, error.message);
  }
}

async function main() {
  console.log('\n🎨 Генерация иконок из logo.svg...\n');
  
  // Читаем SVG
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  
  // Генерируем иконки
  console.log('📱 Создаём иконки:');
  for (const icon of icons) {
    const outputPath = path.join(publicDir, icon.name);
    await generateIcon(svgContent, outputPath, icon.size);
  }
  
  // Генерируем OG Image
  console.log('\n🖼️  Создаём OG изображение:');
  const ogPath = path.join(publicDir, ogImage.name);
  await generateOGImage(svgContent, ogPath, ogImage.width, ogImage.height);
  
  console.log('\n✅ Все иконки созданы!');
  console.log('📂 Файлы сохранены в:', publicDir);
  console.log('\n📝 Проверьте файлы и замените их если нужно.');
  console.log('   Для production используйте Figma или RealFaviconGenerator.net\n');
}

main().catch(console.error);
