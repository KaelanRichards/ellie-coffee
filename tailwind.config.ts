import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          100: '#F5E6D3',
          200: '#E6D0B8',
          300: '#D7BA9C',
          400: '#C8A581',
          500: '#B98F65',
          600: '#A67A4A',
          700: '#8C652E',
          800: '#735013',
          900: '#593B00',
        },
      },
    },
  },
  plugins: [],
};

export default config;
