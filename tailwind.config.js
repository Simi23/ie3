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
          50: "#f5f6f9",
          100: "#e8e9f1",
          200: "#d7d9e6",
          300: "#bbbfd5",
          400: "#999ec1",
          500: "#8184b0",
          600: "#6f6fa1",
          700: "#666392",
          800: "#575479",
          900: "#4f4d6b",
          950: "#302e3d",
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
  plugins: [],
};
