// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-01-01',
  devtools: { enabled: true },

  // Modules
  modules: [
    '@pinia/nuxt',
  ],

  // Runtime configuration
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000/api',
      wsUrl: process.env.NUXT_PUBLIC_WS_URL || 'ws://localhost:3000/chat',
    },
  },

  // App configuration
  app: {
    head: {
      title: 'AirBorn - Innovative Solutions',
      htmlAttrs: {
        lang: 'ru'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'AirBorn - Профессиональный монтаж вентиляции и кондиционирования' },
        
        // Theme color for mobile browsers
        { name: 'theme-color', content: '#3b82f6' },
        { name: 'msapplication-TileColor', content: '#3b82f6' },
        
        // iOS specific
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'AirBorn' },
        { name: 'format-detection', content: 'telephone=no' },
        
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://airborn.com/' },
        { property: 'og:title', content: 'AirBorn - Innovative Solutions' },
        { property: 'og:description', content: 'Профессиональный монтаж вентиляции и кондиционирования' },
        { property: 'og:image', content: '/og-image.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:site_name', content: 'AirBorn' },
        { property: 'og:locale', content: 'ru_RU' },
        
        // Twitter
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:url', content: 'https://airborn.com/' },
        { property: 'twitter:title', content: 'AirBorn - Innovative Solutions' },
        { property: 'twitter:description', content: 'Профессиональный монтаж вентиляции и кондиционирования' },
        { property: 'twitter:image', content: '/og-image.jpg' },
      ],
      link: [
        // Favicon
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        
        // Apple Touch Icon (for home screen)
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        
        // Android/Web App Manifest
        { rel: 'manifest', href: '/manifest.json' },
      ],
    },
  },

  // CSS
  css: ['~/assets/css/main.css'],

  // Vite configuration
  vite: {
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 3001,
      },
    },
  },

  // TypeScript
  typescript: {
    strict: true,
  },

  // Route rules for SSR/SPA hybrid
  routeRules: {
    // Landing page - SSR
    '/': { ssr: true },
    // Auth pages - SSR
    '/login': { ssr: false },
    '/verify-email': { ssr: false },
    '/reset-password': { ssr: false },
    // Dashboard and app - SPA
    '/dashboard/**': { ssr: false },
    '/chat': { ssr: false },
    '/projects/**': { ssr: false },
    '/admin/**': { ssr: false },
    '/under-construction': { ssr: true },
    // 404 page
    '/404': { ssr: true },
  },

  // Compatibility
  nitro: {
    devProxy: {
      '/uploads': {
        target: 'http://localhost:3000/uploads',
        changeOrigin: true,
      },
    },
    esbuild: {
      options: {
        target: 'es2020',
      },
    },
  },
});
