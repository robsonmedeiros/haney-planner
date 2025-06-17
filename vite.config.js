
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const ports = {
  development: 3000,
  hom: 3001,
  production: 3002,
  preview: 3003,
};

const mode = process.env.VITE_ENV || 'development';

export default defineConfig({
  base: '/haney-planner/',
  plugins: [react()],
  server: {
    port: ports[mode] || 3000,
  },
  build: {
    outDir: 'dist',
  },
  define: {
    __DATA_PATH__: JSON.stringify('data/HaneyPlanner.json'),
  },
});
