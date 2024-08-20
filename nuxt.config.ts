// import vue from "@vitejs/plugin-vue";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  runtimeConfig: {
    public: {
      siteName: process.env.SITE_NAME,
    },
    trustProxy: Boolean(process.env.TRUST_PROXY),
    smtpSettings: {
      host: process.env.SMTP_HOST ?? "localhost",
      port: Number(process.env.SMTP_PORT ?? 25),
      secure: Boolean(process.env.SMTP_SECURE ?? false),
      user: process.env.SMTP_USER ?? "username",
      password: process.env.SMTP_PASSWORD ?? "password",
      from: process.env.SMTP_FROM ?? 'Sender "<sender@email.com>"',
    },
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
  // nitro: {
  //   rollupConfig: {
  //     // @ts-expect-error
  //     plugins: [vue()],
  //   },
  // },
  $development: {
    security: {
      headers: {
        crossOriginEmbedderPolicy: "unsafe-none",
      },
    },
  },
});
