import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#1e3a5f',
        'navy-dark': '#0f2438',
        'navy-light': '#2d5a8c',
        'forest': '#2d5f3f',
        'forest-dark': '#1a3724',
        'forest-light': '#4a8c5f',
        'sage': '#7a9b6b',
      },
    },
  },
  plugins: [],
};

export default config;
