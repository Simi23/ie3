/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./mail/templates/*.vue",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      backgroundImage: {
        // TODO: Change this URL to final site URL
        "mail-bg": "url('https://files.penguin.hu/hatter.png')",
        "web-bg": "url('/background.webp')",
      },
      colors: {
        astro: {
          50: "#edf1ff",
          100: "#dfe5ff",
          200: "#c5ceff",
          300: "#a2aeff",
          400: "#7d83fc",
          500: "#625ef6",
          600: "#5241ea",
          700: "#4633cf",
          800: "#3a2ca7",
          900: "#2a246e", // BASE
          950: "#1f194d",
        },
        "astro-gray": {
          50: "#E5E5E8",
          100: "#D2D1D6",
          200: "#C1C0C6",
          300: "#AAAAB5",
          400: "#9190A0",
          500: "#79778E",
          600: "#5C5B77",
          700: "#3E3D59",
          800: "#272542",
          900: "#181633",
          950: "#070521",
        },
        fuchsia: {
          50: "#fef5fd",
          100: "#fdeafd",
          200: "#fbd3fa",
          300: "#f6b1f0",
          400: "#f082e5",
          500: "#e352d5",
          600: "#bc2fab", // BASE
          700: "#a52693",
          800: "#872177",
          900: "#6f2062",
          950: "#49093e",
        },
        cyan: {
          50: "#f1f9fe",
          100: "#e3f1fb",
          200: "#c0e5f7",
          300: "#88d1f1",
          400: "#49bae7",
          500: "#2aa9de", // BASE
          600: "#1381b6",
          700: "#116793",
          800: "#12587a",
          900: "#154965",
          950: "#0e2f43",
        },
        indigo: {
          50: "#f2f5fc",
          100: "#e2eaf7",
          200: "#cbd9f2",
          300: "#a8c2e8",
          400: "#7ea2dc",
          500: "#6083d1",
          600: "#5571c7", // BASE
          700: "#4258b3",
          800: "#3b4992",
          900: "#334075",
          950: "#232948",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
