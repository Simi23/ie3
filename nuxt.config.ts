import vuePlugin from "@vitejs/plugin-vue";

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
    "/": { ssr: false },
  },
  spaLoadingTemplate: true,
  experimental: {
    asyncContext: true,
  },
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "dark",
  },
  app: {
    head: {
      title: "Infósok Éjszakája",
    },
    pageTransition: {
      name: "page",
      mode: "out-in",
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
  nitro: {
    rollupConfig: {
      // @ts-ignore
      plugins: [vuePlugin()],
    },
  },
  security: {
    csrf: true,
  },
  csurf: {
    enabled: true,
    cookieKey: "csrf-token",
    cookie: {
      httpOnly: false,
    },
    // TODO: add https (secure)
  },
  $development: {
    security: {
      headers: {
        crossOriginEmbedderPolicy: "unsafe-none",
      },
    },
    csurf: {
      https: false,
    },
  },
});
