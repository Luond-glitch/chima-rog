/** Palette sampled from the CHIMA logo (olive wordmark, leaf green, sun orange, cracked-earth amber). */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: '#1d4a2c', 700: '#255c37', 800: '#1d4a2c', 900: '#12301c' },
        leaf: { DEFAULT: '#3f9a3c', 400: '#62b45a', 500: '#3f9a3c', 600: '#33802f' },
        olive: { DEFAULT: '#5d6b2b', 700: '#4a5622' },
        sun: { DEFAULT: '#e9a93a', 400: '#f2bf5e', 500: '#e9a93a', 600: '#d18e1f' },
        terracotta: { DEFAULT: '#c8642f', 600: '#ad5226' },
        earth: { DEFAULT: '#7a5230', 800: '#4a3220' },
        sand: { DEFAULT: '#eee0c3', 200: '#f4ead3', 300: '#eee0c3', 400: '#e2cfa6' },
        cream: { DEFAULT: '#fbf6ea', 50: '#fffdf8' },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(29,74,44,.25)',
        lift: '0 24px 50px -20px rgba(29,74,44,.38)',
      },
      keyframes: {
        drift: { '0%,100%': { transform: 'translateX(0)' }, '50%': { transform: 'translateX(24px)' } },
        spinslow: { to: { transform: 'rotate(360deg)' } },
        sway: { '0%,100%': { transform: 'rotate(-1.2deg)' }, '50%': { transform: 'rotate(1.2deg)' } },
      },
      animation: {
        drift: 'drift 18s ease-in-out infinite',
        spinslow: 'spinslow 120s linear infinite',
        sway: 'sway 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
