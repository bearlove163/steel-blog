import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://bearlove163.github.io',
  base: '/steel-blog',
  vite: {
    plugins: [tailwindcss()],
  },
});
