// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  runtimeConfig: {
    public: {
      siteName: process.env.SITE_NAME,
    },
    trustProxy: Boolean(process.env.TRUST_PROXY),
  },
  routeRules: {
    "/dashboard/**": { ssr: false },
  },
  spaLoadingTemplate: true,
  experimental: {
    asyncContext: true,
  },
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "dark",
  },
  app: {
    head: {
      title: "Infósok Éjszakája",
    },
  },
  modules: [
    "@nuxt/image",
    "@vueuse/nuxt",
    "@nuxt/ui",
    "nuxt-csurf",
    "nuxt-security",
    "@nuxtjs/google-fonts",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],
    "@nuxt/eslint",
    "@nuxt/icon",
  ],
  imports: {
    dirs: ["stores"],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  googleFonts: {
    families: {
      Roboto: true,
    },
  },
  $development: {
    security: {
      headers: {
        crossOriginEmbedderPolicy: "unsafe-none",
      },
    },
  },
});
