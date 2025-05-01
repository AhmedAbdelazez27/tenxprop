import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'chart.js/auto': 'chart.js',
    },
  },
  optimizeDeps: {
    include: ['chart.js'],
  },
});
