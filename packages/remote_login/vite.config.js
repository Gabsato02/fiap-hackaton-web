import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  base: 'http://localhost:5001/',
  plugins: [
    react(),
    federation({
      name: 'remote_login',
      filename: 'remoteEntry.js',
      exposes: {
        './Login': './src/presentation/views/Login',
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
            // Aponte para a porta do HOST
            await fetch('http://localhost:5000/__fullReload');
          } catch (e) {
            console.log('Could not notify host for reload', e);
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
    port: 5001, // A porta específica deste remote
    host: true, // Garante que o servidor seja acessível na sua rede
  },
});
