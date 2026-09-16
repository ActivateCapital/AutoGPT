import type { Config } from "tailwindcss"

const config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: "rgb(var(--night-rgb) / <alpha-value>)",
          deep: "#0a0c0e",
        },
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        cream: {
          DEFAULT: "rgb(var(--cream-rgb) / <alpha-value>)",
          soft: "rgb(var(--cream-soft-rgb) / <alpha-value>)",
        },
        leaf: {
          DEFAULT: "rgb(var(--leaf-rgb) / <alpha-value>)",
          deep: "rgb(var(--leaf-deep-rgb) / <alpha-value>)",
        },
        ember: "rgb(var(--ember-rgb) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-grotesk)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        measure: "64ch",
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
