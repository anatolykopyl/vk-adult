import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.config';
import path from "path";

export default defineConfig({
  plugins: [crx({ manifest })],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    }
  },
  build: {
    rollupOptions: {
      input: {
        donate: 'src/pages/donate.html',
      },
    },
  },
});
