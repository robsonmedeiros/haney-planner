
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const ports = {
  development: 3000,
  hom: 3001,  
  preview: 3003,
};

const mode = process.env.VITE_ENV || 'development';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
  
	return {
		base: env.VITE_BASE_PATH,
		plugins: [react()],
		server: {
		port: ports[mode],
		},
		build: {
			outDir: 'dist',
		},
		define: {
			__DATA_PATH__: JSON.stringify(env.VITE_DATA_PATH),
		}
	};
});
