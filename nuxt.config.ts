// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  serverHandlers: [
    // API handlers with express
    // NOTE: If change route, paths in .env, config and lib/url.ts must be changed
    { route: '/api/**', handler: './server-folder/index.ts' },
  ],
  devtools: { enabled: true },
  alias: {
    "@": '../src'
  },
  dir: {
    pages: './src/app/routes'
  },
  css: [
    './src/assets/css/main.css',
  ],
  modules: [
    '@pinia/nuxt',
  ],
  runtimeConfig: {
    public: {
      PORT: '8000',
      SOCKET_PORT: process.env.SOCKET_PORT ? process.env.SOCKET_PORT : '3000',
      SOCKET_URL: process.env.SOCKET_URL ? process.env.SOCKET_URL : "http://localhost:3000",
      bdUrl: process.env.DATABASE_URL,
      baseURL: process.env.baseURL,
      projectName: process.env.projectName,
    }
  },
})
