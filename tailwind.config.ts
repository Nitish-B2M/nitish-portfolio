import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFD1A8',
          100: '#FFE4CA',
          200: '#FFD1A8',
          300: '#FF9F5A',
          400: '#FF8534',
          500: '#FF6B0D',
          600: '#E85D00',
          700: '#CC4E00',
          800: '#A33F00',
          900: '#7A2F00',
        },
        brand: {
          red: '#FF0000',
          'dark-orange': '#FF4500',
          orange: '#FF7300',
          'light-orange': '#FF9100',
          yellow: '#FFAA00',
        },
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config; 