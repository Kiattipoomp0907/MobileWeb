import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  base: '/MobileWeb/docs/Lab6/', // ใช้ relative path
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: '../../docs/Lab6', // Build ไปที่ docs/Lab6
    emptyOutDir: true,
  },
});
