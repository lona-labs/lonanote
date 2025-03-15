import { heroui } from '@heroui/react';
import { Config } from 'tailwindcss';

export default {
  content: [
    // ...
    // make sure it's pointing to the ROOT node_module
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [heroui()],
} as Config;
