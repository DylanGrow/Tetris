/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void:    { DEFAULT: '#050510', 900: '#050510', 800: '#0a0a20' },
      },
      boxShadow: {
        neon:    '0 0 10px #00fff9, 0 0 30px #00fff980',
        magenta: '0 0 10px #ff00e5, 0 0 30px #ff00e580',
        amber:   '0 0 10px #ffcc00, 0 0 30px #ffcc0080',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'blink':      'blink 1s step-end infinite',
        'glitch':     'glitch 4s infinite',
      },
      keyframes: {
        blink: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0' },
        },
        glitch: {
          '0%,90%,100%': { transform: 'translate(0)' },
          '92%': { transform: 'translate(-2px, 1px)' },
          '94%': { transform: 'translate(2px, -1px)' },
          '96%': { transform: 'translate(-1px, 2px)' },
        },
      },
    },
  },
  plugins: [],
};
