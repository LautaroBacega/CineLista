/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta cinematográfica principal
        cinema: {
          red: {
            50: "#FEF2F2",
            100: "#FEE2E2",
            200: "#FECACA",
            300: "#FCA5A5",
            400: "#F87171",
            500: "#E50914", // Color principal Netflix-style
            600: "#DC2626",
            700: "#B91C1C",
            800: "#991B1B",
            900: "#7F1D1D",
          },
          blue: {
            50: "#F0F9FF",
            100: "#E0F2FE",
            200: "#BAE6FD",
            300: "#7DD3FC",
            400: "#38BDF8",
            500: "#0EA5E9",
            600: "#0284C7",
            700: "#0369A1",
            800: "#0D253F", // Azul profundo principal
            900: "#0C1E32",
          },
          neutral: {
            50: "#FAFAFA",
            100: "#F5F5F1", // Neutral principal
            200: "#E5E5E5",
            300: "#D4D4D4",
            400: "#A3A3A3",
            500: "#737373",
            600: "#525252",
            700: "#404040",
            800: "#262626",
            900: "#171717",
          },
          gold: {
            50: "#FFFBEB",
            100: "#FEF3C7",
            200: "#FDE68A",
            300: "#FCD34D",
            400: "#FBBF24",
            500: "#FFD700", // Dorado principal
            600: "#D97706",
            700: "#B45309",
            800: "#92400E",
            900: "#78350F",
          },
        },
      },
      fontFamily: {
        display: ["Montserrat", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        cinema: "0 4px 6px -1px rgba(229, 9, 20, 0.1), 0 2px 4px -1px rgba(229, 9, 20, 0.06)",
        "cinema-lg": "0 10px 15px -3px rgba(229, 9, 20, 0.1), 0 4px 6px -2px rgba(229, 9, 20, 0.05)",
        "cinema-xl": "0 20px 25px -5px rgba(229, 9, 20, 0.1), 0 10px 10px -5px rgba(229, 9, 20, 0.04)",
        glow: "0 0 20px rgba(255, 215, 0, 0.3)",
        "glow-lg": "0 0 40px rgba(255, 215, 0, 0.4)",
      },
      backgroundImage: {
        "cinema-gradient": "linear-gradient(135deg, #E50914 0%, #0D253F 100%)",
        "cinema-gradient-reverse": "linear-gradient(135deg, #0D253F 0%, #E50914 100%)",
        "gold-gradient": "linear-gradient(135deg, #FFD700 0%, #FCD34D 100%)",
        "dark-gradient": "linear-gradient(135deg, #171717 0%, #404040 100%)",
        "hero-pattern":
          'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23E50914" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        glowPulse: {
          "0%": { boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(255, 215, 0, 0.6)" },
        },
      },
    },
  },
  plugins: [],
}
