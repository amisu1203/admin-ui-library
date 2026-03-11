import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@daggle-dev/admin-ui': path.resolve(__dirname, '../src/index.ts'),
      '@daggle-dev/admin-ui/styles': path.resolve(
        __dirname,
        '../src/styles/tokens.css'
      ),
    },
  },
});
