/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: '#ff6b2b',
        gold: '#ffb830',
        charcoal: '#1c1c1e',
        mint: '#00c9a7',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'dm': ['DM Sans', 'sans-serif'],
        'space-mono': ['Space Mono', 'monospace'],
      },
      animation: {
        popIn: 'popIn 0.4s ease',
        bounce: 'bounce 1s 0.4s ease both',
      },
      keyframes: {
        popIn: {
          '0%': { opacity: 0, transform: 'scale(0.85)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
