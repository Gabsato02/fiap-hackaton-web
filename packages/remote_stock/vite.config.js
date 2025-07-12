import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remote_stock',
      filename: 'remoteEntry.js',
      exposes: {
        './Stock': './src/presentation/views/Stock',
      },
      remotes: {
        hostApp: 'http://localhost:5000/assets/remoteEntry.js',
      },
      shared: [
        'react',
        'react-dom',
        '@mui/material',
        '@mui/icons-material',
        '@emotion/react',
        '@emotion/styled',
      ],
    }),
    {
      name: 'vite-plugin-notify-host-on-rebuild',
      apply(config, { command }) {
        return Boolean(command === 'build' && config.build?.watch);
      },
      async buildEnd(error) {
        if (!error) {
          try {
            await fetch('http://localhost:5000/__fullReload');
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
  preview: {
    port: 5003, // A porta específica deste remote
    host: true, // Garante que o servidor seja acessível na sua rede
  },
});
