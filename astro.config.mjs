// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      watch: {
        // Source uploads are copied to public; watching locked archives on Windows
        // can interrupt the dev server's module updates with EBUSY errors.
        ignored: ['**/*.zip', '**/music/**', '**/Projects - Album/**'],
      },
    },
  },
});
