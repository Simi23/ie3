import vuePlugin from "@vitejs/plugin-vue";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  runtimeConfig: {
    public: {
      siteName: "",
      imgUrl: "",
    },
    trustProxy: "",
  },
  routeRules: {
    "/dashboard/**": { ssr: false },
    "/": { ssr: false },
  },
  spaLoadingTemplate: true,
  experimental: {
    asyncContext: true,
    componentIslands: true,
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
    "@nuxtjs/mdc",
  ],
  imports: {
    dirs: ["stores"],
  },
  ui: {
    safelistColors: ["primary", "astro", "astro-gray"],
  },
  mdc: {
    components: {
      prose: false,
    },
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
    compressPublicAssets: {
      brotli: true,
      gzip: true,
    },
  },
  security: {
    csrf: true,
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 10000,
    },
  },
  csurf: {
    enabled: true,
    cookieKey: "csrf-token",
    cookie: {
      httpOnly: false,
    },
    https: true,
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
