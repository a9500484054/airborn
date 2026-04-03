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
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'AirBorn - Professional project development and innovative solutions' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
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
