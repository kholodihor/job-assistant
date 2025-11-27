/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: ["stroke-blue-700", "fill-blue-700"],
  theme: {
    extend: {
      padding: {
        dynamic: "clamp(20px, 7vw, 80px)", // Мінімум 80px, масштаб 5vw, максимум 300px
      },
      fontFamily: {
        sans: ["var(--font-open-sans)"],
      },
      fontSize: {
        "h1-3xl": [
          "96px",
          { lineHeight: "100%", letterSpacing: "0", fontWeight: "600" },
        ],
        "h1-large": [
          "80px",
          { lineHeight: "100%", letterSpacing: "0", fontWeight: "600" },
        ],
        h1: [
          "64px",
          { lineHeight: "100%", letterSpacing: "0", fontWeight: "600" },
        ],
        "h1-sm": [
          "46px",
          { lineHeight: "120%", letterSpacing: "0", fontWeight: "600" },
        ],
        "h2-3xl": [
          "80px",
          { lineHeight: "100%", letterSpacing: "0", fontWeight: "600" },
        ],
        "h2-2xl": [
          "64px",
          { lineHeight: "120%", letterSpacing: "0", fontWeight: "600" },
        ],
        h2: [
          "48px",
          { lineHeight: "120%", letterSpacing: "0", fontWeight: "600" },
        ],
        "h2-md": [
          "40px",
          { lineHeight: "120%", letterSpacing: "0", fontWeight: "600" },
        ],
        "h2-sm": [
          "36px",
          { lineHeight: "120%", letterSpacing: "0", fontWeight: "600" },
        ],
        h3: [
          "24px",
          { lineHeight: "120%", letterSpacing: "0", fontWeight: "600" },
        ],
        h4: [
          "20px",
          { lineHeight: "120%", letterSpacing: "0", fontWeight: "400" },
        ],
        h5: [
          "18px",
          { lineHeight: "120%", letterSpacing: "0", fontWeight: "600" },
        ],
        "h5-semibold": [
          "16px",
          { lineHeight: "120%", letterSpacing: "0", fontWeight: "600" },
        ],
        btn: [
          "16px",
          { lineHeight: "150%", letterSpacing: "0.5px", fontWeight: "600" },
        ],
        "btn-semibold": [
          "24px",
          { lineHeight: "150%", letterSpacing: "0.5px", fontWeight: "600" },
        ],
        body: [
          "16px",
          { lineHeight: "150%", letterSpacing: "0", fontWeight: "400" },
        ],
        "body-sm": [
          "24px",
          { lineHeight: "150%", letterSpacing: "0", fontWeight: "400" },
        ],
        "body-semibold": [
          "16px",
          { lineHeight: "150%", letterSpacing: "0", fontWeight: "600" },
        ],
        small: [
          "12px",
          { lineHeight: "16px", letterSpacing: "0", fontWeight: "400" },
        ],
        "small-semibold": [
          "12px",
          { lineHeight: "16px", letterSpacing: "0", fontWeight: "600" },
        ],
        xs: [
          "8px",
          { lineHeight: "16px", letterSpacing: "0", fontWeight: "400" },
        ],
      },
      colors: {
        white: "hsl(var(--white))",
        blue: {
          50: "hsl(var(--blue-50))",
          100: "hsl(var(--blue-100))",
          200: "hsl(var(--blue-200))",
          300: "hsl(var(--blue-300))",
          400: "hsl(var(--blue-400))",
          500: "hsl(var(--blue-500))",
          600: "hsl(var(--blue-600))",
          700: "hsl(var(--blue-700))",
          800: "hsl(var(--blue-800))",
          900: "hsl(var(--blue-900))",
        },
        violet: {
          100: "hsl(var(--violet-100))",
          200: "hsl(var(--violet-200))",
          300: "hsl(var(--violet-300))",
          400: "hsl(var(--violet-400))",
          500: "hsl(var(--violet-500))",
          600: "hsl(var(--violet-600))",
          700: "hsl(var(--violet-700))",
          800: "hsl(var(--violet-800))",
          900: "hsl(var(--violet-900))",
        },
        black: {
          100: "hsl(var(--black-100))",
          200: "hsl(var(--black-200))",
          300: "hsl(var(--black-300))",
          400: "hsl(var(--black-400))",
          500: "hsl(var(--black-500))",
          600: "hsl(var(--black-600))",
          700: "hsl(var(--black-700))",
          800: "hsl(var(--black-800))",
          900: "hsl(var(--black-900))",
        },
        red: {
          50: "hsl(var(--red-50))",
          300: "hsl(var(--red-300))",
          500: "hsl(var(--red-500))",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      screens: {
        sm: "350px",
        ms: "480px",
        "3xl": "1920px",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar")],
} satisfies Config;
