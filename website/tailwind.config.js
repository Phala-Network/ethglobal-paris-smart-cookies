/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme')

export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js}",
  ],
  theme: {
    borderRadius: {
      none: '0',
      sm: '0.125rem',   // 0.125rem = 2px
      DEFAULT: '0.25rem', // 0.25rem = 4px
      md: '0.375rem',   // 0.375rem = 6px
      lg: '0.5rem',     // 0.5rem = 8px
      xl: '0.75rem',    // 0.75rem = 12px
      '2xl': '1rem',    // 1rem = 16px
      '3xl': '1.5rem',  // 1.5rem = 24px
      '4xl': '1.75rem', // 1.75rem = 28px
      '5xl': '2rem',    // 2rem = 32px
      'full': '9999px',
    }, // END: borderRadius
    extend: {
      fontFamily: {
        sans: ['Montserrat', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
}

