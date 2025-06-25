import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
	plugins: [
		react(),
		federation({
			name: 'remote_goals',
			filename: 'remoteEntry.js',
			exposes: {
				'./Goals': './src/presentation/views/Goals',
			},
			shared: ['react', 'react-dom'],
		}),
		{
			name: 'vite-plugin-notify-host-on-rebuild',
			apply(config, { command }) {
				return Boolean(command === 'build' && config.build?.watch);
			},
			async buildEnd(error) {
				if (!error) {
					try {
						await fetch('http://localhost:5004/__fullReload');
					} catch (e) {
						console.log(e);
					}
				}
			},
		},
	],
	build: {
		modulePreload: false,
		target: 'esnext',
		minify: false,
		cssCodeSplit: false,
	},
});