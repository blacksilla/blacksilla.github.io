export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n', '@nuxt/fonts'],
  css: ['~/assets/css/themes.css', '~/assets/css/main.css', '~/assets/css/motion.css'],
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    locales: [
      { code: 'en', language: 'en-GB', name: 'English', file: 'en.json' },
      { code: 'pt', language: 'pt-PT', name: 'Português', file: 'pt.json' },
      { code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' },
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' },
      { code: 'de', language: 'de-DE', name: 'Deutsch', file: 'de.json' },
    ],
    baseUrl: 'https://blacksilla.github.io',
  },
  nitro: { prerender: { routes: ['/', '/pt', '/es', '/fr', '/de'] } },
  app: {
    head: {
      title: 'Afonso Silva',
      link: [
        { rel: 'icon', href: '/images/favicon_io/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/images/favicon_io/apple-touch-icon.png' },
      ],
    },
  },
})
