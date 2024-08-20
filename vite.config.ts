import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
	],
	build: {

		rollupOptions: {
			input: {
				app: '/index.app.html',
				login: '/index.login.html',
				'verify-success': '/index.verify-success.html',
				'verify-failed': '/index.verify-failed.html'
			}
		}
	},
	resolve: {
		alias: {
			'@': '/src',
		},
	},
	server: {

	}
})
